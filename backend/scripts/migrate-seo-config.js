// Run from backend: node scripts/migrate-seo-config.js --apply
// Without --apply this is a read-only preview. Existing admin content is preserved.
require('dotenv').config({path:require('path').join(__dirname,'../.env'),quiet:true});
const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');
const SiteConfig=require('../src/models/SiteConfig');
const video='https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Naveen%20%26%20Kate%204K%20Teaser.mp4';

async function main(){
  require('dns').setServers(['8.8.8.8','8.8.4.4']);
  await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:8000});
  try{
    const docs=await SiteConfig.find({sectionKey:{$in:['hero','featured_film','contact_page']}}).lean();
    const changes=[];
    for(const doc of docs){
      if(['hero','featured_film'].includes(doc.sectionKey) && !/^https:\/\//.test(doc.content?.videoUrl || '')) changes.push({id:doc._id,section:doc.sectionKey,field:'videoUrl',previous:doc.content?.videoUrl,value:video});
      if(doc.sectionKey==='contact_page' && doc.content?.email==='shootatsightweddings@gmail.com') changes.push({id:doc._id,section:doc.sectionKey,field:'email',previous:doc.content.email,value:'connect@shootatsightweddings.com'});
    }
    console.log(`Planned configuration changes: ${changes.length}`);
    for(const change of changes)console.log(`${change.section}.${change.field}: ${change.value}`);
    if(!process.argv.includes('--apply')){console.log('Preview only. Add --apply to save.');return;}
    if(!changes.length)return;
    const backupDir=path.join(__dirname,'../backups');fs.mkdirSync(backupDir,{recursive:true});
    const backup=path.join(backupDir,`seo-config-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
    fs.writeFileSync(backup,JSON.stringify({createdAt:new Date().toISOString(),documents:docs},null,2));
    for(const change of changes){
      const key=`content.${change.field}`;
      const condition=change.previous===undefined?{$exists:false}:change.previous;
      const result=await SiteConfig.updateOne({_id:change.id,[key]:condition},{$set:{[key]:change.value}});
      if(result.modifiedCount!==1)throw new Error(`Concurrent change detected in ${change.section}; review the backup before retrying.`);
    }
    console.log('Configuration updated. A local backup was saved in backend/backups/.');
  }finally{await mongoose.disconnect();}
}
main().catch(error=>{console.error('Configuration migration failed:',error.name);process.exitCode=1;});
