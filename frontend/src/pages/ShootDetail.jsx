import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API_URL } from '../config';
import useSEO from '../hooks/useSEO';
import { isoDate } from '../utils/articleSeo';
import Breadcrumbs from '../components/Breadcrumbs';
import './ShootDetail.css';








gsap.registerPlugin(ScrollTrigger);

const mockShootData = {
  'aishwarya-and-akshay': {
    title: "Aishwarya & Akshay",
    date: "May 2026",
    location: "Bangalore",
    desc: "An editorial wedding narrative captured with timeless sophistication. From grand architectural frames to the quietest glances, Aishwarya and Akshay's celebration was a masterclass in elegance.",
    hero: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp",
    gallery: [
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_6193.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_6202.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_6209.jpg",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_7208.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_7791.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_7858.jpg",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_7896.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8887.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_9045.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_9106.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/_DSC7299.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/_DSC7806.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/_DSC8119.webp"
    ]
  },
  'srinidhi-and-ramya': {
    title: "Srinidhi & Ramya",
    date: "May 2026",
    location: "Bangalore",
    desc: "A heartfelt celebration of love, warmth, and togetherness. Srinidhi and Ramya's wedding was a beautiful story of two families coming together, captured in every candid laugh and tender moment.",
    hero: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00045.webp",
    gallery: [
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00013.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00045.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00167.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00174.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00219.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00236-Edit.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00238-Edit.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00868.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC01641.webp"
    ]
  },
  'raghudixith-varijashree': {
    title: "Raghu Dixit & Varijashree",
    date: "May 2026",
    location: "Bangalore",
    desc: "A beautiful, musical celebration of love and art. Documented with raw emotion, vibrant energy, and timeless cinematic framing.",
    hero: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp",
    gallery: [
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6707.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6712.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6719.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6723.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_7085.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_7151.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_7412.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_7441.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A7334.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A7603.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A7606-2.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A7645.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A7854.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8221.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8224.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8226.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8233.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8234.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8267.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/_01A8274.webp"
    ]
  },
  'naveen-kate': {
    title: "Naveen & Kate",
    date: "May 2026",
    location: "Sydney",
    desc: "A breathtaking high-fashion wedding celebration. Every single moment radiated elegance, love, and joyous festivity, captured against beautiful backdrops with pristine lighting.",
    hero: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp",
    gallery: [
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD07968.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD07976.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08046.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08122.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08132.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08167.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08209.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08264.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08292.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08295.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08301.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08325.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08335.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08347.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08349.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08396.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08404.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08450.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08504.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08510.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08526.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08556.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08617.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08653.webp"
    ]
  },
  'ragini': {
    title: "Ragini",
    date: "May 2026",
    location: "Bangalore",
    desc: "A stunning portrait story of grace and beauty. Every frame was crafted to celebrate Ragini's elegance with soft, cinematic lighting and a timeless editorial approach.",
    hero: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6607.webp",
    gallery: [
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6369.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6392.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6398.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6607.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6939.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6987.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A7057.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A7175.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A7398.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A7446.webp",
      "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A7475.webp"
    ]
  }
};

