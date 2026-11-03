import { useId } from 'react';

export default function SeoFields({ value = {}, onChange, author = false, image = false }) {
  const id = useId();
  const input = (key, label, type = 'text', required = false) => (
    <div className="input-group-chic" key={key}>
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <input id={`${id}-${key}`} type={type} required={required} value={value[key] || ''}
        onChange={event => onChange({ ...value, [key]: event.target.value })} />
    </div>
  );
  return <fieldset style={{border:'1px solid #7775',padding:20,margin:'20px 0',minWidth:0}}>
    <legend>Search appearance and accessibility</legend>
    {input('metaTitle', 'SEO title (optional)')}
    <div className="input-group-chic">
      <label htmlFor={`${id}-description`}>SEO description (optional)</label>
      <textarea id={`${id}-description`} rows={3} value={value.metaDescription || ''} maxLength={500}
        onChange={event => onChange({...value,metaDescription:event.target.value})} />
      <small>{(value.metaDescription || '').length} characters · Around 155 is a writing guideline.</small>
    </div>
    {input('canonicalUrl', 'Canonical HTTPS URL (optional)', 'url')}
    {image && input('altText', 'Cover image description', 'text', true)}
    {author && <>
      {input('authorName', 'Author name (blank uses Shoot At Sight Weddings)')}
      <label htmlFor={`${id}-authorType`}>Author type</label>
      <select id={`${id}-authorType`} value={value.authorType || 'Organization'} onChange={event=>onChange({...value,authorType:event.target.value})}>
        <option value="Organization">Organization</option><option value="Person">Person</option>
      </select>
      {input('authorUrl', 'Author profile URL (optional)', 'url')}
    </>}
  </fieldset>;
}
