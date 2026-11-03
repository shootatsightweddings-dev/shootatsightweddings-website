const { test } = require('node:test');
const assert = require('node:assert/strict');
const Blog = require('../src/models/Blog');
const Image = require('../src/models/Image');
const Shoot = require('../src/models/Shoot');
const ContentPage = require('../src/models/ContentPage');
const pageService = require('../src/services/contentPageService');
const { validateSeo } = require('../src/services/seoFields');

test('legacy content validates without rewriting its URLs or requiring a bulk migration',async()=>{
  const blog=new Blog({title:'Existing article',slug:'existing',content:'Article body'});
  await blog.validate();assert.equal(blog.authorType,'Organization');
  const shoot=new Shoot({title:'Existing shoot',slug:'existing',category:'Wedding',location:'Bengaluru',date:'2026',desc:'Celebration',heroImage:'https://example.test/hero.webp',gallery:['https://example.test/photo.webp']});
  await shoot.validate();assert.equal(shoot.gallery[0],'https://example.test/photo.webp');
  const image=new Image({url:'https://example.test/image.webp',filename:'image.webp',originalName:'image.jpg',mimeType:'image/webp',size:10});
  await assert.rejects(image.validate(),/altText/);
  image.altText='The couple walking through their wedding venue';await image.validate();
  assert.throws(()=>validateSeo({canonicalUrl:'javascript:alert(1)'}),error=>error.statusCode===400);
});

test('published pages, drafts and admin persistence use the same validated content',async()=>{
  const originalFind=ContentPage.find,originalUpdate=ContentPage.findOneAndUpdate;
  const connection=ContentPage.db,originalState=connection.readyState;
  const stored=[{kind:'service',slug:'wedding-photography',title:'Unpublished service',isPublished:false}];
  try{
    connection.readyState=1;
    ContentPage.find=()=>({maxTimeMS:()=>({lean:async()=>stored})});
    ContentPage.findOneAndUpdate=async(filter,update)=>{
      const page=new ContentPage(update.$set);await page.validate();return page.toObject();
    };
    assert.equal(await pageService.getPage('service','wedding-photography'),null);
    assert((await pageService.listPages(true)).some(page=>page.slug==='wedding-photography'));
    assert((await pageService.listPages()).some(page=>page.kind==='location'&&page.slug==='bangalore'));
    const saved=await pageService.savePage({kind:'location',slug:'test-city',title:'A real locality',body:'Useful locality content',isPublished:true});
    assert.equal(saved.slug,'test-city');
    await assert.rejects(pageService.savePage({kind:'service',slug:'../bad',title:'Bad',body:'Body'}),error=>error.statusCode===400);
    await assert.rejects(pageService.savePage({kind:'service',slug:'test',title:'Test',body:'Body',heroImage:'https://example.test/hero.webp'}),error=>error.statusCode===400);
    connection.readyState=0;
    await assert.rejects(pageService.listPages(),error=>error.statusCode===503);
  }finally{ContentPage.find=originalFind;ContentPage.findOneAndUpdate=originalUpdate;connection.readyState=originalState;}
});

test('gallery removal keeps descriptions aligned; invalid metadata and undescribed uploads cannot save',async()=>{
  const original=Shoot.findById;
  const doc={_id:'123456789012345678901234',gallery:['https://example.test/a.webp','https://example.test/b.webp'],galleryAlt:['First scene','Second scene'],save:async function(){return this;}};
  Shoot.findById=async()=>doc;
  const controller=require('../src/controllers/shootController');
  const response=()=>({code:200,status(code){this.code=code;return this;},json(data){this.data=data;return this;}});
  try{
    const removed=response();await controller.removeGalleryImage({params:{id:doc._id},body:{imageUrl:doc.gallery[0]}},removed,error=>{throw error;});
    assert.deepEqual(removed.data.gallery,['https://example.test/b.webp']);
    assert.deepEqual(removed.data.galleryAlt,['Second scene']);
    let error;
    await controller.updateShootMetadata({params:{id:doc._id},body:{galleryAlt:['Wrong','Length']}},response(),caught=>{error=caught;});
    assert.equal(error.statusCode,400);assert.deepEqual(doc.galleryAlt,['Second scene']);
    await controller.addGalleryImages({params:{id:doc._id},body:{galleryAlt:'[]'},files:{gallery:[{buffer:Buffer.from('not uploaded')}] }},response(),caught=>{error=caught;});
    assert.equal(error.statusCode,400);
    const saved=response();await controller.updateShootMetadata({params:{id:doc._id},body:{galleryAlt:['Authored scene'],narrative:'A genuine case study'}},saved,error=>{throw error;});
    assert.equal(doc.narrative,'A genuine case study');assert.deepEqual(doc.galleryAlt,['Authored scene']);
  }finally{Shoot.findById=original;}
});

test('editing a blog title preserves its existing URL and original publication timestamp',async()=>{
  const original=Blog.findById;
  const createdAt=new Date('2025-01-02T10:00:00Z');
  const blog={title:'Original title',slug:'original-title',createdAt,isPublished:true,publishedAt:null,save:async function(){return this;}};
  Blog.findById=async()=>blog;
  try{
    const updated=await require('../src/services/blogService').updateBlog('id',{title:'Updated title',isPublished:true,metaDescription:'An authored description'});
    assert.equal(updated.slug,'original-title');assert.equal(updated.publishedAt,createdAt);assert.equal(updated.metaDescription,'An authored description');
  }finally{Blog.findById=original;}
});

test('new page management endpoints require admin authentication',async()=>{
  const express=require('express');const app=express();app.use(express.json());app.use('/api/admin',require('../src/routes/adminRoutes'));
  const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  try{
    const url=`http://127.0.0.1:${server.address().port}/api/admin/pages`;
    assert.equal((await fetch(url)).status,401);
    assert.equal((await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:'{}'})).status,401);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