const ImageWithSkeleton = ({ src, alt, className = "", fetchPriority, loading = "lazy", onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`img-skeleton-container ${loaded ? "is-loaded" : "is-loading"}`} onClick={onClick}>
      {!loaded && <div className="img-skeleton-shimmer" />}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const ShootDetail = () => {
  const { id } = useParams();
  const container = useRef();
  const [shoot, setShoot] = useState(null);
  const [allShoots, setAllShoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const shootSeoTitle = shoot
    ? (id === 'raghudixith-varijashree'
        ? 'Raghu Dixit & Varijashree Venugopal Wedding | Shoot At Sight'
        : `${shoot.title} Wedding${shoot.location ? ` | ${shoot.location}` : ''} | Shoot At Sight`)
    : 'Gallery Collection';

  const imagesJsonLd = shoot
    ? [shoot.hero, ...(shoot.gallery || [])].filter(Boolean).map((url, index) => ({
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: url,
        caption: (index === 0 ? shoot.heroImageAlt : shoot.galleryAlt?.[index - 1]) || `${shoot.title}${shoot.location ? ` — ${shoot.location}` : ''}`,
        creator: { '@type': 'Organization', name: 'Shoot At Sight Weddings' },
        copyrightNotice: `© ${new Date().getFullYear()} Shoot At Sight Weddings`,
        creditText: 'Shoot At Sight Weddings',
      }))
    : [];

  useSEO({
    title: shoot?.metaTitle || shootSeoTitle,
    canonicalUrl: shoot?.canonicalUrl,
    description: shoot ? (shoot.metaDescription || shoot.desc) : 'Explore the editorial wedding and pre-wedding galleries by Shoot At Sight Weddings.',
    ogImage: shoot ? shoot.hero : null,
    noindex: !shoot,
    breadcrumbLabels: shoot ? { [`/shoot/${id}`]: shoot.title } : undefined,
    jsonLd: [...imagesJsonLd, ...(shoot?.narrative ? [{
      '@context':'https://schema.org','@type':'Article',headline:shoot.title,
      description:shoot.metaDescription || shoot.desc,image:shoot.hero,
      datePublished:isoDate(shoot.createdAt),dateModified:isoDate(shoot.updatedAt),
      author:{'@type':'Organization','@id':'https://www.shootatsightweddings.com/#business',name:'Shoot At Sight Weddings'},
      about:{'@type':'Event',name:shoot.title,location:shoot.location},
    }] : [])],
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_URL}/shoots`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setAllShoots(data.data);
        }
      } catch {
        // Keep the local shoot list when the API is unavailable.
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchShoot = async () => {
      try {
        const res = await fetch(`${API_URL}/shoots/${id}`);
        const data = await res.json();

        if (res.ok && data.data) {
          const s = data.data;
          setShoot({
            ...s,
            title: s.title,
            date: s.date,
            location: s.location,
            desc: s.desc,
            hero: s.heroImage,
            gallery: s.gallery || []
          });
        } else {
          setShoot(mockShootData[id] || mockShootData['naveen-kate']);
        }
      } catch {
        setShoot(mockShootData[id] || mockShootData['naveen-kate']);
      } finally {
        setLoading(false);
      }
    };
    fetchShoot();
  }, [id]);

  useEffect(() => {
    if (loading || !shoot) return;

    const ctx = gsap.context(() => {
      gsap.from(".exhibition-title-line", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(".exhibition-hero-img-wrapper", {
        scale: 0.95,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5
      });

      gsap.utils.toArray('.exhibition-gallery-item', container.current).forEach(item => {
        gsap.from(item, {
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: "top 85%"
          }
        });
      });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [loading, shoot]);

  const currentIndex = allShoots.findIndex((s) => s.slug === id || s._id === id);
  const nextShoot = allShoots.length > 0
    ? allShoots[(currentIndex + 1 + allShoots.length) % allShoots.length]
    : null;

  if (loading || !shoot) {
    return (
      <div className="shoot-exhibition-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8c8c8c', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase' }}>Dimming the Lights...</p>
      </div>
    );
  }

  return (
    <div className="shoot-detail-page exhibition-theme" ref={container}>
      <Breadcrumbs currentLabel={shoot?.title} />
      {/* ── 2-Column Split: Left Image, Right Story Content ── */}
      {shoot && (
        <section className="sd-hero-split-section container">
          <div className="sd-split-grid">

            {/* Left Column: Full Uncropped Cover Image */}
            <div className="sd-split-left">
              <div className="sd-split-img-wrapper">
                <ImageWithSkeleton
                  src={shoot.hero}
                  alt={shoot.heroImageAlt || shoot.title}
                  className="sd-split-img"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right Column: Title, Meta & Intimate Narrative */}
            <div className="sd-split-right">
              <div className="header-meta">
                <span className="meta-item">{shoot.date}</span>
                <span className="meta-divider">•</span>
                <span className="meta-item">{shoot.location}</span>
              </div>

              <h1 className="exhibition-title display-serif">
                {shoot.title}
              </h1>

              <div className="sd-split-story">
                <h2 className="narrative-headline display-serif">The Intimate Narrative</h2>
                <p className="narrative-body lead-text">
                  {shoot.desc}
                </p>


                <div className="narrative-tags">
                  <span className="n-tag">Editorial</span>
                  <span className="n-tag">Documentary</span>
                  <span className="n-tag">Cinematic</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {shoot?.narrative && <section className="container" style={{maxWidth:820,padding:'48px 24px'}}>
        <h2>The story behind the celebration</h2>
        {shoot.narrative.split(/\n\s*\n/).filter(Boolean).map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        {shoot.resultsSummary && <p>{shoot.resultsSummary}</p>}
        {shoot.clientQuote && <blockquote><p>{shoot.clientQuote}</p><cite>{shoot.clientQuoteAuthor || 'The couple'}</cite></blockquote>}
      </section>}

      {/* Main Gallery Exhibition */}
      <section className="exhibition-gallery container">
        <div className="collage-grid-vintage">
          {shoot && shoot.gallery.map((imgUrl, idx) => {
            return (
              <div key={idx} className="collage-cell exhibition-gallery-item">
                <div
                  className="gallery-img-wrapper lightbox-trigger"
                  onClick={() => setLightboxImage(imgUrl)}
                >
                  <ImageWithSkeleton
                    src={imgUrl}
                    alt={shoot.galleryAlt?.[idx] || `${shoot.title} — wedding photograph ${idx + 1}`}
                    loading="lazy"
                  />
                  <div className="zoom-indicator">EXPLORE FULLSCREEN</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Next Story & Ending Transition Section */}
      <section className="sd-ending-section">
        <div className="sd-ending-divider">
          <span className="sd-ending-line" />
          <span className="sd-ending-diamond">✦</span>
          <span className="sd-ending-line" />
        </div>

        {nextShoot && nextShoot.slug !== id && (
          <div className="sd-next-block">
            <span className="sd-next-subtitle">NEXT STORY</span>
            <Link to={`/shoot/${nextShoot.slug}`} className="sd-next-card">
              <div className="sd-next-img-wrap">
                <img src={nextShoot.heroImage || nextShoot.hero} alt={nextShoot.title} />
              </div>
              <div className="sd-next-info">
                <h3 className="sd-next-title">{nextShoot.title}</h3>
                <span className="sd-next-location">{nextShoot.location}</span>
                <span className="sd-next-btn">EXPLORE STORY &rarr;</span>
              </div>
            </Link>
          </div>
        )}

        <div className="sd-back-archive-wrap">
          <Link to="/portfolio" className="sd-back-archive-btn">
            &larr; BACK TO ALL GALLERIES
          </Link>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div className="shoot-lightbox-modal" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close-btn" onClick={() => setLightboxImage(null)}>✕</button>
          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt={shoot.galleryAlt?.[shoot.gallery.indexOf(lightboxImage)] || shoot.heroImageAlt || shoot.title} className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShootDetail;
