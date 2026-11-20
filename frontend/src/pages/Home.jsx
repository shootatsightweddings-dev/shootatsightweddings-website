import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import OurStory from '../components/OurStory';
import Services from '../components/Services';
import RecentShoots from '../components/RecentShoots';
import Experience from '../components/Experience';
import FlyingDrone from '../components/FlyingDrone';
import Testimonials from '../components/Testimonials';
import RealReviews from '../components/RealReviews';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../context/siteConfigState';
import useSEO from '../hooks/useSEO';
import { DEFAULT_VIDEO_URL, DEFAULT_POSTER_URL } from '../data/videoDefaults';
import { realReviews, SOURCE_URL } from '../data/realReviews';

const reviewsJsonLd = realReviews.map((r) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: { '@type': 'LocalBusiness', name: 'Shoot At Sight Weddings' },
  author: { '@type': 'Person', name: r.name },
  reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
  reviewBody: r.quote,
  datePublished: r.approxDate,
  publisher: { '@type': 'Organization', name: 'WedMeGood', url: SOURCE_URL },
}));

const Home = () => {
  const { config } = useSiteConfig();
  const [featuredFilmPlaying, setFeaturedFilmPlaying] = useState(false);

  useSEO({
    title: 'Editorial Wedding Photography & Cinematic Films in Bangalore | Shoot At Sight Weddings',
    description: 'Bangalore wedding photographers shooting editorial, candid and cinematic weddings. 250+ weddings, 15+ cities. See the portfolio and get in touch.',
    ogImage: '/NAVEEN%20AND%20KATE/SYD08467.webp',
    jsonLd: reviewsJsonLd,
  });

  const featuredFilmContent = config?.featured_film || {
    videoUrl: DEFAULT_VIDEO_URL,
    posterUrl: DEFAULT_POSTER_URL,
    tagline: '03 // FEATURED FILMS',
    headingMain: 'Cinematic',
    headingHighlight: 'Poetry',
    description: 'Experience the raw emotion, the fleeting glances, and the symphony of love in motion.',
    buttonText: 'View Films'
  };

  const ctaContent = config?.cta || {
    headingMain: "Let's create",
    headingHighlight: 'eternal',
    subtext: 'Now booking luxury wedding experiences for 2026/27.',
    bgText: 'CONTACT',
    buttonText: 'Start a Conversation',
    bgImage: '/shoot-sight-latest-images/KRP_7298.jpg.webp'
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const timer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    const timer3 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const featuredVideoUrl = featuredFilmContent.videoUrl || DEFAULT_VIDEO_URL;
  const featuredPosterUrl = featuredFilmContent.posterUrl || DEFAULT_POSTER_URL;

  return (
    <>
      <Hero />
      <div className="home-content-wrapper">
        <OurStory />
        <RecentShoots />
        <Services />

        <Experience />

        <section className="landing-film-section">
          <div className="landing-film-video">
            {featuredFilmPlaying ? (
              <video
                src={featuredVideoUrl}
                poster={featuredPosterUrl}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Featured Shoot At Sight Weddings film"
              />
            ) : (
              <button
                type="button"
                className="landing-film-facade"
                onClick={() => setFeaturedFilmPlaying(true)}
                aria-label={`Play ${featuredFilmContent.headingMain} ${featuredFilmContent.headingHighlight} film`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                  backgroundImage: `url("${featuredPosterUrl}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="landing-film-play-icon" aria-hidden="true">&#9658;</span>
              </button>
            )}
          </div>

          <div className="landing-film-overlay">
            <span className="subtitle-accent">{featuredFilmContent.tagline}</span>
            <h2 className="film-section-heading">
              {featuredFilmContent.headingMain} <i>{featuredFilmContent.headingHighlight}</i>
            </h2>
            <p className="film-description">
              {featuredFilmContent.description}
            </p>
            <Link to="/films" className="btn-premium">{featuredFilmContent.buttonText}</Link>
          </div>
        </section>

        <Testimonials />
        <RealReviews />

        <section
          className="cta-section section-padding"
          style={{ backgroundImage: `url(${ctaContent.bgImage})` }}
        >
          <div className="container">
            <div className="cta-content">
              <h2 className="section-title-large">
                {ctaContent.headingMain} <br />something <i>{ctaContent.headingHighlight}</i>.
              </h2>
              <p>{ctaContent.subtext}</p>
              <div className="cta-actions">
                <Link to="/contact" className="btn-premium">{ctaContent.buttonText}</Link>
              </div>
            </div>
          </div>
          <div className="cta-bg-text">{ctaContent.bgText}</div>
        </section>
      </div>

      <FlyingDrone />
    </>
  );
};

export default Home;
