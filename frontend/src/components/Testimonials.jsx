import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './Testimonials.css';

const testimonialsData = [
  {
    num: "01",
    photo: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp",
    quote: "We didn't want standard wedding photography; we wanted an author for our legacy. Shoot @ Sight didn't just capture our celebration—they curated a high-fashion, digital visual spread. Every single frame is pure art.",
    author: "Raghu Dixit & Varijashree",
    location: "THE HEIRLOOM CEREMONY",
    tags: ["Editorial Narrative", "High-Fashion Spread"],
    rating: 5
  },
  {
    num: "02",
    photo: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp",
    quote: "To say they captured the emotion is an understatement. They captured the unspoken whispers, the raw poetry, and the cinematic architecture of our wedding. Absolute masters of high-end visual art.",
    author: "Naveen & Kate",
    location: "THE CINEMATIC CAPTURE",
    tags: ["Cinematic Poetry", "Candid Emotion"],
    rating: 5
  },
  {
    num: "03",
    photo: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp",
    quote: "The sheer drama, the unscripted whispers, the absolute masterclass in lighting. Working with them was an immersive luxury experience. They don't just document—they command the lens with sheer prestige.",
    author: "Aishwarya & Akshay",
    location: "THE LUXURY PORTFOLIO",
    tags: ["Luxury Curation", "Prestige Lighting"],
    rating: 5
  },
  {
    num: "04",
    photo: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00045.webp",
    quote: "Every single print is a physical masterpiece. The deep emotional weight, the rich color grading, and the timeless textures. They have forever preserved the raw soul of our celebration.",
    author: "Srinidhi & Ramya",
    location: "THE FINE ART LEGACY",
    tags: ["Fine Art Legacy", "Color Grading"],
    rating: 5
  }
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(testimonialsData);
  const [activeIndex, setActiveIndex] = useState(0);
  const layoutMode = 'split';

  useEffect(() => {
    const fetchDbTestimonials = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_URL}/testimonials`, { signal: controller.signal });
        clearTimeout(timeout);
        const data = await res.json();
        if (res.ok && data.testimonials && data.testimonials.length > 0) {
          const merged = data.testimonials.map((t, idx) => ({
            ...t,
            photo: t.photo || testimonialsData[idx % testimonialsData.length].photo,
            rating: t.rating || 5
          }));
          setTestimonials(merged);
        }
      } catch {
        // Fallback to local testimonialsData
      }
    };
    fetchDbTestimonials();
  }, []);

  useEffect(() => {
    if (layoutMode === 'grid' || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length, layoutMode]);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeItem = testimonials[activeIndex] || testimonials[0];

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        {/* Header Title */}
        <div className="testimonials-top-bar">
          <div className="top-bar-title-wrap">
            <span className="subtitle-accent">04 // CLIENT KUDOS & REVIEWS</span>
            <h2 className="section-title-large">Testimonials</h2>
            <a
              href="https://www.wedmegood.com/profile/Shoot-At-Sight-Weddings-4600076"
              target="_blank"
              rel="noreferrer"
              className="testimonials-trust-line"
            >
              ★ 5.0 from 83 reviews on WedMeGood
            </a>
          </div>
        </div>

        {/* ── LAYOUT OPTION 1: PHOTO LEFT / REVIEW RIGHT ── */}
        {layoutMode === 'split' && (
          <div className="t-layout-split">
            {/* Left: Uncropped Client Photo */}
            <div className="split-photo-col">
              <div className="split-photo-frame">
                <img
                  src={activeItem.photo}
                  alt={activeItem.author}
                  className="split-photo-img"
                  key={activeIndex}
                />
                <div className="split-photo-badge">
                  <span>{activeItem.author}</span>
                </div>
              </div>
            </div>

            {/* Right: Review Content */}
            <div className="split-content-col">
              <div className="luxury-quote-icon">“</div>
              <div className="star-rating-row">
                {[...Array(activeItem.rating || 5)].map((_, i) => (
                  <span key={i} className="star-icon">★</span>
                ))}
              </div>

              <p className="split-quote-text">"{activeItem.quote}"</p>

              <div className="split-author-meta">
                <h4 className="author-name">{activeItem.author}</h4>
                <span className="author-loc">{activeItem.location}</span>
              </div>

              <div className="testimonial-card-tags">
                {activeItem.tags && activeItem.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="card-tag-pill">{tag}</span>
                ))}
              </div>

              {/* Controls */}
              <div className="split-controls-wrap">
                <div className="testimonial-selectors">
                  {testimonials.map((t, idx) => (
                    <button
                      key={idx}
                      className={`selector-num-btn ${idx === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      {t.num}
                    </button>
                  ))}
                </div>

                <div className="testimonial-nav-arrows inline-arrows">
                  <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous Slide">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </button>
                  <button className="nav-arrow next" onClick={handleNext} aria-label="Next Slide">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── LAYOUT OPTION 2: CARD LAYOUT WITH CLIENT AVATAR ── */}
        {layoutMode === 'card' && (
          <div className="t-layout-card">
            <div className="card-layout-left">
              <div className="luxury-quote-icon">“</div>
              <p className="testimonials-manifesto">
                Crafting visual legacies, not just wedding galleries. Read the unvarnished experiences of the visionaries, the romantics, and the rebels who chose the extraordinary.
              </p>

              <div className="testimonial-selectors">
                {testimonials.map((t, idx) => (
                  <button
                    key={idx}
                    className={`selector-num-btn ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    {t.num}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-layout-right">
              <div className="testimonial-card-frame">
                <div className="card-border-backing"></div>
                <div className="testimonial-card-inner card-with-avatar">

                  <div className="avatar-header-row">
                    <div className="client-avatar-wrap">
                      <img src={activeItem.photo} alt={activeItem.author} className="client-avatar-img" />
                    </div>
                    <div className="avatar-meta">
                      <h4 className="author-name">{activeItem.author}</h4>
                      <span className="author-loc">{activeItem.location}</span>
                      <div className="star-rating-row small">
                        {[...Array(activeItem.rating || 5)].map((_, i) => (
                          <span key={i} className="star-icon">★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="testimonial-quote-text">"{activeItem.quote}"</p>

                  <div className="testimonial-card-tags">
                    {activeItem.tags && activeItem.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="card-tag-pill">{tag}</span>
                    ))}
                  </div>

                  <div className="testimonial-nav-arrows">
                    <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous Slide">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                    </button>
                    <button className="nav-arrow next" onClick={handleNext} aria-label="Next Slide">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LAYOUT OPTION 3: 3-COLUMN TESTIMONIAL GRID ── */}
        {layoutMode === 'grid' && (
          <div className="t-layout-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="grid-testimonial-card">
                <div className="grid-card-img-wrap">
                  <img src={t.photo} alt={t.author} className="grid-card-img" />
                  <span className="grid-card-num">{t.num}</span>
                </div>
                <div className="grid-card-body">
                  <div className="star-rating-row small">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} className="star-icon">★</span>
                    ))}
                  </div>
                  <p className="grid-card-quote">"{t.quote}"</p>
                  <div className="grid-card-footer">
                    <h4 className="author-name">{t.author}</h4>
                    <span className="author-loc">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;
