import { useState, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  Film, 
  ArrowLeft
} from 'lucide-react';
import VisualSectionWrapper from './VisualSectionWrapper';
import Hero from '../Hero';
import OurStory from '../OurStory';
import Services from '../Services';
import Experience from '../Experience';
import CTABanner from '../CTABanner';
import Testimonials from '../Testimonials';
import { defaultPortfolio } from '../../data/portfolioDefaults';
import '../../pages/About.css';
import '../../pages/Films.css';
import '../../pages/Contact.css';
import '../../pages/FAQ.css';
import '../../pages/Portfolio.css';
import '../../pages/WeddingGallery.css';
import './VisualPageViewer.css';

/* ── In-Place Direct File Uploader Button ── */
function DirectImageButton({ 
  label = "Change Cover", 
  onFileSelected, 
  className = "",
  style = {}
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onFileSelected(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <label 
      className={`vpv-direct-uploader ${className}`} 
      style={{
        cursor: uploading ? 'wait' : 'pointer',
        opacity: uploading ? 0.7 : 1,
        ...style
      }}
    >
      <Camera style={{ width: 13, height: 13, marginRight: 6 }} />
      <span>{uploading ? 'Uploading…' : label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        disabled={uploading}
        onChange={handleSelect}
      />
    </label>
  );
}

/* ── In-Place Direct Video Uploader Button ── */
function DirectVideoButton({ 
  label = "Upload Video", 
  onFileSelected, 
  className = "",
  style = {}
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      await onFileSelected(file, (p) => setProgress(p));
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <label 
      className={`vpv-direct-uploader ${className}`} 
      style={{
        cursor: uploading ? 'wait' : 'pointer',
        opacity: uploading ? 0.7 : 1,
        ...style
      }}
    >
      <Film style={{ width: 13, height: 13, marginRight: 6 }} />
      <span>{uploading ? `Uploading ${progress}%` : label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        style={{ display: 'none' }}
        disabled={uploading}
        onChange={handleSelect}
      />
    </label>
  );
}

export default function VisualPageViewer({
  currentPage = 'home',
  onSelectPage,
  config,
  shoots = [],
  onOpenEditor,
  onQuickDelete,
  onQuickAdd,
  onDirectUploadImage,
  onDirectUploadVideo,
  onUploadShootHero,
  onSaveSection,
  onOpenEditShoot,
  onOpenCreateShoot,
  onDeleteShoot
}) {
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(2);

  if (!config) {
    return (
      <div className="vpv-loading">
        <div className="vpv-spinner"></div>
        <p>Loading website configurations…</p>
      </div>
    );
  }

  // Portfolio content helpers
  const portfolioContent = config?.portfolio_page || defaultPortfolio;
  const portfolioHeroImages = (Array.isArray(portfolioContent.heroImages) && portfolioContent.heroImages.length >= 5)
    ? portfolioContent.heroImages 
    : defaultPortfolio.heroImages;
  const collections = (Array.isArray(portfolioContent.collections) && portfolioContent.collections.length > 0 && portfolioContent.collections.every(c => Array.isArray(c.panels)))
    ? portfolioContent.collections 
    : defaultPortfolio.collections;
  const featuredImages = (Array.isArray(portfolioContent.featuredImages) && portfolioContent.featuredImages.length > 0)
    ? portfolioContent.featuredImages 
    : defaultPortfolio.featuredImages;

  // Carousel helpers
  const totalHero = portfolioHeroImages.length;
  const prevHero = () => setActiveCarouselIdx((prev) => (prev - 1 + totalHero) % totalHero);
  const nextHero = () => setActiveCarouselIdx((prev) => (prev + 1) % totalHero);
  const getVisibleHeroItems = () => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (activeCarouselIdx + offset + totalHero) % totalHero;
      return { img: portfolioHeroImages[index], offset, index };
    });
  };

  // Direct Upload handler for Carousel frame
  const handleCarouselImageUpload = async (index, file) => {
    if (!onDirectUploadImage) return;
    const newUrl = await onDirectUploadImage(file);
    if (!newUrl) return;
    const updatedImages = [...portfolioHeroImages];
    updatedImages[index] = newUrl;
    await onSaveSection('portfolio_page', {
      ...portfolioContent,
      heroImages: updatedImages
    });
  };

  // Add new image frame to carousel
  const handleAddCarouselFrame = async (file) => {
    if (!onDirectUploadImage) return;
    const newUrl = await onDirectUploadImage(file);
    if (!newUrl) return;
    const updatedImages = [...portfolioHeroImages, newUrl];
    await onSaveSection('portfolio_page', {
      ...portfolioContent,
      heroImages: updatedImages
    });
  };

  // Delete carousel frame
  const handleDeleteCarouselFrame = async (index) => {
    if (portfolioHeroImages.length <= 5) {
      alert('The carousel requires at least 5 frames for the 3D perspective display.');
      return;
    }
    if (!window.confirm('Delete this photo from the carousel?')) return;
    const updatedImages = [...portfolioHeroImages];
    updatedImages.splice(index, 1);
    await onSaveSection('portfolio_page', {
      ...portfolioContent,
      heroImages: updatedImages
    });
  };

  // Direct Upload handler for Collection panel cover
  const handleCollectionPanelUpload = async (colIndex, panelIndex, file) => {
    if (!onDirectUploadImage) return;
    const newUrl = await onDirectUploadImage(file);
    if (!newUrl) return;
    const updatedCollections = JSON.parse(JSON.stringify(collections));
    if (updatedCollections[colIndex]?.panels?.[panelIndex]) {
      updatedCollections[colIndex].panels[panelIndex].img = newUrl;
      await onSaveSection('portfolio_page', {
        ...portfolioContent,
        collections: updatedCollections
      });
    }
  };

  // Direct Upload handler for Featured Wedding photo
  const handleFeaturedPhotoUpload = async (index, file) => {
    if (!onDirectUploadImage) return;
    const newUrl = await onDirectUploadImage(file);
    if (!newUrl) return;
    const updatedFeatured = [...featuredImages];
    updatedFeatured[index] = newUrl;
    await onSaveSection('portfolio_page', {
      ...portfolioContent,
      featuredImages: updatedFeatured
    });
  };

  // Direct Upload handler for Film poster
  const handleFilmPosterUpload = async (filmIdx, file) => {
    if (!onDirectUploadImage) return;
    const newUrl = await onDirectUploadImage(file);
    if (!newUrl) return;
    const list = [...(config?.films_page?.list || [])];
    if (list[filmIdx]) {
      list[filmIdx].posterUrl = newUrl;
      await onSaveSection('films_page', {
        ...config?.films_page,
        list
      });
    }
  };

  // Direct Upload handler for Film video file
  const handleFilmVideoUpload = async (filmIdx, file, onProgress) => {
    if (!onDirectUploadVideo) return;
    const newUrl = await onDirectUploadVideo(file, onProgress);
    if (!newUrl) return;
    const list = [...(config?.films_page?.list || [])];
    if (list[filmIdx]) {
      list[filmIdx].videoUrl = newUrl;
      await onSaveSection('films_page', {
        ...config?.films_page,
        list
      });
    }
  };

  // Filtered shoots
  const weddingShoots = shoots.filter((s) => s.category?.toLowerCase() === 'wedding');
  const preWeddingShoots = shoots.filter((s) => s.category?.toLowerCase() === 'pre-wedding');

  return (
    <div className="vpv-canvas-wrapper">

      {/* ────────────────── 1. HOME PAGE ────────────────── */}
      {currentPage === 'home' && (
        <div className="vpv-page-container home-page-visual">
          <VisualSectionWrapper
            label="Hero Section"
            sectionKey="hero"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('hero', 'Hero Section', 'Headline, Background Video & Cover Photo')}
          >
            <Hero />
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Philosophy &amp; 3 Photos"
            sectionKey="about_philosophy"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('about_philosophy', 'Our Philosophy', 'Headings, Narrative & 3 Editorial Photos')}
          >
            <OurStory />
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Signature Services"
            sectionKey="services"
            badgePosition="top-center"
            addLabel="Add Service Card"
            onEdit={() => onOpenEditor('services', 'Signature Services', 'Services list, descriptions & photos')}
            onAdd={() => onQuickAdd('services', 'list', {
              num: `0${(config?.services?.list || []).length + 1}`,
              title: 'New Wedding Service',
              desc: 'Describe this luxury service...',
              img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/VIJ01478.jpg.webp'
            })}
          >
            <Services />
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Experience Phases"
            sectionKey="experience"
            badgePosition="top-center"
            addLabel="Add Phase"
            onEdit={() => onOpenEditor('experience', 'Experience Phases', 'The 3 deliberate phases of your craft')}
            onAdd={() => onQuickAdd('experience', 'phases', {
              num: `Phase 0${(config?.experience?.phases || []).length + 1} // Craft`,
              heading: 'New Experience Phase',
              desc: 'Describe what couples experience in this phase...',
              tags: ['Custom', 'Luxury'],
              img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC4382.webp'
            })}
          >
            <Experience />
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Featured Film Video"
            sectionKey="featured_film"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('featured_film', 'Featured Wedding Film', 'Headlines, Video URL & Poster thumbnail')}
          >
            <div className="home-featured-film-preview">
              <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <span className="subtitle-accent" style={{ color: '#C5A46D', letterSpacing: '0.15em' }}>
                  {config?.featured_film?.tagline || '04 // CINEMATIC VISION'}
                </span>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '14px 0 20px' }}>
                  {config?.featured_film?.title || 'Love in Motion'}
                </h2>
                <div style={{ maxWidth: '850px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                  <img 
                    src={config?.featured_film?.posterUrl || 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp'} 
                    alt="Featured film poster" 
                    style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#C5A46D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '24px' }}>
                      ▶
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Kind Words / Testimonials Preview"
            sectionKey="testimonials"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('about_philosophy', 'Client Testimonials', 'Manage praise from couples')}
          >
            <Testimonials />
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Call to Action Banner"
            sectionKey="cta_banner"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('cta_banner', 'CTA Banner', 'Headline, subheadline, button text & cover photo')}
          >
            <CTABanner />
          </VisualSectionWrapper>
        </div>
      )}

      {/* ────────────────── 2. ABOUT PAGE ────────────────── */}
      {currentPage === 'about' && (
        <div className="vpv-page-container about-page-visual">
          <VisualSectionWrapper
            label="Founder Story &amp; Portrait"
            sectionKey="about_page"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('about_page', 'Founder Biography', 'Pavithra Arun Kumar bio, quotes & portrait photo')}
          >
            <div style={{ padding: '80px 5%', background: '#0a0a0a', color: '#FAF9F6' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={config?.about_page?.founderImg || 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/about-founder.webp'} 
                    alt="Founder portrait" 
                    style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(197, 164, 109, 0.3)' }}
                  />
                  <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <DirectImageButton
                      label="Change Founder Photo"
                      onFileSelected={async (file) => {
                        const newUrl = await onDirectUploadImage(file);
                        if (newUrl) {
                          await onSaveSection('about_page', { ...config?.about_page, founderImg: newUrl });
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#C5A46D', textTransform: 'uppercase', fontWeight: 700 }}>
                    {config?.about_page?.founderTagline || 'CREATIVE DIRECTOR // PAVITHRA ARUN KUMAR'}
                  </span>
                  <h2 style={{ fontSize: '2.4rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '12px 0 6px 0' }}>
                    {config?.about_page?.founderName || 'Pavithra Arun Kumar'}
                  </h2>
                  <p style={{ color: '#C5A46D', fontStyle: 'italic', marginBottom: '20px' }}>
                    {config?.about_page?.founderSub || 'Founder & Lead Visual Storyteller'}
                  </p>
                  <blockquote style={{ borderLeft: '2px solid #C5A46D', paddingLeft: '16px', fontStyle: 'italic', color: '#eee', margin: '20px 0', fontSize: '1.05rem' }}>
                    "{config?.about_page?.founderQuote || 'Every journey begins with a single moment of passion. Mine began with a phone camera.'}"
                  </blockquote>
                  <p style={{ color: '#bbb', lineHeight: '1.7', marginBottom: '14px' }}>
                    {config?.about_page?.founderBio1}
                  </p>
                  <p style={{ color: '#bbb', lineHeight: '1.7', marginBottom: '14px' }}>
                    {config?.about_page?.founderBio2}
                  </p>
                </div>
              </div>
            </div>
          </VisualSectionWrapper>

          <VisualSectionWrapper
            label="Studio Story &amp; Team Photo"
            sectionKey="about_page"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('about_page', 'Studio Collective', 'Studio narrative & team photo')}
          >
            <div style={{ padding: '80px 5%', background: '#050505', textAlign: 'center' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#C5A46D', textTransform: 'uppercase' }}>
                  {config?.about_page?.studioTagline || '02 // THE STUDIO'}
                </span>
                <h2 style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '12px 0' }}>
                  {config?.about_page?.studioTitleMain || 'Curating'} <i>{config?.about_page?.studioTitleHighlight || 'Legacy'}</i> {config?.about_page?.studioTitleEnd || 'Through Light.'}
                </h2>
                <p style={{ color: '#ccc', lineHeight: '1.7', margin: '0 auto 40px', maxWidth: '700px' }}>
                  {config?.about_page?.studioDesc}
                </p>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                  <img 
                    src={config?.about_page?.teamImg || 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/team.webp'} 
                    alt="Team collective" 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <DirectImageButton
                      label="Change Team Photo"
                      onFileSelected={async (file) => {
                        const newUrl = await onDirectUploadImage(file);
                        if (newUrl) {
                          await onSaveSection('about_page', { ...config?.about_page, teamImg: newUrl });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </VisualSectionWrapper>
        </div>
      )}

      {/* ────────────────── 3. PORTFOLIO PAGE (The Exact Page from Screenshot 1, 2, 3) ────────────────── */}
      {currentPage === 'portfolio' && (
        <div className="vpv-page-container portfolio-page-visual">
          
          {/* Section 1: Luxury 5-Panel Carousel Banner (Screenshot 1) */}
          <VisualSectionWrapper
            label="Hero 5-Panel Carousel"
            sectionKey="portfolio_page"
            badgePosition="top-center"
            addLabel="Add Carousel Slide"
            onEdit={() => onOpenEditor('portfolio_page', 'Portfolio Hero Carousel', 'Manage the 5-panel luxury rotating frames')}
            onAdd={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = 'image/*';
              fileInput.onchange = (e) => {
                if (e.target.files?.[0]) handleAddCarouselFrame(e.target.files[0]);
              };
              fileInput.click();
            }}
          >
            <div className="ptf-hero-banner" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 80px' }}>
              <div className="ptf-hero-heading-wrap" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="ptf-hero-heading" style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', color: '#FAF9F6' }}>
                  {portfolioContent.heading || 'Wedding & Pre-Wedding Portfolio in Bangalore'}
                </h1>
                <p style={{ color: '#C5A46D', fontSize: '12px', letterSpacing: '0.1em', marginTop: '8px' }}>
                  Hover over any slide to change or replace photo directly
                </p>
              </div>

              {/* 5 Vertical Panel Stage */}
              <div className="ptf-hero-stage">
                {getVisibleHeroItems().map(({ img, offset, index }) => (
                  <div
                    key={`${index}-${offset}`}
                    className={`ptf-hero-card ptf-hero-card--${
                      offset === 0
                        ? "center"
                        : offset < 0
                        ? `left-${Math.abs(offset)}`
                        : `right-${offset}`
                    }`}
                    style={{ position: 'relative' }}
                  >
                    <img src={img} alt={`Frame ${index + 1}`} loading="eager" />

                    {/* In-Place Slide Action Overlay */}
                    <div className="vpv-card-action-overlay">
                      <DirectImageButton
                        label="Change Photo"
                        onFileSelected={(file) => handleCarouselImageUpload(index, file)}
                      />
                      {portfolioHeroImages.length > 5 && (
                        <button
                          type="button"
                          className="vpv-btn-del-icon"
                          onClick={() => handleDeleteCarouselFrame(index)}
                          title="Delete this slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Nav Controls */}
              <button className="ptf-hero-nav ptf-hero-nav--prev" onClick={prevHero} aria-label="Previous image">
                &larr;
              </button>
              <button className="ptf-hero-nav ptf-hero-nav--next" onClick={nextHero} aria-label="Next image">
                &rarr;
              </button>
            </div>
          </VisualSectionWrapper>

          {/* Section 2: Collection Sections (Wedding & Pre-Wedding - Screenshots 2 & 3) */}
          {collections.map((col, colIdx) => (
            <VisualSectionWrapper
              key={col.id || colIdx}
              label={`${col.title} Collection Covers`}
              sectionKey="portfolio_page"
              badgePosition="top-center"
              onEdit={() => onOpenEditor('portfolio_page', `${col.title} Collection Covers`, 'Headings, tags & photography/film cover photos')}
            >
              <section className="ptf-collection" style={{ padding: '60px 4% 80px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="ptf-col-header" style={{ marginBottom: '35px' }}>
                  <h2 className="ptf-col-heading">
                    <span className="ptf-col-serif">{col.title}</span>
                    <span className="ptf-col-script">collection</span>
                  </h2>
                  <div className="ptf-col-line" />
                  <span className="ptf-col-tagline">{col.tagline}</span>
                </div>

                <div className="ptf-col-panels">
                  {(col.panels || []).map((panel, panelIdx) => (
                    <div key={panel.label || panelIdx} className="ptf-col-panel" style={{ position: 'relative' }}>
                      <img src={panel.img} alt={panel.label} loading="lazy" className="ptf-col-panel-img" />
                      <div className="ptf-col-panel-text">
                        <span>{panel.label}</span>
                      </div>

                      {/* Direct Cover Upload Overlay */}
                      <div className="vpv-panel-cover-controls">
                        <DirectImageButton
                          label={`Upload ${panel.label} Cover`}
                          onFileSelected={(file) => handleCollectionPanelUpload(colIdx, panelIdx, file)}
                          style={{
                            background: '#0a0a0a',
                            border: '1px solid #C5A46D',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
                          }}
                        />

                        {/* Quick Jump Link to manage real shoots / films */}
                        {panel.to === '/portfolio/wedding' && (
                          <button
                            type="button"
                            className="vpv-btn-jump"
                            onClick={() => onSelectPage && onSelectPage('wedding-gallery')}
                          >
                            <span>Manage Wedding Shoots →</span>
                          </button>
                        )}
                        {panel.to === '/portfolio/pre-wedding' && (
                          <button
                            type="button"
                            className="vpv-btn-jump"
                            onClick={() => onSelectPage && onSelectPage('pre-wedding')}
                          >
                            <span>Manage Pre-Wedding Shoots →</span>
                          </button>
                        )}
                        {panel.to === '/films' && (
                          <button
                            type="button"
                            className="vpv-btn-jump"
                            onClick={() => onSelectPage && onSelectPage('films')}
                          >
                            <span>View &amp; Add Wedding Films →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </VisualSectionWrapper>
          ))}

          {/* Section 3: Featured Wedding Grid */}
          <VisualSectionWrapper
            label="Featured Wedding Grid (6 Photos)"
            sectionKey="portfolio_page"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('portfolio_page', 'Featured Wedding Photos', '6-photo curated portfolio showcase')}
          >
            <section className="ptf-featured" style={{ padding: '60px 4% 80px' }}>
              <div className="ptf-featured-label">
                <span className="ptf-featured-script">Featured</span>
                <span className="ptf-featured-serif">{(portfolioContent.featuredTitle || 'Wedding').replace(/^featured\s*/i, '')}</span>
              </div>
              <div className="ptf-featured-grid">
                {featuredImages.map((img, i) => (
                  <div key={i} className="ptf-featured-cell" style={{ position: 'relative' }}>
                    <img src={img} alt={`Featured ${i + 1}`} loading="lazy" />
                    <div className="vpv-card-action-overlay">
                      <DirectImageButton
                        label="Replace Photo"
                        onFileSelected={(file) => handleFeaturedPhotoUpload(i, file)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </VisualSectionWrapper>

        </div>
      )}

      {/* ────────────────── 4. WEDDING GALLERY (Screenshot 4: /portfolio/wedding) ────────────────── */}
      {currentPage === 'wedding-gallery' && (
        <div className="vpv-page-container wedding-gallery-visual">
          <div className="wg-page" style={{ padding: '40px 4% 80px', background: '#0a0a0a' }}>
            
            {/* Top Bar with Navigation & Add New Shoot */}
            <div className="wg-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px', marginBottom: '40px' }}>
              <div>
                <button 
                  type="button" 
                  onClick={() => onSelectPage && onSelectPage('portfolio')} 
                  className="wg-back"
                  style={{ background: 'transparent', border: 'none', color: '#C5A46D', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO PORTFOLIO OVERVIEW</span>
                </button>
                <h1 className="wg-title" style={{ fontSize: '2.8rem', color: '#FAF9F6', margin: 0 }}>
                  celebrating <span className="wg-title-normal">Unforgettable</span> <span className="wg-title-script">Moments</span>
                </h1>
                <p style={{ color: '#aaa', fontSize: '13px', marginTop: '6px' }}>
                  Showing {weddingShoots.length} Wedding Stories. Click <strong>Change Cover Photo</strong> on any couple card to update their photo instantly.
                </p>
              </div>

              {/* Add New Wedding Couple Button */}
              <button
                type="button"
                className="btn-premium-add-shoot"
                onClick={onOpenCreateShoot}
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Wedding Couple / Shoot</span>
              </button>
            </div>

            {/* Couple Cards Grid */}
            {weddingShoots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
                <p>No wedding shoots created yet.</p>
                <button type="button" onClick={onOpenCreateShoot} className="btn-premium-action" style={{ marginTop: '16px' }}>
                  + Create First Wedding Shoot
                </button>
              </div>
            ) : (
              <div className="wg-pair-grid wg-pair-grid--vertical" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {weddingShoots.map((shoot) => (
                  <div 
                    key={shoot._id} 
                    className="admin-visual-couple-card"
                    style={{
                      background: '#141414',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      position: 'relative'
                    }}
                  >
                    {/* Cover Photo Frame */}
                    <div style={{ height: '420px', position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={shoot.heroImage} 
                        alt={shoot.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />

                      {/* Couple Title Overlay */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 20px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif', margin: '0 0 4px 0' }}>
                          {shoot.title}
                        </h3>
                        <p style={{ color: '#C5A46D', fontSize: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {shoot.location || 'Bangalore'} &bull; {shoot.gallery?.length || 0} Gallery Photos
                        </p>
                      </div>

                      {/* In-Place Shoot Actions */}
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <DirectImageButton
                          label="Change Cover Photo"
                          onFileSelected={(file) => onUploadShootHero && onUploadShootHero(shoot._id, file)}
                          style={{
                            background: 'rgba(10,10,10,0.9)',
                            border: '1px solid #C5A46D',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => onOpenEditShoot && onOpenEditShoot(shoot)}
                          style={{
                            background: '#C5A46D',
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none',
                            fontSize: '11px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Gallery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteShoot && onDeleteShoot(shoot._id, shoot.title)}
                          style={{
                            background: 'rgba(231, 76, 60, 0.9)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '11px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Delete shoot"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────── 5. PRE-WEDDING GALLERY (/portfolio/pre-wedding) ────────────────── */}
      {currentPage === 'pre-wedding' && (
        <div className="vpv-page-container pre-wedding-gallery-visual">
          <div className="wg-page" style={{ padding: '40px 4% 80px', background: '#0a0a0a' }}>
            <div className="wg-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px', marginBottom: '40px' }}>
              <div>
                <button 
                  type="button" 
                  onClick={() => onSelectPage && onSelectPage('portfolio')} 
                  className="wg-back"
                  style={{ background: 'transparent', border: 'none', color: '#C5A46D', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO PORTFOLIO OVERVIEW</span>
                </button>
                <h1 className="wg-title" style={{ fontSize: '2.8rem', color: '#FAF9F6', margin: 0 }}>
                  Pre-Wedding <span className="wg-title-script">Narratives</span>
                </h1>
                <p style={{ color: '#aaa', fontSize: '13px', marginTop: '6px' }}>
                  Showing {preWeddingShoots.length} Pre-Wedding Stories.
                </p>
              </div>

              <button
                type="button"
                className="btn-premium-add-shoot"
                onClick={onOpenCreateShoot}
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Pre-Wedding Shoot</span>
              </button>
            </div>

            {preWeddingShoots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
                <p>No pre-wedding shoots found in database.</p>
                <button type="button" onClick={onOpenCreateShoot} className="btn-premium-action" style={{ marginTop: '16px' }}>
                  + Create First Pre-Wedding Shoot
                </button>
              </div>
            ) : (
              <div className="wg-pair-grid wg-pair-grid--vertical" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {preWeddingShoots.map((shoot) => (
                  <div 
                    key={shoot._id} 
                    className="admin-visual-couple-card"
                    style={{
                      background: '#141414',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.08)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ height: '420px', position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={shoot.heroImage} 
                        alt={shoot.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 20px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif', margin: '0 0 4px 0' }}>
                          {shoot.title}
                        </h3>
                        <p style={{ color: '#C5A46D', fontSize: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {shoot.location || 'Bangalore'} &bull; {shoot.gallery?.length || 0} Gallery Photos
                        </p>
                      </div>

                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <DirectImageButton
                          label="Change Cover Photo"
                          onFileSelected={(file) => onUploadShootHero && onUploadShootHero(shoot._id, file)}
                          style={{
                            background: 'rgba(10,10,10,0.9)',
                            border: '1px solid #C5A46D',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => onOpenEditShoot && onOpenEditShoot(shoot)}
                          style={{
                            background: '#C5A46D',
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none',
                            fontSize: '11px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Gallery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteShoot && onDeleteShoot(shoot._id, shoot.title)}
                          style={{
                            background: 'rgba(231, 76, 60, 0.9)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '11px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer'
                          }}
                          title="Delete shoot"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────── 6. FILMS PAGE (Wedding Films Library) ────────────────── */}
      {currentPage === 'films' && (
        <div className="vpv-page-container films-page-visual">
          <VisualSectionWrapper
            label="Wedding Films Library"
            sectionKey="films_page"
            badgePosition="top-center"
            addLabel="Add Wedding Film"
            onEdit={() => onOpenEditor('films_page', 'Wedding Films Library', 'Films list, titles, video streams & posters')}
            onAdd={() => onQuickAdd('films_page', 'list', {
              id: `film_${Date.now()}`,
              label: 'Bangalore Luxury Wedding Teaser',
              videoTitle: 'New Couple Film',
              location: 'Bangalore, India',
              videoUrl: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Naveen%20%26%20Kate%204K%20Teaser.mp4',
              posterUrl: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp',
              uploadDate: new Date().toISOString().split('T')[0],
              duration: '3:45 mins',
              published: true
            })}
          >
            <div className="films-hero-section" style={{ padding: '60px 5% 40px', textAlign: 'center', background: '#050505' }}>
              
              {/* Header */}
              <span className="subtitle-accent" style={{ color: '#C5A46D', letterSpacing: '0.15em' }}>
                {config?.films_page?.tagline || '03 // FEATURED FILMS'}
              </span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '14px 0' }}>
                {config?.films_page?.headingMain || 'Cinematic'} <i style={{ color: '#C5A46D' }}>{config?.films_page?.headingHighlight || 'Poetry'}</i>
              </h1>
              <p style={{ maxWidth: '620px', margin: '0 auto 30px', color: '#aaa', lineHeight: '1.6' }}>
                {config?.films_page?.description || 'Experience the raw emotion, the fleeting glances, and the symphony of love in motion.'}
              </p>

              {/* Big Prominent Add Wedding Film Button */}
              <div style={{ marginBottom: '50px' }}>
                <button
                  type="button"
                  onClick={() => onOpenEditor('films_page', 'Add New Wedding Film', 'Set video URL, title, location & upload cover poster')}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '14px 28px',
                    borderRadius: '6px',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Wedding Film / Video</span>
                </button>
              </div>

              {/* Films Grid */}
              <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
                {(config?.films_page?.list || []).map((film, idx) => (
                  <div key={idx} style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', textAlign: 'left' }}>
                    <div style={{ height: '240px', position: 'relative' }}>
                      <img 
                        src={film.posterUrl || 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp'} 
                        alt={film.label} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />

                      {/* Direct Upload Poster & Controls Overlay */}
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <DirectImageButton
                            label="Poster"
                            onFileSelected={(file) => handleFilmPosterUpload(idx, file)}
                            style={{
                              background: 'rgba(10,10,10,0.9)',
                              border: '1px solid #C5A46D'
                            }}
                          />
                          <DirectVideoButton
                            label="Video"
                            onFileSelected={(file, onProgress) => handleFilmVideoUpload(idx, file, onProgress)}
                            style={{
                              background: '#C5A46D',
                              color: '#000',
                              fontWeight: 'bold',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => onOpenEditor('films_page', `Edit Film: ${film.label || film.videoTitle}`, 'Change video URL, title, location or poster')}
                            style={{ background: '#C5A46D', border: 'none', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onQuickDelete('films_page', 'list', idx)}
                            style={{ background: '#e74c3c', border: 'none', color: '#fff', fontSize: '11px', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                            title="Delete this film"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Play badge */}
                      <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: '#C5A46D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Film className="w-3 h-3" />
                        <span>{film.videoUrl ? 'Video Linked' : 'No Video'}</span>
                      </div>
                    </div>

                    <div style={{ padding: '18px' }}>
                      <h4 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Playfair Display, serif', margin: '0 0 6px 0' }}>
                        {film.label || film.videoTitle}
                      </h4>
                      <p style={{ color: '#C5A46D', fontSize: '0.85rem', margin: 0 }}>
                        {film.location || 'Bangalore'} &bull; {film.duration || 'Full Teaser'}
                      </p>
                      {film.videoUrl && (
                        <p style={{ color: '#888', fontSize: '11px', margin: '8px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          🔗 {film.videoUrl}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </VisualSectionWrapper>
        </div>
      )}

      {/* ────────────────── 7. CONTACT PAGE ────────────────── */}
      {currentPage === 'contact' && (
        <div className="vpv-page-container contact-page-visual">
          <VisualSectionWrapper
            label="Contact Details &amp; Studio Info"
            sectionKey="contact_page"
            badgePosition="top-center"
            onEdit={() => onOpenEditor('contact_page', 'Contact Page', 'Headlines, phone, email, studio address & cover image')}
          >
            <div style={{ padding: '80px 5%', background: '#0a0a0a', color: '#FAF9F6' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#C5A46D', textTransform: 'uppercase' }}>
                    {config?.contact_page?.tagline || '05 // THE INITIATION'}
                  </span>
                  <h1 style={{ fontSize: '2.8rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '14px 0' }}>
                    {config?.contact_page?.heroTitleMain || 'For those who value'} <i style={{ color: '#C5A46D' }}>{config?.contact_page?.heroTitleHighlight || 'legacy over pixels.'}</i>
                  </h1>
                  <p style={{ fontWeight: 'bold', color: '#fff', marginBottom: '12px', lineHeight: '1.6' }}>
                    {config?.contact_page?.pBold}
                  </p>
                  <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
                    {config?.contact_page?.pLight}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div><strong style={{ color: '#C5A46D' }}>Phone:</strong> {config?.contact_page?.phone || '+91 9900233338'}</div>
                    <div><strong style={{ color: '#C5A46D' }}>Email:</strong> {config?.contact_page?.email || 'connect@shootatsightweddings.com'}</div>
                    <div><strong style={{ color: '#C5A46D' }}>Studio:</strong> {config?.contact_page?.studioInfo || 'Bengaluru, India // Global Commissions'}</div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(197, 164, 109, 0.3)' }}>
                    <img 
                      src={config?.contact_page?.contactImg || 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/SAS_3280.webp'} 
                      alt="Contact Cover" 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <DirectImageButton
                      label="Change Contact Photo"
                      onFileSelected={async (file) => {
                        const newUrl = await onDirectUploadImage(file);
                        if (newUrl) {
                          await onSaveSection('contact_page', { ...config?.contact_page, contactImg: newUrl });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </VisualSectionWrapper>
        </div>
      )}

      {/* ────────────────── 8. FAQ PAGE ────────────────── */}
      {currentPage === 'faq' && (
        <div className="vpv-page-container faq-page-visual">
          <VisualSectionWrapper
            label="Questions &amp; Answers (FAQ)"
            sectionKey="faq_page"
            badgePosition="top-center"
            addLabel="Add Category / FAQ"
            onEdit={() => onOpenEditor('faq_page', 'FAQ Manager', 'Edit questions, answers and categories')}
            onAdd={() => onQuickAdd('faq_page', 'faqs', {
              category: 'NEW FAQ CATEGORY',
              items: [{ q: 'New question here?', a: 'Detailed answer here...' }]
            })}
          >
            <div style={{ padding: '80px 5%', background: '#050505', color: '#FAF9F6' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#C5A46D', textTransform: 'uppercase', display: 'block', textAlign: 'center' }}>
                  HELP &amp; CLARITY
                </span>
                <h1 style={{ fontSize: '3rem', fontFamily: 'Playfair Display, serif', color: '#fff', margin: '14px 0 50px', textAlign: 'center' }}>
                  Frequently Asked <i>Questions</i>
                </h1>

                {(config?.faq_page?.faqs || []).map((cat, catIdx) => (
                  <div key={catIdx} style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #C5A46D', paddingBottom: '8px', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1rem', color: '#C5A46D', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                        {cat.category}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onQuickDelete('faq_page', 'faqs', catIdx)}
                        style={{ background: 'transparent', border: 'none', color: '#ff7675', fontSize: '11px', cursor: 'pointer' }}
                      >
                        🗑️ Delete Category
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(cat.items || []).map((item, itemIdx) => (
                        <div key={itemIdx} style={{ background: '#111', borderRadius: '8px', padding: '18px 20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 8px 0', fontWeight: 600 }}>{item.q}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...cat.items];
                                newItems.splice(itemIdx, 1);
                                onQuickAdd('faq_page', `faqs.${catIdx}.items`, newItems, true);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#ff7675', cursor: 'pointer', padding: '2px' }}
                              title="Delete question"
                            >
                              ✕
                            </button>
                          </div>
                          <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '0.92rem' }}>{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </VisualSectionWrapper>
        </div>
      )}

    </div>
  );
}
