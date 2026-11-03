import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import './ContentPages.css';

const origin='https://www.shootatsightweddings.com';

function PageContent({kind,slug}) {
  const [result,setResult]=useState({loading:true,pages:[],page:null});
  useEffect(()=>{
    const controller=new AbortController();
    const endpoint=slug ? `/pages/${kind}/${slug}` : '/pages';
    fetch(`${API_URL}${endpoint}`,{signal:controller.signal}).then(async res=>{
      const data=await res.json();
      setResult({loading:false,pages:(data.pages || []).filter(page=>page.kind===kind),page:res.ok?data.page:null});
    }).catch(error=>{if(error.name!=='AbortError')setResult({loading:false,pages:[],page:null});});
    return ()=>controller.abort();
  },[kind,slug]);
  const page=result.page;
  const plural=kind==='service'?'services':'locations';
  const title=page?.title || (slug?'Page not found':kind==='service'?'Photography and film services':'Where we work');
  const schema=page ? [{
    '@context':'https://schema.org','@type':'Service','@id':`${origin}/${plural}/${page.slug}#service`,
    name:page.title,description:page.metaDescription || page.body.split('\n')[0],serviceType:page.title,
    provider:{'@id':`${origin}/#business`},
    areaServed:page.areaServed?{'@type':'City',name:page.areaServed}:undefined,
    url:`${origin}/${plural}/${page.slug}`,
  }] : [];
  useSEO({title:page?.metaTitle || title,description:page?.metaDescription || page?.body?.split('\n')[0] || `Explore ${plural} from Shoot At Sight Weddings.`,canonicalUrl:page?.canonicalUrl,ogImage:page?.heroImage || undefined,jsonLd:schema,noindex:!!slug&&!page});
  if(result.loading)return <div className="content-page container section-padding"><p>Loading…</p></div>;
  return <div className="content-page container section-padding">
    <Breadcrumbs currentLabel={page?.title}/>
    <h1 className="section-title-large">{title}</h1>
    {slug&&!page ? <p>This page is unavailable. <Link to={`/${plural}`}>Explore {plural}</Link>.</p> : page ? <>
      {page.heroImage&&<img className="content-page-hero" src={page.heroImage} alt={page.heroImageAlt} fetchPriority="high"/>}
      <div className="content-page-body">{page.body.split(/\n\s*\n/).filter(Boolean).map((text,i)=><p key={i}>{text}</p>)}</div>
      {!!page.faqs?.length&&<section><h2>Questions about {page.title}</h2>{page.faqs.map((faq,i)=><details key={i}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</section>}
      <Link className="btn-premium" to="/contact">Discuss your celebration</Link>
      <p><Link to="/portfolio">Explore the portfolio</Link> · <Link to="/films">Watch our films</Link></p>
    </> : <div className="content-page-grid">{result.pages.map(item=><article key={item.slug}>
      <h2><Link to={`/${plural}/${item.slug}`}>{item.title}</Link></h2><p>{item.metaDescription || item.body.split('\n')[0]}</p>
      <Link to={`/${plural}/${item.slug}`}>Explore {item.title}</Link>
    </article>)}</div>}
  </div>;
}

export default function ContentPages({kind}) {
  const {slug}=useParams();
  return <PageContent key={`${kind}/${slug || ''}`} kind={kind} slug={slug}/>;
}
