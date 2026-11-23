import { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2, Plus, RefreshCw } from 'lucide-react';
import './VisualEditorDrawer.css';

export default function VisualEditorDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  sectionKey,
  initialData,
  onSave,
  onUploadImage,
  onUploadVideo,
  isSaving
}) {
  const [formData, setFormData] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadingVideoField, setUploadingVideoField] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const copy = { ...prev };
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleFileUpload = async (fieldPath, file) => {
    if (!file || !onUploadImage) return;
    setUploadingField(fieldPath);
    try {
      const url = await onUploadImage(file);
      handleChange(fieldPath, url);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleVideoUpload = async (fieldPath, file, customCallback) => {
    if (!file || !onUploadVideo) return;
    setUploadingVideoField(fieldPath);
    setVideoProgress(0);
    try {
      const url = await onUploadVideo(file, (percent) => {
        setVideoProgress(percent);
      });
      if (customCallback) {
        customCallback(url);
      } else {
        handleChange(fieldPath, url);
      }
    } catch (err) {
      alert(`Video upload failed: ${err.message}`);
    } finally {
      setUploadingVideoField(null);
      setVideoProgress(0);
    }
  };

  // Helper for array lists (services, phases, films, faqs, collections)
  const handleAddListItem = (arrayKey, defaultItem) => {
    setFormData((prev) => {
      const copy = { ...prev };
      const list = Array.isArray(copy[arrayKey]) ? [...copy[arrayKey]] : [];
      list.push(defaultItem);
      copy[arrayKey] = list;
      return copy;
    });
  };

  const handleDeleteListItem = (arrayKey, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setFormData((prev) => {
      const copy = { ...prev };
      const list = [...(copy[arrayKey] || [])];
      list.splice(index, 1);
      copy[arrayKey] = list;
      return copy;
    });
  };

  const handleListItemChange = (arrayKey, index, field, value) => {
    setFormData((prev) => {
      const copy = { ...prev };
      const list = [...(copy[arrayKey] || [])];
      list[index] = { ...list[index], [field]: value };
      copy[arrayKey] = list;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(sectionKey, formData);
  };

  return (
    <div className="ved-overlay" onClick={onClose}>
      <aside className="ved-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="ved-header">
          <div>
            <span className="ved-badge">SECTION BUILDER</span>
            <h3 className="ved-title">{title}</h3>
            {subtitle && <p className="ved-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="ved-close-btn" onClick={onClose} title="Close without saving">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="ved-body">
          {/* Dynamic Form Fields based on sectionKey */}
          <div className="ved-fields-container">
            {renderFieldsForSection(
              sectionKey,
              formData,
              handleChange,
              handleFileUpload,
              uploadingField,
              handleAddListItem,
              handleDeleteListItem,
              handleListItemChange,
              handleVideoUpload,
              uploadingVideoField,
              videoProgress
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="ved-footer">
            <button type="button" className="ved-btn-cancel" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="ved-btn-save" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Live…</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dynamic Field Generators for Every Section of Every Page
// ─────────────────────────────────────────────────────────────
function renderFieldsForSection(
  sectionKey,
  data,
  onChange,
  onUpload,
  uploadingField,
  onAddList,
  onDeleteList,
  onListChange,
  onUploadVideo,
  uploadingVideoField,
  videoProgress
) {
  if (!data) return <p className="ved-empty">Loading section data…</p>;

  // 1. HERO SECTION (Home)
  if (sectionKey === 'hero') {
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Tagline / Small Kicker</label>
          <input 
            type="text" 
            value={data.tagline || ''} 
            onChange={(e) => onChange('tagline', e.target.value)} 
            placeholder="e.g. SHOOT @ SIGHT // THE ART OF PRESERVATION"
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Headline Line 1 (Main)</label>
            <input 
              type="text" 
              value={data.line1Main || ''} 
              onChange={(e) => onChange('line1Main', e.target.value)} 
              placeholder="We Don't Just"
            />
          </div>
          <div className="ved-group">
            <label>Line 1 (Italic / Styled)</label>
            <input 
              type="text" 
              value={data.line1Italic || ''} 
              onChange={(e) => onChange('line1Italic', e.target.value)} 
              placeholder="Capture"
            />
          </div>
          <div className="ved-group">
            <label>Line 1 (End)</label>
            <input 
              type="text" 
              value={data.line1End || ''} 
              onChange={(e) => onChange('line1End', e.target.value)} 
              placeholder="Weddings."
            />
          </div>
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Headline Line 2 (Main)</label>
            <input 
              type="text" 
              value={data.line2Main || ''} 
              onChange={(e) => onChange('line2Main', e.target.value)} 
              placeholder="We Preserve"
            />
          </div>
          <div className="ved-group">
            <label>Line 2 (Gold Accent)</label>
            <input 
              type="text" 
              value={data.line2Highlight || ''} 
              onChange={(e) => onChange('line2Highlight', e.target.value)} 
              placeholder="Emotions"
            />
          </div>
          <div className="ved-group">
            <label>Line 2 (End)</label>
            <input 
              type="text" 
              value={data.line2End || ''} 
              onChange={(e) => onChange('line2End', e.target.value)} 
              placeholder="Forever."
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Hero Background Video (Desktop MP4)</label>
          <div className="ved-image-picker">
            <input 
              type="url" 
              value={data.videoUrl || ''} 
              onChange={(e) => onChange('videoUrl', e.target.value)} 
              placeholder="Paste video link or upload video file"
            />
            <label className="ved-upload-btn" style={{ background: '#C5A46D', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              <Upload className="w-4 h-4" />
              <span>{uploadingVideoField === 'videoUrl' ? `Uploading ${videoProgress}%` : 'Upload Video'}</span>
              <input 
                type="file" 
                accept="video/mp4,video/webm,video/quicktime" 
                style={{ display: 'none' }}
                disabled={uploadingVideoField === 'videoUrl'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadVideo) onUploadVideo('videoUrl', file);
                }}
              />
            </label>
          </div>
          {data.videoUrl && (
            <div className="ved-preview-box" style={{ marginTop: '8px' }}>
              <video src={data.videoUrl} controls style={{ width: '100%', maxHeight: '140px', borderRadius: '4px', background: '#000' }} />
            </div>
          )}
        </div>

        <div className="ved-group">
          <label>Mobile Video (Optional Low-Bitrate Version)</label>
          <div className="ved-image-picker">
            <input 
              type="url" 
              value={data.mobileVideoUrl || ''} 
              onChange={(e) => onChange('mobileVideoUrl', e.target.value)} 
              placeholder="Paste video link or upload video file"
            />
            <label className="ved-upload-btn" style={{ background: '#C5A46D', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              <Upload className="w-4 h-4" />
              <span>{uploadingVideoField === 'mobileVideoUrl' ? `Uploading ${videoProgress}%` : 'Upload Video'}</span>
              <input 
                type="file" 
                accept="video/mp4,video/webm,video/quicktime" 
                style={{ display: 'none' }}
                disabled={uploadingVideoField === 'mobileVideoUrl'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadVideo) onUploadVideo('mobileVideoUrl', file);
                }}
              />
            </label>
          </div>
        </div>

        <div className="ved-group">
          <label>Hero Poster / Fallback Cover Image</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.bgImage || ''} 
              onChange={(e) => onChange('bgImage', e.target.value)} 
              placeholder="Image URL"
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>{uploadingField === 'bgImage' ? 'Uploading…' : 'Upload'}</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('bgImage', e.target.files[0])}
                disabled={uploadingField === 'bgImage'}
              />
            </label>
          </div>
          {data.bgImage && (
            <div className="ved-preview-box">
              <img src={data.bgImage} alt="Hero Poster" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. ABOUT PHILOSOPHY (Home)
  if (sectionKey === 'about_philosophy') {
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Tagline / Number</label>
          <input 
            type="text" 
            value={data.tagline || ''} 
            onChange={(e) => onChange('tagline', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Title Main</label>
            <input 
              type="text" 
              value={data.titleMain || ''} 
              onChange={(e) => onChange('titleMain', e.target.value)} 
              placeholder="The Art"
            />
          </div>
          <div className="ved-group">
            <label>Title Highlight (Gold/Italic)</label>
            <input 
              type="text" 
              value={data.titleHighlight || ''} 
              onChange={(e) => onChange('titleHighlight', e.target.value)} 
              placeholder="Observing"
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Lead Paragraph (Large text)</label>
          <textarea 
            rows="3"
            value={data.pLead || ''} 
            onChange={(e) => onChange('pLead', e.target.value)} 
          />
        </div>

        <div className="ved-group">
          <label>Body Narrative</label>
          <textarea 
            rows="4"
            value={data.pBody || ''} 
            onChange={(e) => onChange('pBody', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Stat 1 Number</label>
            <input 
              type="text" 
              value={data.stat1Num || ''} 
              onChange={(e) => onChange('stat1Num', e.target.value)} 
              placeholder="250+"
            />
          </div>
          <div className="ved-group">
            <label>Stat 1 Label</label>
            <input 
              type="text" 
              value={data.stat1Label || ''} 
              onChange={(e) => onChange('stat1Label', e.target.value)} 
              placeholder="Weddings Covered"
            />
          </div>
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Stat 2 Number</label>
            <input 
              type="text" 
              value={data.stat2Num || ''} 
              onChange={(e) => onChange('stat2Num', e.target.value)} 
              placeholder="15+"
            />
          </div>
          <div className="ved-group">
            <label>Stat 2 Label</label>
            <input 
              type="text" 
              value={data.stat2Label || ''} 
              onChange={(e) => onChange('stat2Label', e.target.value)} 
              placeholder="Cities Covered"
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Philosophy Image 1 (Editorial Portrait)</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.img1 || ''} 
              onChange={(e) => onChange('img1', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('img1', e.target.files[0])}
              />
            </label>
          </div>
          {data.img1 && <div className="ved-preview-box"><img src={data.img1} alt="Philosophy 1" /></div>}
        </div>

        <div className="ved-group">
          <label>Philosophy Image 2 (Candid Moment)</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.img2 || ''} 
              onChange={(e) => onChange('img2', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('img2', e.target.files[0])}
              />
            </label>
          </div>
          {data.img2 && <div className="ved-preview-box"><img src={data.img2} alt="Philosophy 2" /></div>}
        </div>

        <div className="ved-group">
          <label>Philosophy Image 3 (Detail / Architecture)</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.img3 || ''} 
              onChange={(e) => onChange('img3', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('img3', e.target.files[0])}
              />
            </label>
          </div>
          {data.img3 && <div className="ved-preview-box"><img src={data.img3} alt="Philosophy 3" /></div>}
        </div>
      </div>
    );
  }

  // 3. SERVICES (Home)
  if (sectionKey === 'services') {
    const list = data.list || [];
    return (
      <div className="ved-group-stack">
        <div className="ved-row">
          <div className="ved-group">
            <label>Tagline</label>
            <input 
              type="text" 
              value={data.tagline || ''} 
              onChange={(e) => onChange('tagline', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Title Main</label>
            <input 
              type="text" 
              value={data.titleMain || ''} 
              onChange={(e) => onChange('titleMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Highlight</label>
            <input 
              type="text" 
              value={data.titleHighlight || ''} 
              onChange={(e) => onChange('titleHighlight', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-list-header">
          <label className="ved-list-title">SERVICE CARDS ({list.length})</label>
          <button 
            type="button" 
            className="ved-btn-add-item"
            onClick={() => onAddList('list', {
              num: `0${list.length + 1}`,
              title: 'New Wedding Service',
              desc: 'Describe this luxury bespoke service...',
              img: '/shoot-sight-latest-images/VIJ01478.jpg.webp'
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service Card</span>
          </button>
        </div>

        <div className="ved-cards-list">
          {list.map((item, idx) => (
            <div key={idx} className="ved-card-item">
              <div className="ved-card-item-top">
                <span className="ved-card-num">#{item.num || idx + 1}</span>
                <button 
                  type="button" 
                  className="ved-card-delete-btn"
                  onClick={() => onDeleteList('list', idx)}
                  title="Delete this service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="ved-group">
                <label>Number Index</label>
                <input 
                  type="text" 
                  value={item.num || ''} 
                  onChange={(e) => onListChange('list', idx, 'num', e.target.value)} 
                  placeholder="01"
                />
              </div>

              <div className="ved-group">
                <label>Service Title</label>
                <input 
                  type="text" 
                  value={item.title || ''} 
                  onChange={(e) => onListChange('list', idx, 'title', e.target.value)} 
                  placeholder="Wedding Photography"
                />
              </div>

              <div className="ved-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={item.desc || ''} 
                  onChange={(e) => onListChange('list', idx, 'desc', e.target.value)} 
                />
              </div>

              <div className="ved-group">
                <label>Card Image</label>
                <div className="ved-image-picker">
                  <input 
                    type="text" 
                    value={item.img || ''} 
                    onChange={(e) => onListChange('list', idx, 'img', e.target.value)} 
                  />
                  <label className="ved-upload-btn">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await onUpload(file);
                          onListChange('list', idx, 'img', url);
                        }
                      }}
                    />
                  </label>
                </div>
                {item.img && <div className="ved-preview-box"><img src={item.img} alt={item.title} /></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. EXPERIENCE PHASES (Home)
  if (sectionKey === 'experience') {
    const phases = data.phases || [];
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Section Tagline</label>
          <input 
            type="text" 
            value={data.tagline || ''} 
            onChange={(e) => onChange('tagline', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Title Main</label>
            <input 
              type="text" 
              value={data.titleMain || ''} 
              onChange={(e) => onChange('titleMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Title Highlight</label>
            <input 
              type="text" 
              value={data.titleHighlight || ''} 
              onChange={(e) => onChange('titleHighlight', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Title End</label>
            <input 
              type="text" 
              value={data.titleEnd || ''} 
              onChange={(e) => onChange('titleEnd', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Subtitle</label>
          <input 
            type="text" 
            value={data.subtitle || ''} 
            onChange={(e) => onChange('subtitle', e.target.value)} 
          />
        </div>

        <div className="ved-list-header">
          <label className="ved-list-title">EXPERIENCE PHASES ({phases.length})</label>
          <button 
            type="button" 
            className="ved-btn-add-item"
            onClick={() => onAddList('phases', {
              num: `Phase 0${phases.length + 1} // Craft`,
              heading: 'New Creative Phase',
              desc: 'Describe what couples experience in this phase...',
              tags: ['Custom', 'Luxury'],
              img: '/common/_DSC4382.webp'
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Phase</span>
          </button>
        </div>

        <div className="ved-cards-list">
          {phases.map((phase, idx) => (
            <div key={idx} className="ved-card-item">
              <div className="ved-card-item-top">
                <span className="ved-card-num">{phase.num || `Phase ${idx + 1}`}</span>
                <button 
                  type="button" 
                  className="ved-card-delete-btn"
                  onClick={() => onDeleteList('phases', idx)}
                  title="Delete phase"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="ved-group">
                <label>Phase Kicker Label</label>
                <input 
                  type="text" 
                  value={phase.num || ''} 
                  onChange={(e) => onListChange('phases', idx, 'num', e.target.value)} 
                  placeholder="Phase 01 // Curation"
                />
              </div>

              <div className="ved-group">
                <label>Heading</label>
                <input 
                  type="text" 
                  value={phase.heading || ''} 
                  onChange={(e) => onListChange('phases', idx, 'heading', e.target.value)} 
                  placeholder="The Curation"
                />
              </div>

              <div className="ved-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={phase.desc || ''} 
                  onChange={(e) => onListChange('phases', idx, 'desc', e.target.value)} 
                />
              </div>

              <div className="ved-group">
                <label>Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={Array.isArray(phase.tags) ? phase.tags.join(', ') : phase.tags || ''} 
                  onChange={(e) => onListChange('phases', idx, 'tags', e.target.value.split(',').map(t => t.trim()))} 
                  placeholder="Moodboarding, Lighting Design, Styling"
                />
              </div>

              <div className="ved-group">
                <label>Phase Image</label>
                <div className="ved-image-picker">
                  <input 
                    type="text" 
                    value={phase.img || ''} 
                    onChange={(e) => onListChange('phases', idx, 'img', e.target.value)} 
                  />
                  <label className="ved-upload-btn">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await onUpload(file);
                          onListChange('phases', idx, 'img', url);
                        }
                      }}
                    />
                  </label>
                </div>
                {phase.img && <div className="ved-preview-box"><img src={phase.img} alt={phase.heading} /></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. FEATURED FILM (Home)
  if (sectionKey === 'featured_film') {
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Tagline</label>
          <input 
            type="text" 
            value={data.tagline || ''} 
            onChange={(e) => onChange('tagline', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Heading Main</label>
            <input 
              type="text" 
              value={data.headingMain || ''} 
              onChange={(e) => onChange('headingMain', e.target.value)} 
              placeholder="Cinematic"
            />
          </div>
          <div className="ved-group">
            <label>Heading Highlight</label>
            <input 
              type="text" 
              value={data.headingHighlight || ''} 
              onChange={(e) => onChange('headingHighlight', e.target.value)} 
              placeholder="Poetry"
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Description Narrative</label>
          <textarea 
            rows="3"
            value={data.description || ''} 
            onChange={(e) => onChange('description', e.target.value)} 
          />
        </div>

        <div className="ved-group">
          <label>MP4 Video File</label>
          <div className="ved-image-picker">
            <input 
              type="url" 
              value={data.videoUrl || ''} 
              onChange={(e) => onChange('videoUrl', e.target.value)} 
              placeholder="Paste video link or click Upload Video"
            />
            <label className="ved-upload-btn" style={{ background: '#C5A46D', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              <Upload className="w-4 h-4" />
              <span>{uploadingVideoField === 'videoUrl' ? `Uploading ${videoProgress}%` : 'Upload Video'}</span>
              <input 
                type="file" 
                accept="video/mp4,video/webm,video/quicktime" 
                style={{ display: 'none' }}
                disabled={uploadingVideoField === 'videoUrl'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadVideo) onUploadVideo('videoUrl', file);
                }}
              />
            </label>
          </div>
          {data.videoUrl && (
            <div className="ved-preview-box" style={{ marginTop: '8px' }}>
              <video src={data.videoUrl} controls style={{ width: '100%', maxHeight: '140px', borderRadius: '4px', background: '#000' }} />
            </div>
          )}
        </div>

        <div className="ved-group">
          <label>Video Thumbnail Poster Image</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.posterUrl || ''} 
              onChange={(e) => onChange('posterUrl', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('posterUrl', e.target.files[0])}
              />
            </label>
          </div>
          {data.posterUrl && <div className="ved-preview-box"><img src={data.posterUrl} alt="Film Poster" /></div>}
        </div>
      </div>
    );
  }

  // 6. CTA BANNER (Home)
  if (sectionKey === 'cta') {
    return (
      <div className="ved-group-stack">
        <div className="ved-row">
          <div className="ved-group">
            <label>Heading Main</label>
            <input 
              type="text" 
              value={data.headingMain || ''} 
              onChange={(e) => onChange('headingMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Heading Highlight</label>
            <input 
              type="text" 
              value={data.headingHighlight || ''} 
              onChange={(e) => onChange('headingHighlight', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Subheading</label>
          <textarea 
            rows="2"
            value={data.subheading || ''} 
            onChange={(e) => onChange('subheading', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Button Text</label>
            <input 
              type="text" 
              value={data.buttonText || ''} 
              onChange={(e) => onChange('buttonText', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Button Link</label>
            <input 
              type="text" 
              value={data.buttonLink || ''} 
              onChange={(e) => onChange('buttonLink', e.target.value)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // 7. ABOUT PAGE (Complete)
  if (sectionKey === 'about_page') {
    return (
      <div className="ved-group-stack">
        <h4 className="ved-section-divider">HERO SECTION</h4>
        <div className="ved-group">
          <label>Tagline</label>
          <input 
            type="text" 
            value={data.heroTagline || ''} 
            onChange={(e) => onChange('heroTagline', e.target.value)} 
          />
        </div>
        <div className="ved-row">
          <div className="ved-group">
            <label>Title Main</label>
            <input 
              type="text" 
              value={data.heroTitleMain || ''} 
              onChange={(e) => onChange('heroTitleMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Title Highlight</label>
            <input 
              type="text" 
              value={data.heroTitleHighlight || ''} 
              onChange={(e) => onChange('heroTitleHighlight', e.target.value)} 
            />
          </div>
        </div>
        <div className="ved-group">
          <label>Hero Background Image</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.heroBg || ''} 
              onChange={(e) => onChange('heroBg', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('heroBg', e.target.files[0])}
              />
            </label>
          </div>
          {data.heroBg && <div className="ved-preview-box"><img src={data.heroBg} alt="About Hero" /></div>}
        </div>

        <h4 className="ved-section-divider">FOUNDER BIO &amp; STATEMENT</h4>
        <div className="ved-row">
          <div className="ved-group">
            <label>Founder Name</label>
            <input 
              type="text" 
              value={data.founderName || ''} 
              onChange={(e) => onChange('founderName', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Founder Role / Subtitle</label>
            <input 
              type="text" 
              value={data.founderSub || ''} 
              onChange={(e) => onChange('founderSub', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Founder Quote</label>
          <textarea 
            rows="2"
            value={data.founderQuote || ''} 
            onChange={(e) => onChange('founderQuote', e.target.value)} 
          />
        </div>

        <div className="ved-group">
          <label>Founder Photo</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.founderImg || ''} 
              onChange={(e) => onChange('founderImg', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('founderImg', e.target.files[0])}
              />
            </label>
          </div>
          {data.founderImg && <div className="ved-preview-box"><img src={data.founderImg} alt="Founder Photo" /></div>}
        </div>

        <div className="ved-group">
          <label>Founder Bio Narrative 1</label>
          <textarea 
            rows="3"
            value={data.founderBio1 || ''} 
            onChange={(e) => onChange('founderBio1', e.target.value)} 
          />
        </div>
        <div className="ved-group">
          <label>Founder Bio Narrative 2</label>
          <textarea 
            rows="3"
            value={data.founderBio2 || ''} 
            onChange={(e) => onChange('founderBio2', e.target.value)} 
          />
        </div>
        <div className="ved-group">
          <label>Founder Bio Narrative 3 &amp; 4</label>
          <textarea 
            rows="3"
            value={data.founderBio4 || ''} 
            onChange={(e) => onChange('founderBio4', e.target.value)} 
          />
        </div>

        <h4 className="ved-section-divider">STUDIO &amp; COLLECTIVE</h4>
        <div className="ved-group">
          <label>Studio Narrative</label>
          <textarea 
            rows="3"
            value={data.studioDesc || ''} 
            onChange={(e) => onChange('studioDesc', e.target.value)} 
          />
        </div>
        <div className="ved-group">
          <label>Team Collective Photo</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.teamImg || ''} 
              onChange={(e) => onChange('teamImg', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('teamImg', e.target.files[0])}
              />
            </label>
          </div>
          {data.teamImg && <div className="ved-preview-box"><img src={data.teamImg} alt="Team" /></div>}
        </div>
      </div>
    );
  }

  // 8. FILMS PAGE (Films list)
  if (sectionKey === 'films_page') {
    const list = data.list || [];
    return (
      <div className="ved-group-stack">
        <div className="ved-row">
          <div className="ved-group">
            <label>Header Tagline</label>
            <input 
              type="text" 
              value={data.tagline || ''} 
              onChange={(e) => onChange('tagline', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Heading Main</label>
            <input 
              type="text" 
              value={data.headingMain || ''} 
              onChange={(e) => onChange('headingMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Heading Highlight</label>
            <input 
              type="text" 
              value={data.headingHighlight || ''} 
              onChange={(e) => onChange('headingHighlight', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Description</label>
          <textarea 
            rows="2"
            value={data.description || ''} 
            onChange={(e) => onChange('description', e.target.value)} 
          />
        </div>

        <div className="ved-list-header">
          <label className="ved-list-title">PUBLISHED FILMS ({list.length})</label>
          <button 
            type="button" 
            className="ved-btn-add-item"
            onClick={() => onAddList('list', {
              id: `film_${Date.now()}`,
              label: 'Bangalore Wedding Teaser',
              videoTitle: 'New Couple // Cinematic Teaser',
              location: 'Bangalore, India',
              videoUrl: '/Naveen%20%26%20Kate%204K%20Teaser.mp4',
              posterUrl: '/NAVEEN%20AND%20KATE/SYD08467.webp',
              uploadDate: new Date().toISOString().split('T')[0],
              published: true
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Film</span>
          </button>
        </div>

        <div className="ved-cards-list">
          {list.map((film, idx) => (
            <div key={idx} className="ved-card-item">
              <div className="ved-card-item-top">
                <span className="ved-card-num">{film.label || film.videoTitle || `Film #${idx + 1}`}</span>
                <button 
                  type="button" 
                  className="ved-card-delete-btn"
                  onClick={() => onDeleteList('list', idx)}
                  title="Delete film"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="ved-row">
                <div className="ved-group">
                  <label>Couple Names / Title</label>
                  <input 
                    type="text" 
                    value={film.label || ''} 
                    onChange={(e) => onListChange('list', idx, 'label', e.target.value)} 
                    placeholder="Suhana & Kamal"
                  />
                </div>
                <div className="ved-group">
                  <label>Subtitle / Category</label>
                  <input 
                    type="text" 
                    value={film.videoTitle || ''} 
                    onChange={(e) => onListChange('list', idx, 'videoTitle', e.target.value)} 
                    placeholder="The Grand Palace Reception"
                  />
                </div>
              </div>

              <div className="ved-row">
                <div className="ved-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={film.location || ''} 
                    onChange={(e) => onListChange('list', idx, 'location', e.target.value)} 
                    placeholder="Bangalore, India"
                  />
                </div>
                <div className="ved-group">
                  <label>Duration / Details</label>
                  <input 
                    type="text" 
                    value={film.duration || ''} 
                    onChange={(e) => onListChange('list', idx, 'duration', e.target.value)} 
                    placeholder="4:12 mins"
                  />
                </div>
              </div>

              <div className="ved-group">
                <label>Video File (Upload MP4 / MOV or Paste Link)</label>
                <div className="ved-image-picker">
                  <input 
                    type="url" 
                    value={film.videoUrl || ''} 
                    onChange={(e) => onListChange('list', idx, 'videoUrl', e.target.value)} 
                    placeholder="Upload video file or paste link..."
                  />
                  <label className="ved-upload-btn" style={{ background: '#C5A46D', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Upload className="w-4 h-4" />
                    <span>{uploadingVideoField === `list.${idx}.videoUrl` ? `Uploading ${videoProgress}%` : 'Upload Video'}</span>
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/quicktime" 
                      style={{ display: 'none' }}
                      disabled={uploadingVideoField === `list.${idx}.videoUrl`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && onUploadVideo) {
                          onUploadVideo(`list.${idx}.videoUrl`, file, (newUrl) => {
                            onListChange('list', idx, 'videoUrl', newUrl);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {uploadingVideoField === `list.${idx}.videoUrl` && (
                  <div style={{ marginTop: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', height: '6px' }}>
                    <div style={{ width: `${videoProgress}%`, height: '100%', background: '#C5A46D', transition: 'width 0.2s' }} />
                  </div>
                )}
                {film.videoUrl && (
                  <div className="ved-preview-box" style={{ marginTop: '8px' }}>
                    <video src={film.videoUrl} controls style={{ width: '100%', maxHeight: '140px', borderRadius: '4px', background: '#000' }} />
                  </div>
                )}
              </div>

              <div className="ved-group">
                <label>Poster Thumbnail Image</label>
                <div className="ved-image-picker">
                  <input 
                    type="text" 
                    value={film.posterUrl || ''} 
                    onChange={(e) => onListChange('list', idx, 'posterUrl', e.target.value)} 
                  />
                  <label className="ved-upload-btn">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await onUpload(file);
                          onListChange('list', idx, 'posterUrl', url);
                        }
                      }}
                    />
                  </label>
                </div>
                {film.posterUrl && <div className="ved-preview-box"><img src={film.posterUrl} alt="Film Poster" /></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. CONTACT PAGE
  if (sectionKey === 'contact_page') {
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Header Tagline</label>
          <input 
            type="text" 
            value={data.tagline || ''} 
            onChange={(e) => onChange('tagline', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Title Main</label>
            <input 
              type="text" 
              value={data.heroTitleMain || ''} 
              onChange={(e) => onChange('heroTitleMain', e.target.value)} 
            />
          </div>
          <div className="ved-group">
            <label>Title Highlight</label>
            <input 
              type="text" 
              value={data.heroTitleHighlight || ''} 
              onChange={(e) => onChange('heroTitleHighlight', e.target.value)} 
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Bold Manifesto Statement</label>
          <textarea 
            rows="2"
            value={data.pBold || ''} 
            onChange={(e) => onChange('pBold', e.target.value)} 
          />
        </div>

        <div className="ved-group">
          <label>Body Narrative</label>
          <textarea 
            rows="3"
            value={data.pLight || ''} 
            onChange={(e) => onChange('pLight', e.target.value)} 
          />
        </div>

        <div className="ved-row">
          <div className="ved-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              value={data.phone || ''} 
              onChange={(e) => onChange('phone', e.target.value)} 
              placeholder="+91 9900233338"
            />
          </div>
          <div className="ved-group">
            <label>Studio Email</label>
            <input 
              type="email" 
              value={data.email || ''} 
              onChange={(e) => onChange('email', e.target.value)} 
              placeholder="connect@shootatsightweddings.com"
            />
          </div>
        </div>

        <div className="ved-group">
          <label>Studio Location / Info</label>
          <input 
            type="text" 
            value={data.studioInfo || ''} 
            onChange={(e) => onChange('studioInfo', e.target.value)} 
            placeholder="Bengaluru, India // Global Commissions"
          />
        </div>

        <div className="ved-group">
          <label>Studio Address (keep identical to the Google Business Profile)</label>
          <textarea
            rows={3}
            maxLength={200}
            value={data.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="7, Sindhoor, 2nd Cross Rd, ..., Bengaluru, Karnataka 560076"
          />
        </div>

        <div className="ved-group">
          <label>Get Directions Link (Google Maps, starts with https://)</label>
          <input
            type="url"
            value={data.mapsUrl || ''}
            onChange={(e) => onChange('mapsUrl', e.target.value)}
            placeholder="https://www.google.com/maps/search/?api=1&query=..."
          />
        </div>

        <div className="ved-group">
          <label>Contact Cover Image</label>
          <div className="ved-image-picker">
            <input 
              type="text" 
              value={data.contactImg || ''} 
              onChange={(e) => onChange('contactImg', e.target.value)} 
            />
            <label className="ved-upload-btn">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => onUpload('contactImg', e.target.files[0])}
              />
            </label>
          </div>
          {data.contactImg && <div className="ved-preview-box"><img src={data.contactImg} alt="Contact Cover" /></div>}
        </div>
      </div>
    );
  }

  // 10. FAQ PAGE
  if (sectionKey === 'faq_page') {
    const categories = data.faqs || [];
    return (
      <div className="ved-group-stack">
        <div className="ved-list-header">
          <label className="ved-list-title">FAQ CATEGORIES ({categories.length})</label>
          <button 
            type="button" 
            className="ved-btn-add-item"
            onClick={() => onAddList('faqs', {
              category: 'GENERAL QUESTIONS',
              items: [
                { q: 'New question here?', a: 'Detailed answer explaining studio policies...' }
              ]
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="ved-faq-category-block">
            <div className="ved-faq-cat-top">
              <input 
                type="text" 
                className="ved-cat-title-input"
                value={cat.category || ''} 
                onChange={(e) => onListChange('faqs', catIdx, 'category', e.target.value)} 
                placeholder="CATEGORY NAME (e.g. BOOKINGS &amp; DELIVERABLES)"
              />
              <button 
                type="button" 
                className="ved-card-delete-btn"
                onClick={() => onDeleteList('faqs', catIdx)}
                title="Delete this entire category"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            </div>

            <div className="ved-faq-items-list">
              {(cat.items || []).map((item, itemIdx) => (
                <div key={itemIdx} className="ved-faq-item">
                  <div className="ved-faq-item-top">
                    <span className="ved-faq-item-num">Q{itemIdx + 1}</span>
                    <button 
                      type="button" 
                      className="ved-item-delete-btn"
                      onClick={() => {
                        const newItems = [...cat.items];
                        newItems.splice(itemIdx, 1);
                        onListChange('faqs', catIdx, 'items', newItems);
                      }}
                      title="Delete question"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <input 
                    type="text" 
                    value={item.q || ''} 
                    onChange={(e) => {
                      const newItems = [...cat.items];
                      newItems[itemIdx] = { ...newItems[itemIdx], q: e.target.value };
                      onListChange('faqs', catIdx, 'items', newItems);
                    }}
                    placeholder="Question (e.g., How far in advance should we book?)"
                  />

                  <textarea 
                    rows="3"
                    value={item.a || ''} 
                    onChange={(e) => {
                      const newItems = [...cat.items];
                      newItems[itemIdx] = { ...newItems[itemIdx], a: e.target.value };
                      onListChange('faqs', catIdx, 'items', newItems);
                    }}
                    placeholder="Answer narrative..."
                  />
                </div>
              ))}

              <button 
                type="button" 
                className="ved-btn-add-sub"
                onClick={() => {
                  const newItems = [...(cat.items || [])];
                  newItems.push({ q: 'New question?', a: 'Write the answer here...' });
                  onListChange('faqs', catIdx, 'items', newItems);
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question to "{cat.category || 'Category'}"</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 11. PORTFOLIO PAGE
  if (sectionKey === 'portfolio_page') {
    const collections = data.collections || [];
    const heroImages = data.heroImages || [];
    return (
      <div className="ved-group-stack">
        <div className="ved-group">
          <label>Portfolio Heading</label>
          <input 
            type="text" 
            value={data.heading || ''} 
            onChange={(e) => onChange('heading', e.target.value)} 
          />
        </div>

        {/* Hero Carousel Frames */}
        <div className="ved-list-header">
          <label className="ved-list-title">HERO 5-PANEL CAROUSEL FRAMES ({heroImages.length})</label>
          <label className="ved-btn-add-item" style={{ cursor: 'pointer' }}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add Frame</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = await onUpload(file);
                  if (url) onChange('heroImages', [...heroImages, url]);
                }
              }}
            />
          </label>
        </div>
        <div className="ved-cards-list">
          {heroImages.map((img, idx) => (
            <div key={idx} className="ved-card-item" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={img} alt={`Frame ${idx + 1}`} style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 4 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="ved-card-num">Frame #{idx + 1}</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <label className="ved-upload-btn" style={{ padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}>
                    <Upload className="w-3 h-3" />
                    <span>Replace</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await onUpload(file);
                          if (url) {
                            const updated = [...heroImages];
                            updated[idx] = url;
                            onChange('heroImages', updated);
                          }
                        }
                      }}
                    />
                  </label>
                  {heroImages.length > 5 && (
                    <button 
                      type="button" 
                      className="ved-card-delete-btn"
                      onClick={() => {
                        const updated = [...heroImages];
                        updated.splice(idx, 1);
                        onChange('heroImages', updated);
                      }}
                      title="Delete Frame"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collections: Wedding and Pre-Wedding */}
        <div className="ved-list-header" style={{ marginTop: '20px' }}>
          <label className="ved-list-title">COLLECTIONS &amp; COVERS ({collections.length})</label>
        </div>
        <div className="ved-cards-list">
          {collections.map((col, idx) => (
            <div key={idx} className="ved-card-item">
              <div className="ved-card-item-top">
                <span className="ved-card-num">{col.title} Collection</span>
              </div>
              <div className="ved-row">
                <div className="ved-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={col.title || ''} 
                    onChange={(e) => onListChange('collections', idx, 'title', e.target.value)} 
                  />
                </div>
                <div className="ved-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    value={col.tagline || ''} 
                    onChange={(e) => onListChange('collections', idx, 'tagline', e.target.value)} 
                  />
                </div>
              </div>

              {/* Panels (Photography & Film) */}
              {(col.panels || []).map((panel, pIdx) => (
                <div key={pIdx} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', marginTop: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#C5A46D', fontWeight: 'bold' }}>{panel.label} COVER</label>
                  <div className="ved-image-picker" style={{ marginTop: '6px' }}>
                    <input 
                      type="text" 
                      value={panel.img || ''} 
                      onChange={(e) => {
                        const updatedCols = JSON.parse(JSON.stringify(collections));
                        updatedCols[idx].panels[pIdx].img = e.target.value;
                        onChange('collections', updatedCols);
                      }} 
                    />
                    <label className="ved-upload-btn">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await onUpload(file);
                            if (url) {
                              const updatedCols = JSON.parse(JSON.stringify(collections));
                              updatedCols[idx].panels[pIdx].img = url;
                              onChange('collections', updatedCols);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {panel.img && <div className="ved-preview-box" style={{ marginTop: '8px' }}><img src={panel.img} alt={panel.label} style={{ height: '90px' }} /></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for custom generic objects
  return (
    <div className="ved-group-stack">
      <p className="ved-notice">Edit raw section attributes:</p>
      {Object.entries(data).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) return null;
        return (
          <div key={key} className="ved-group">
            <label>{key}</label>
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => onChange(key, e.target.value)} 
            />
          </div>
        );
      })}
    </div>
  );
}
