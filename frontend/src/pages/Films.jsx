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

  const films = (filmsContent.list || []).filter((film) => film.published !== false);
  // Wedding films first, then pre-wedding films (set per film in admin).
  const filmSections = [
    { key: 'wedding', title: 'Wedding Films', films: films.filter((film) => film.category !== 'pre-wedding') },
    { key: 'pre-wedding', title: 'Pre-wedding Films', films: films.filter((film) => film.category === 'pre-wedding') },
  ].filter((section) => section.films.length > 0);
  const canPlay = (film) => Boolean(film.videoUrl);
  const absolute = (url) => (url && !/^https?:\/\//.test(url) ? `https://www.shootatsightweddings.com${url}` : url);
  const videosJsonLd = films.filter((film) => canPlay(film) && film.posterUrl && film.uploadDate).map((film) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: film.videoTitle || film.label,
    description: `${film.videoTitle || film.label} — a ${film.category === 'pre-wedding' ? 'pre-wedding' : 'wedding'} film by Shoot At Sight Weddings, ${film.location}.`,
    thumbnailUrl: absolute(film.posterUrl),
    uploadDate: film.uploadDate,
    contentUrl: absolute(film.videoUrl),
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
  // Keyed on the count, not the array: the list is rebuilt on every render,
  // so keying on it replayed the fade-in each time a film was opened or closed.
  }, [films.length]);

  useEffect(() => {
    if (!activeFilm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeFilm]);

  const openFilm = (film) => {
    if (!canPlay(film)) return;
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

        {filmSections.map((section) => (
        <section key={section.key} className="films-section" aria-labelledby={`films-${section.key}`}>
        {filmSections.length > 1 && <h2 id={`films-${section.key}`} className="films-section-title">{section.title}</h2>}
        <div className="films-grid">
          {section.films.map((film) => (
            <div
              key={film.id || film.num}
              className="film-card"
              role={canPlay(film) ? 'button' : undefined}
              tabIndex={canPlay(film) ? 0 : undefined}
              aria-label={canPlay(film) ? `Play ${film.label}` : undefined}
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
                  <div className="film-card-placeholder">{canPlay(film) ? film.label : 'Coming soon'}</div>
                )}
                {canPlay(film) && <div className="film-card-overlay">
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
        </section>
        ))}
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
