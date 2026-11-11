import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import Breadcrumbs from "../components/Breadcrumbs";
import { API_URL } from "../config";
import "./PreWeddingGallery.css";


/* Handpicked High-Res Pre-Wedding R2 Frames */
const curatedPreWeddingFrames = [
  {
    url: "/common/KRP_9777.webp",
    title: "Ethereal Sunset Promenade"
  },
  {
    url: "/common/_I3A6612.webp",
    title: "Heritage Doorway Reflection"
  },
  {
    url: "/common/SAS_3280.webp",
    title: "Intimate Canopy Moment"
  },
  {
    url: "/common/2S9A3065.webp",
    title: "Royal Courtyard Walk"
  },
  {
    url: "/common/NGD_4849-2.webp",
    title: "Candlelit Garden Whispers"
  },
  {
    url: "/common/NGD_4961.webp",
    title: "Golden Hour Embrace"
  },
  {
    url: "/common/_DSC3521_-_Copy.webp",
    title: "Royal Palace Archway"
  },
  {
    url: "/aishwarya%20and%20akshay/KRP_8213.webp",
    title: "Editorial Sunset Walk"
  },
  {
    url: "/ragini/_I3A6607.webp",
    title: "Poetic Grace & Silk"
  },
  {
    url: "/ragini/_I3A6987.webp",
    title: "Golden Sun Reflection"
  },
  {
    url: "/ragini/_I3A7446.webp",
    title: "Heritage Garden Stroll"
  },
  {
    url: "/srinidhi%20and%20ramya/DSC00045.webp",
    title: "Intimate Forehead Kiss"
  },
  {
    url: "/srinidhi%20and%20ramya/DSC00167.webp",
    title: "Warm Floral Festivity"
  },
  {
    url: "/srinidhi%20and%20ramya/DSC00236-Edit.webp",
    title: "Misty Mountain Backdrop"
  },
  {
    url: "/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp",
    title: "Musical Harmony"
  },
  {
    url: "/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_7085.webp",
    title: "Traditional Ceremony Laughter"
  },
  {
    url: "/NAVEEN%20AND%20KATE/SYD08292.webp",
    title: "High Fashion Architecture"
  },
  {
    url: "/NAVEEN%20AND%20KATE/SYD08325.webp",
    title: "Royal Archway Portrait"
  },
  {
    url: "/NAVEEN%20AND%20KATE/SYD08510.webp",
    title: "Twilight Lawn Stroll"
  },
  {
    url: "/aishwarya%20and%20akshay/KRP_7896.webp",
    title: "Sparkler Fireworks Celebration"
  },
  {
    url: "/aishwarya%20and%20akshay/_DSC8119.webp",
    title: "Palace Pillars Promenade"
  }
];

const PreWeddingGallery = () => {
  useSEO({
    title: "Pre-Wedding Shoots in Bangalore | Shoot At Sight",
    description: "Pre-wedding and engagement shoots in Bangalore and on location. Concepts, best locations, and how to book.",
    ogImage: curatedPreWeddingFrames[0]?.url,
  });

  const [shoots, setShoots] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const res = await fetch(`${API_URL}/shoots`);
        const data = await res.json();
        const preWedding = (data.data || []).filter(
          (s) => s.category?.toLowerCase().includes("pre-wedding")
        );
        setShoots(preWedding);
      } catch (err) {
        console.error("Failed to fetch pre-wedding shoots", err);
      }
    };
    fetchShoots();
  }, []);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? curatedPreWeddingFrames.length - 1 : prev - 1));
  }, [lightboxIndex]);

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === curatedPreWeddingFrames.length - 1 ? 0 : prev + 1));
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, prevLightbox, nextLightbox]);

  return (
    <div className="pwg-page">
      <Breadcrumbs />

      {/* ── Header ── */}
      <div className="pwg-header">
        <Link to="/portfolio" className="pwg-back">&#8592; BACK TO PORTFOLIO</Link>
        <div className="pwg-title-block">
          <h1 className="pwg-title">
            <span className="pwg-title-serif">Pre-Wedding</span>{" "}
            <span className="pwg-title-script">collection</span>
          </h1>
          <p className="pwg-tagline">CAPTURING YOUR LOVE&apos;S FIRST GLANCE</p>
        </div>
      </div>

      {/* ── Shoots List (if any backend data) ── */}
      {shoots.length > 0 && (
        <div className="pwg-shoots-section">
          <h2 className="pwg-section-heading">Featured Couples Stories</h2>
          <div className="pwg-couples-grid">
            {shoots.map((shoot) => (
              <Link
                key={shoot.slug}
                to={`/shoot/${shoot.slug}`}
                className="pwg-couple-card"
              >
                <div className="pwg-couple-img-wrap">
                  <img src={shoot.heroImage} alt={shoot.title} loading="lazy" />
                </div>
                <div className="pwg-couple-overlay">
                  <span className="pwg-couple-name">{shoot.title}</span>
                  <span className="pwg-couple-link">EXPLORE STORY &#8594;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Curated Fine Art Pre-Wedding Grid (Pure Image Grid, No Text) ── */}
      <div className="pwg-curated-section">
        <div className="pwg-curated-header">
          <span className="pwg-curated-tag">EDITORIAL LOOKBOOK</span>
          <h2 className="pwg-curated-title">Fine Art Pre-Wedding Frames</h2>
        </div>

        <div className="pwg-grid">
          {curatedPreWeddingFrames.map((frame, idx) => (
            <div
              key={idx}
              className="pwg-grid-cell"
              onClick={() => openLightbox(idx)}
            >
              <div className="pwg-cell-img-wrap">
                <img
                  src={frame.url}
                  alt={frame.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/common/KRP_9777.webp";
                  }}
                />
                <div className="pwg-cell-zoom">EXPLORE FULLSCREEN</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ── Fullscreen Lightbox ── */}
      {lightboxIndex !== null && (
        <div className="pwg-lightbox-modal" onClick={closeLightbox}>
          <button className="pwg-lb-close" onClick={closeLightbox}>✕</button>

          <button
            className="pwg-lb-nav pwg-lb-prev"
            onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
          >
            &#8592;
          </button>

          <div className="pwg-lb-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={curatedPreWeddingFrames[lightboxIndex].url}
              alt={curatedPreWeddingFrames[lightboxIndex].title}
            />
            <div className="pwg-lb-caption">
              <span>{curatedPreWeddingFrames[lightboxIndex].title}</span>
              <span className="pwg-lb-counter">
                {lightboxIndex + 1} / {curatedPreWeddingFrames.length}
              </span>
            </div>
          </div>
          <button
            className="pwg-lb-nav pwg-lb-next"
            onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
          >
            &#8594;
          </button>
        </div>
      )}

    </div>
  );
};

export default PreWeddingGallery;
