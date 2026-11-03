import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useSiteConfig } from '../context/siteConfigState';
import './Services.css';

const Services = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);
  const { config } = useSiteConfig();
  const navigate = useNavigate();

  const servicesContent = config?.services || {
    tagline: 'CRAFT & MASTERY',
    titleMain: 'Our',
    titleHighlight: 'Signature',
    titleEnd: 'Services',
    list: [
      {
        num: '01',
        title: 'Wedding Photography',
        desc: 'Candid, emotional, and trend-forward photography that captures the soul of your celebration. We specialize in natural expressions, ethereal lighting, and storytelling frames that preserve your most intimate memories forever.',
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/VIJ01478.jpg.webp'
      },
      {
        num: '02',
        title: 'Cinematic Wedding Films',
        desc: 'High-definition movies inspired by your unique love story. With artistic angles, cinematic drone perspectives, emotional pacing, and professional-grade color grading, we turn your wedding day into a timeless motion picture experience.',
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/DSC_9199-2.jpg.webp'
      },
      {
        num: '03',
        title: 'Pre-Wedding & Engagement',
        desc: 'A bespoke, conceptual shoot that reflects the essence of your partnership. Whether urban, nature-focused, luxury, or minimalist aesthetic — we curate mood-driven visuals designed for your legacy and invites.',
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/DSC00238-Edit%20(1).jpg.webp'
      },
      {
        num: '04',
        title: 'Drone & Aerial Coverage',
        desc: 'Sweeping aerial views that provide a grand perspective of your wedding story. From majestic heritage venues to scenic outdoor landscapes, our advanced drone cinematography adds a breathtaking dimension to your visuals.',
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/DJI_20260429175238_0374_D-_1_.jpg.webp'
      }
    ]
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;

      const { clientY } = e;
      const viewportWidth = window.innerWidth;
      const imageWidth = 400;
      const imageHeight = 550;

      // Place it 60px from the right edge of the viewport
      const targetX = viewportWidth - imageWidth - 60;

      // Clamp Y position to keep it fully within the viewport
      const minY = 20;
      const maxY = window.innerHeight - imageHeight - 20;
      const targetY = Math.max(minY, Math.min(maxY, clientY - imageHeight / 2));

      gsap.to(imageRef.current, {
        x: targetX,
        y: targetY,
        rotation: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleServiceClick = (service) => {
    let cat;
    const title = service.title.toLowerCase();
    if (title.includes('wedding photography') || title.includes('photo')) {
      cat = 'Wedding';
    } else if (title.includes('cinematic') || title.includes('film') || title.includes('drone') || title.includes('aerial')) {
      cat = 'Cinematic';
    } else if (title.includes('pre-wedding') || title.includes('engagement')) {
      cat = 'Pre-wedding';
    } else {
      cat = 'Editorial';
    }
    navigate(`/portfolio?category=${cat}`);
  };

  const services = servicesContent.list;

  return (
    <section
      ref={sectionRef}
      className="services-section section-padding"
      onMouseLeave={() => {
        // Force hide when mouse leaves the entire section
        gsap.to(imageRef.current, { opacity: 0, scale: 0.8, duration: 0.4 });
      }}
    >
      <div className="container">
        <div className="services-header">
          <span className="subtitle-accent">{servicesContent.tagline}</span>
          <h2 className="services-main-title">
            {servicesContent.titleMain} <i>{servicesContent.titleHighlight}</i> {servicesContent.titleEnd}
          </h2>
        </div>

        <div className="services-list">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-item"
              onMouseEnter={() => {
                setActiveImage(service.img);
                gsap.to(imageRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
              }}
              onMouseLeave={() => {
                gsap.to(imageRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" });
              }}
              onClick={() => handleServiceClick(service)}
            >
              <div className="service-number">{service.num}</div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Image Follower */}
        <div ref={imageRef} className="floating-service-image">
          {activeImage && <img src={activeImage} alt="Service Preview" />}
        </div>
      </div>
    </section>
  );
};

export default Services;
