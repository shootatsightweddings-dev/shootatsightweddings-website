import { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSiteConfig } from '../context/siteConfigState';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import './Films.css';
import { DEFAULT_FILMS } from '../data/videoDefaults';

const Films = () => {
  const [activeFilm, setActiveFilm] = useState(null);
  const { config } = useSiteConfig();

  const filmsContent = config?.films_page || {
    tagline: '03 // FEATURED FILMS',
    headingMain: 'Cinematic',
    headingHighlight: 'Poetry',
    description: 'Experience the raw emotion, the fleeting glances, and the symphony of love in motion. Click any film to watch with full audio.',
    list: DEFAULT_FILMS
  };

  const films = filmsContent.list || [];
  const videosJsonLd = films.filter((film) => film.videoUrl && film.posterUrl && film.uploadDate).map((film) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: film.videoTitle || film.label,
    description: `${film.videoTitle || film.label} — a wedding film by Shoot At Sight Weddings, ${film.location}.`,
    thumbnailUrl: film.posterUrl,
    uploadDate: film.uploadDate,
    contentUrl: film.videoUrl,
    publisher: { '@type': 'Organization', name: 'Shoot At Sight Weddings' },
  }));

  useSEO({
    title: 'Cinematic Wedding Films in Bangalore | Shoot At Sight',
    description: 'Wedding films from short highlight reels to full documentary edits. Watch real films by Shoot At Sight Weddings.',
    jsonLd: videosJsonLd,
  });

  useGSAP(() => {
    gsap.from('.film-card', {
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }, [films]);

  useEffect(() => {
    if (!activeFilm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeFilm]);

  const openFilm = (film) => {
    if (!film.videoUrl) return;
    setActiveFilm(film);
  };

  const closeFilm = () => {
    setActiveFilm(null);
  };

  return (
    <div className="films-page section-padding">
      <Breadcrumbs />
      <div className="container">
        <div className="films-page-header">
          <span className="subtitle-accent">{filmsContent.tagline}</span>
          <h1 className="section-title-large">
            {filmsContent.headingMain} <i>{filmsContent.headingHighlight}</i>
          </h1>
          <p className="films-page-desc">
            {filmsContent.description}
          </p>
        </div>

        <div className="films-grid">
          {films.map((film) => (
            <div
              key={film.id || film.num}
              className="film-card"
              role={film.videoUrl ? 'button' : undefined}
              tabIndex={film.videoUrl ? 0 : undefined}
              aria-label={film.videoUrl ? `Play ${film.label}` : undefined}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openFilm(film);
                }
              }}
              onClick={() => openFilm(film)}
            >
              <div className="film-card-thumb">
                {film.posterUrl ? (
                  <img src={film.posterUrl} alt={film.label} loading="lazy" />
                ) : (
                  <div className="film-card-placeholder">{film.videoUrl ? film.label : 'Coming soon'}</div>
                )}
                {film.videoUrl && <div className="film-card-overlay">
                  <div className="film-play-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>}
              </div>
              <div className="film-card-meta">
                <span className="film-card-num">{film.num}</span>
                <div>
                  <div className="film-card-label">{film.label}</div>
                  <div className="film-card-location">{film.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Film Modal */}
      {activeFilm && (
        <div className="film-modal-overlay" onClick={closeFilm}>
          <div className="film-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="film-modal-close" onClick={closeFilm}>✕</button>
            <div className="film-modal-meta">
              <span className="film-modal-num">{activeFilm.num}</span>
              <span className="film-modal-title">{activeFilm.label} // {activeFilm.location}</span>
            </div>
            <div className="film-modal-video">
              <video
                key={activeFilm.videoUrl}
                src={activeFilm.videoUrl}
                poster={activeFilm.posterUrl || undefined}
                autoPlay
                controls
                playsInline
                preload="metadata"
                aria-label={activeFilm.label}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Films;
