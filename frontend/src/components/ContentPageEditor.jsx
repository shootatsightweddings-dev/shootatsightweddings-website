import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import SeoFields from './SeoFields';

const emptyPage={kind:'service',slug:'',title:'',body:'',heroImage:'',heroImageAlt:'',areaServed:'',faqs:[],isPublished:false};
export default function ContentPageEditor(){
  const [pages,setPages]=useState([]),[editing,setEditing]=useState(null),[message,setMessage]=useState(''),[saving,setSaving]=useState(false);
  const headers={Authorization:`Bearer ${localStorage.getItem('adminToken')}`,'Content-Type':'application/json'};
  useEffect(()=>{
    const controller=new AbortController();
    fetch(`${API_URL}/admin/pages`,{headers:{Authorization:`Bearer ${localStorage.getItem('adminToken')}`},signal:controller.signal}).then(res=>res.json()).then(data=>setPages(data.pages || [])).catch(error=>{if(error.name!=='AbortError')setMessage('Could not load pages.');});
    return ()=>controller.abort();
  },[]);
  const save=async event=>{
    event.preventDefault();setSaving(true);setMessage('');
    try{
      const res=await fetch(`${API_URL}/admin/pages`,{method:'PUT',headers,body:JSON.stringify(editing)});const data=await res.json();
      if(!res.ok)throw new Error(data.message || 'Save failed.');
      setPages(previous=>[...previous.filter(page=>!(page.kind===data.page.kind&&page.slug===data.page.slug)),data.page]);
      setEditing(null);setMessage('Page saved. Rebuild and deploy to refresh prerendered search content.');
    }catch(error){setMessage(error.message);}finally{setSaving(false);}
  };
  const field=(key,label,type='text',required=false)=><div className="input-group-chic" key={key}><label htmlFor={`page-${key}`}>{label}</label><input id={`page-${key}`} type={type} required={required} value={editing[key] || ''} onChange={e=>setEditing({...editing,[key]:e.target.value})}/></div>;
  return <section className="admin-chic-form"><h2>Service and location pages</h2><p>Publish useful content for real services and locations you serve. Uncheck Published to hide a page.</p>
    {message&&<p role="status">{message}</p>}
    <button type="button" className="btn-edit-gallery" onClick={()=>setEditing({...emptyPage})}>Create page</button>
    {!editing&&pages.map(page=><div key={`${page.kind}/${page.slug}`} style={{padding:16,borderBottom:'1px solid #7775'}}>
      <strong>{page.title}</strong> · {page.kind} · {page.isPublished?'Published':'Draft'} <button type="button" onClick={()=>setEditing({...page,faqs:[...(page.faqs || [])]})}>Edit {page.title}</button>
    </div>)}
    {editing&&<form onSubmit={save}>
      <label htmlFor="page-kind">Page type</label><select id="page-kind" disabled={!!editing._id} value={editing.kind} onChange={e=>setEditing({...editing,kind:e.target.value})}><option value="service">Service</option><option value="location">Location</option></select>
      {field('slug','URL slug (lowercase words separated by hyphens)','text',true)}
      {editing._id&&<p>Keep the existing slug to preserve links. Renaming creates a separate page.</p>}
      {field('title','Page title','text',true)}
      <SeoFields value={editing} onChange={setEditing}/>
      {field('areaServed','City or locality served (optional)')}
      {field('heroImage','Hero image URL (optional)','url')}
      {field('heroImageAlt','Hero image description')}
      <div className="input-group-chic"><label htmlFor="page-body">Page content (blank line between paragraphs)</label><textarea id="page-body" rows={10} required value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value})}/></div>
      <h3>Visitor questions</h3>
      {editing.faqs.map((faq,index)=><div key={index} className="input-group-chic">
        <label htmlFor={`question-${index}`}>Question {index+1}</label><input id={`question-${index}`} required value={faq.q} onChange={e=>setEditing({...editing,faqs:editing.faqs.map((item,i)=>i===index?{...item,q:e.target.value}:item)})}/>
        <label htmlFor={`answer-${index}`}>Answer {index+1}</label><textarea id={`answer-${index}`} required value={faq.a} onChange={e=>setEditing({...editing,faqs:editing.faqs.map((item,i)=>i===index?{...item,a:e.target.value}:item)})}/>
        <button type="button" onClick={()=>setEditing({...editing,faqs:editing.faqs.filter((_,i)=>i!==index)})}>Remove question</button>
      </div>)}
      <button type="button" onClick={()=>setEditing({...editing,faqs:[...editing.faqs,{q:'',a:''}]})}>Add question</button>
      <label style={{display:'block',margin:'20px 0'}}><input type="checkbox" checked={editing.isPublished} onChange={e=>setEditing({...editing,isPublished:e.target.checked})}/> Published</label>
      <button type="submit" className="btn-premium-submit" disabled={saving}>{saving?'Saving…':'Save page'}</button> <button type="button" onClick={()=>setEditing(null)}>Cancel</button>
    </form>}
  </section>;
}
