import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import Breadcrumbs from "../components/Breadcrumbs";
import "./Portfolio.css";


/* ── Hero Carousel vertical images ── */
const portfolioHeroImages = [
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/KRP_9777.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_I3A6612.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/SAS_3280.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/2S9A3065.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/NGD_4849-2.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/NGD_4961.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC3521_-_Copy.webp",
];

/* ── Featured grid images (landscape format) ── */
const featuredImages = [
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/2S9A9106__4__jpg.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/DSC06041_3__1___2__jpg.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/KRP_9557__3__jpg.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/KRP_9878__2__jpg.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/SAS_2092__2__jpg.webp",
  "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/hero-banner/SASP4766__2__jpg.webp",
];

/* ── Collection sections ── */
const collections = [
  {
    id: "wedding",
    title: "Wedding",
    tagline: "REAL EMOTIONS & INTIMATE MOMENTS",
    panels: [
      { label: "PHOTOGRAPHY",  img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp", to: "/portfolio/wedding" },
      { label: "WEDDING FILM", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp", to: "/films" },
    ],
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding",
    tagline: "CAPTURING YOUR LOVE'S FIRST GLANCE",
    panels: [
      { label: "PHOTOGRAPHY",      img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/KRP_9777.webp", to: "/portfolio/pre-wedding" },
      { label: "PRE-WEDDING FILM", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_I3A6612.webp", to: "/films" },
    ],
  },
];

/* ══════════════════════════
   LIGHTBOX COMPONENT
══════════════════════════ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const [sliding, setSliding] = useState(false);
  const [dir, setDir] = useState(0);

  const go = useCallback((direction) => {
    if (sliding) return;
    setDir(direction);
    setSliding(true);
    setTimeout(() => {
      setCurrent((c) => (c + direction + images.length) % images.length);
      setSliding(false);
      setDir(0);
    }, 250);
  }, [sliding, images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const slideClass = sliding ? (dir > 0 ? "lb-exit-left" : "lb-exit-right") : "lb-enter";

  return (
    <div className="lb-overlay" onClick={onClose}>
      {/* Close button */}
      <button className="lb-close" onClick={onClose} aria-label="Close">&#10005;</button>

      {/* Image */}
      <div className={`lb-img-wrap ${slideClass}`} onClick={(e) => e.stopPropagation()}>
        <img src={images[current]} alt={`Image ${current + 1}`} />
      </div>

      {/* Prev */}
      <button className="lb-arrow lb-arrow--prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">
        &#8249;
      </button>

      {/* Next */}
      <button className="lb-arrow lb-arrow--next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">
        &#8250;
      </button>

      {/* Counter */}
      <span className="lb-counter">{current + 1} / {images.length}</span>
    </div>
  );
};

/* ══════════════════════════
   PORTFOLIO PAGE
══════════════════════════ */
const Portfolio = () => {
  useSEO({
    title: "Wedding & Pre-Wedding Portfolio | Shoot At Sight, Bangalore",
    description: "Browse real Bangalore and destination weddings, pre-wedding shoots and cinematic films, with venue, city and coverage detail for each.",
    ogImage: portfolioHeroImages[0],
  });

  const [lightbox, setLightbox] = useState(null);
  const openLb = (images, index) => setLightbox({ images, index });
  const closeLb = useCallback(() => setLightbox(null), []);

  const [activeIdx, setActiveIdx] = useState(2);

  const prevHero = () => {
    setActiveIdx((prev) => (prev - 1 + portfolioHeroImages.length) % portfolioHeroImages.length);
  };

  const nextHero = () => {
    setActiveIdx((prev) => (prev + 1) % portfolioHeroImages.length);
  };

  // Helper to compute 5 visible items centered around activeIdx
  const getVisibleItems = () => {
    const total = portfolioHeroImages.length;
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (activeIdx + offset + total) % total;
      return {
        img: portfolioHeroImages[index],
        offset,
        index,
      };
    });
  };

  return (
    <div className="ptf-page">

      {/* ── 1. LUXURY 5-PANEL HERO CAROUSEL BANNER ── */}
      <div className="ptf-hero-banner">

        <div className="ptf-hero-heading-wrap">
          <h1 className="ptf-hero-heading">Wedding &amp; Pre-Wedding Portfolio in Bangalore</h1>
        </div>

        {/* 5 Vertical Panel Stage */}
        <div className="ptf-hero-stage">
          {getVisibleItems().map(({ img, offset, index }) => (
            <div
              key={`${index}-${offset}`}
              className={`ptf-hero-card ptf-hero-card--${
                offset === 0
                  ? "center"
                  : offset < 0
                  ? `left-${Math.abs(offset)}`
                  : `right-${offset}`
              }`}
              onClick={() => openLb(portfolioHeroImages, index)}
            >
              <img src={img} alt={`Portfolio frame ${index + 1}`} loading="eager" />
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

      <Breadcrumbs />

      {/* ── 2. COLLECTION SECTIONS ── */}
      {collections.map((col) => (
        <section key={col.id} className="ptf-collection">
          <div className="ptf-col-header">
            <h2 className="ptf-col-heading">
              <span className="ptf-col-serif">{col.title}</span>
              <span className="ptf-col-script">collection</span>
            </h2>
            <div className="ptf-col-line" />
            <span className="ptf-col-tagline">{col.tagline}</span>
          </div>

          <div className="ptf-col-panels">
            {col.panels.map((panel) => (
              <Link key={panel.label} to={panel.to} className="ptf-col-panel">
                <img src={panel.img} alt={panel.label} loading="lazy" className="ptf-col-panel-img" />
                <div className="ptf-col-panel-text"><span>{panel.label}</span></div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* ── 3. FEATURED WEDDING ── */}
      <section className="ptf-featured">
        <div className="ptf-featured-label">
          <span className="ptf-featured-script">Featured</span>
          <span className="ptf-featured-serif">Wedding</span>
          <Link to="/portfolio/wedding" className="ptf-featured-more">VIEW MORE +</Link>
        </div>
        <div className="ptf-featured-grid">
          {featuredImages.map((img, i) => (
            <div key={i} className="ptf-featured-cell" onClick={() => openLb(featuredImages, i)}>
              <img src={img} alt={`Featured ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={closeLb} />
      )}

    </div>
  );
};


export default Portfolio;
