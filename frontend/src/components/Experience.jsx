import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/siteConfigState';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const containerRef = useRef(null);
  const { config } = useSiteConfig();

  const expContent = config?.experience || {
    tagline: '02 // THE EXPERIENCE',
    titleMain: 'How We',
    titleHighlight: 'Manifest',
    titleEnd: 'Magic',
    subtitle: 'Three deliberate phases, crafted to create timeless imagery.',
    phases: [
      {
        num: 'Phase 01 // Curation',
        heading: 'The Curation',
        desc: 'We begin by understanding the soul of your story, selecting the perfect aesthetic tone and light for your unique celebration.',
        tags: ['Moodboarding', 'Lighting Design', 'Styling Harmony'],
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/_DSC4382.webp'
      },
      {
        num: 'Phase 02 // Capture',
        heading: 'The Capture',
        desc: 'Discreet, immersive, and refined. We capture the moments that feel like a whisper, and the ones that roar across time.',
        tags: ['Discreet Presence', 'Candid Emotion', 'Cinematic Framing'],
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/KRP_9557.jpg.webp'
      },
      {
        num: 'Phase 03 // Heirloom',
        heading: 'The Heirloom',
        desc: 'Final delivery of high-fidelity, processed imagery designed to last for generations. Your legacy, preserved in light.',
        tags: ['Color Grading', 'Fine Art Prints', 'Digital Vault'],
        img: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00045.webp',
        video: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Naveen%20%26%20Kate%204K%20Teaser.mp4'
      }
    ]
  };

  useGSAP(() => {
    const header = containerRef.current?.querySelector('.exp-section-header');
    const cards = gsap.utils.toArray('.exp-card', containerRef.current);

    // Set visible by default — GSAP only adds the motion, never hides permanently
    gsap.set([header, ...cards], { opacity: 1 });

    gsap.fromTo(header,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 90%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
          onEnter: () => gsap.set(header, { clearProps: 'all' }),
        }
      }
    );

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
            onEnter: () => gsap.set(card, { clearProps: 'all' }),
          }
        }
      );
    });

    // Fallback: if after 3s anything is still invisible, force show everything
    const fallback = setTimeout(() => {
      gsap.set([header, ...cards], { clearProps: 'all' });
      ScrollTrigger.refresh();
    }, 3000);

    return () => clearTimeout(fallback);

  }, { scope: containerRef, dependencies: [expContent] });

  return (
    <section ref={containerRef} className="experience-section">
      <div className="container">

        {/* Section Header */}
        <div className="exp-section-header">
          <span className="subtitle-accent">{expContent.tagline}</span>
          <h2 className="exp-main-title">
            {expContent.titleMain} <i>{expContent.titleHighlight}</i> {expContent.titleEnd}
          </h2>
          <p className="exp-subtitle">{expContent.subtitle}</p>
        </div>

        {/* Cards Grid */}
        <div className="exp-cards-grid">
          {expContent.phases.map((phase, idx) => {
            const isReverse = idx % 2 === 0;
            const currentVideo = phase.video || (idx === 2 || phase.num?.includes('03') ? "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Naveen%20%26%20Kate%204K%20Teaser.mp4" : null);

            return (
              <div key={idx} className={`exp-card ${isReverse ? 'exp-card--reverse' : ''}`}>
                {isReverse ? (
                  <>
                    <div className="exp-card__text">
                      <span className="layer-num">{phase.num}</span>
                      <h3 className="layer-heading">{phase.heading}</h3>
                      <p className="layer-desc">{phase.desc}</p>
                      <div className="layer-tags">
                        {phase.tags && phase.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="exp-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="exp-card__image">
                      <div className="img-reveal-wrapper">
                        {currentVideo ? (
                          <video
                            poster={phase.img}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`exp-video ${idx === 1 ? 'capture-img' : idx === 2 ? 'heirloom-img' : ''}`}
                          >
                            <source src={currentVideo} type="video/mp4" />
                            <source src="https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Low%20Bitrate.mp4" type="video/mp4" />
                            <img src={phase.img} alt={phase.imgAlt || phase.heading} />
                          </video>
                        ) : (
                          <img
                            src={phase.img}
                            alt={phase.imgAlt || phase.heading}
                            loading="lazy"
                            decoding="async"
                            className={idx === 1 ? 'capture-img' : idx === 2 ? 'heirloom-img' : ''}
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="exp-card__image">
                      <div className="img-reveal-wrapper">
                        {currentVideo ? (
                          <video
                            poster={phase.img}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`exp-video ${idx === 1 ? 'capture-img' : idx === 2 ? 'heirloom-img' : ''}`}
                          >
                            <source src={currentVideo} type="video/mp4" />
                            <source src="https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/Low%20Bitrate.mp4" type="video/mp4" />
                            <img src={phase.img} alt={phase.imgAlt || phase.heading} />
                          </video>
                        ) : (
                          <img
                            src={phase.img}
                            alt={phase.imgAlt || phase.heading}
                            loading="lazy"
                            decoding="async"
                            className={idx === 1 ? 'capture-img' : idx === 2 ? 'heirloom-img' : ''}
                          />
                        )}
                      </div>
                    </div>
                    <div className="exp-card__text">
                      <span className="layer-num">{phase.num}</span>
                      <h3 className="layer-heading">{phase.heading}</h3>
                      <p className="layer-desc">{phase.desc}</p>
                      <div className="layer-tags">
                        {phase.tags && phase.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="exp-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Experience;
