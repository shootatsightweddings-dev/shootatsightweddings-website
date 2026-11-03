import { useId } from 'react';
import SeoFields from './SeoFields';

export default function ShootStoryFields({value, onChange, gallery = [], requiredImages = false, testimonials = []}) {
  const id = useId();
  const field = (key,label,rows=1) => <div className="input-group-chic" key={key}>
    <label htmlFor={`${id}-${key}`}>{label}</label>
    {rows>1 ? <textarea id={`${id}-${key}`} rows={rows} value={value[key] || ''} onChange={e=>onChange({...value,[key]:e.target.value})}/> :
      <input id={`${id}-${key}`} required={key==='heroImageAlt' && requiredImages} value={value[key] || ''} onChange={e=>onChange({...value,[key]:e.target.value})}/>}
  </div>;
  return <>
    <SeoFields value={value} onChange={onChange}/>
    {field('heroImageAlt','Cover image description')}
    <fieldset style={{border:'1px solid #7775',padding:16,marginBottom:20,minWidth:0}}>
      <legend>Gallery image descriptions</legend>
      {gallery.length===0 && <p>Add gallery photos to describe them individually.</p>}
      {gallery.map((item,index)=><div className="input-group-chic" key={typeof item==='string'?item:index}>
        <label htmlFor={`${id}-gallery-${index}`}>Photo {index+1}{typeof item==='string'?'':` — ${item.name}`}</label>
        {typeof item==='string' && <img src={item} alt="" loading="lazy" width={96} height={72} style={{objectFit:'cover',borderRadius:4,marginBottom:8}}/>}
        <input id={`${id}-gallery-${index}`} required={requiredImages} value={value.galleryAlt?.[index] || ''} onChange={e=>{
          const descriptions=gallery.map((_,i)=>value.galleryAlt?.[i] || '');descriptions[index]=e.target.value;onChange({...value,galleryAlt:descriptions});
        }}/>
      </div>)}
    </fieldset>
    {field('narrative','Case study narrative (optional; separate paragraphs with blank lines)',6)}
    {field('resultsSummary','Case study summary (optional)',3)}
    {!!testimonials.length && <div className="input-group-chic"><label htmlFor={`${id}-testimonial`}>Use an existing client testimonial (optional)</label>
      <select id={`${id}-testimonial`} value={value.testimonialId || ''} onChange={event=>{
        const selected=testimonials.find(item=>item._id===event.target.value);
        onChange({...value,testimonialId:event.target.value,...(selected?{clientQuote:selected.quote,clientQuoteAuthor:selected.author}:{})});
      }}><option value="">Write a quotation below</option>{testimonials.map(item=><option key={item._id} value={item._id}>{item.author}</option>)}</select>
    </div>}
    {field('clientQuote','Client quotation (use only with permission)',3)}
    {field('clientQuoteAuthor','Quotation author')}
  </>;
}
