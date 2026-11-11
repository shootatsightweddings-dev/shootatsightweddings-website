import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/siteConfigState';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const container = useRef();
  const { config } = useSiteConfig();

  const aboutContent = config?.about_page || {
    heroBg: '/common/DSC01641_-_Copy.webp',
    heroTitleMain: 'The Story Behind',
    heroTitleHighlight: 'The Light',
    heroTagline: 'SHOOT @ SIGHT // ARCHITECTS OF TIMELESS MEMORIES',
    founderImg: '/founder%20(1).webp',
    founderTagline: 'CREATIVE DIRECTOR // PAVITHRA ARUN KUMAR',
    founderName: 'Pavithra Arun Kumar',
    founderSub: 'Founder & Lead Visual Storyteller',
    founderQuote: 'Every journey begins with a single moment of passion. Mine began with a phone camera.',
    founderBio1: 'Five years ago, I started capturing everyday moments during my travels—without any professional equipment, just an eye for stories and emotions. Friends and family often told me, "You don\'t just take photos—you capture feelings. Every picture tells a story." Those words inspired me to keep learning, experimenting, and creating.',
    founderBio2: 'What started as a hobby soon became a calling. As I stepped into wedding photography, I discovered something special. Every smile, every tear, every heartfelt embrace felt personal. When a couple cried with joy, I found myself emotional too. When they laughed, I celebrated with them. I wasn\'t just documenting a wedding—I was living those moments alongside them.',
    founderBio3: 'That\'s when I realized I had found my purpose.',
    founderBio4: 'Today, through Shoot At Sight Weddings, our purpose is simple—to preserve the emotions you\'ll never want to forget. Every wedding tells a different love story, and we believe it deserves to be captured with honesty, creativity, and heart. Because photography isn\'t just about creating beautiful images—it\'s about preserving the feelings, the people, and the moments you\'ll cherish for a lifetime.',

    pillar1Title: 'Cinematic Intuition',
    pillar1Desc: 'Reading the room, anticipating micro-moments, and capturing raw, unposed emotions.',
    pillar2Title: 'Editorial Polish',
    pillar2Desc: 'Crafting stylized, Vogue-ready portraits on-site that feel elegant and modern.',
    signatureTitle: 'FOUNDER // SHOOT @ SIGHT',
    studioTagline: '02 // THE STUDIO',
    studioTitleMain: 'Curating',
    studioTitleHighlight: 'Legacy',
    studioTitleEnd: 'Through Light.',
    studioDesc: 'Founded in 2020, Shoot At Sight Weddings is a boutique photography studio specializing in high-end, editorial wedding narratives. We believe your story deserves to be told with the intentionality of fine art.',
    teamImg: '/common/team.webp',
    teamCaption: 'The Shoot At Sight Weddings Creative Collective, 2026',
    philosophyBg: '/common/camera_lens_detail.webp',
    philosophyTagline: 'INTENTIONAL // TIMING // RAW',
    philosophyTitleMain: 'The',
    philosophyTitleHighlight: 'Philosophy',
    philosophyPillars: [
      {
        num: '01 /',
        title: 'Intentionality',
        desc: 'We do not believe in spray-and-pray. Every single frame is composed with meticulous purpose, ensuring a cohesive, editorial fine-art narrative throughout your entire collection.'
      },
      {
        num: '02 /',
        title: 'Fidelity',
        desc: 'Utilizing state-of-the-art lossless processing and color curation, we ensure that natural skin tones, fine fabric textures, and raw emotions remain true to life for generations.'
      },
      {
        num: '03 /',
        title: 'Timelessness',
        desc: 'We completely avoid fleeting, heavily-filtered coloring trends. Our classic, cinematic styling guarantees your gallery looks as breathtaking in fifty years as it does today.'
      }
    ],
    closingQuote: 'Photography is the only language that can be understood anywhere in the world.',
    closingSignature: 'Shoot At Sight Weddings'
  };

  useSEO({
    title: 'About Pavithra & the Studio | Shoot At Sight Weddings, Bangalore',
    description: 'Meet Pavithra, founder and lead visual director of Shoot At Sight Weddings, and the editorial philosophy behind 250+ weddings documented across India.',
    ogImage: aboutContent.heroBg,
  });

  useGSAP(() => {
    // 0. Fullscreen Hero Entrance & Parallax
    const heroTl = gsap.timeline();
    heroTl.from('.about-hero-bg-img', {
      scale: 1.15,
      duration: 2.2,
      ease: 'power3.out'
    }).from('.about-hero-centered-content > *', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=1.7');

    gsap.to('.about-hero-bg-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-fullscreen-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 0.1 Philosophy Background Parallax
    gsap.to('.philosophy-portrait-img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-philosophy',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // 1. Hero Text Reveal (Magazine Spread)
    gsap.from('.about-title-word', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.about-hero-spread',
        start: 'top 80%'
      }
    });

    gsap.from('.about-hero-img', {
      scale: 1.08,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-hero-spread',
        start: 'top 80%'
      }
    });

    // 2. Parallax Image (Magazine Spread)
    gsap.to('.about-hero-img img', {
      y: 60,
      scrollTrigger: {
        trigger: '.about-hero-spread',
        scrub: true
      }
    });

    // 3. Stagger Philosophy items
    gsap.from('.philosophy-stack-item', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.philosophy-split-grid',
        start: 'top 95%', // Fires immediately when the grid enters the viewport
        once: true // Keeps elements visible once triggered
      }
    });

    // 4. Founder Entrance
    gsap.from('.founder-content-col > *', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-founder-section',
        start: 'top 90%', // Highly responsive entrance threshold
        once: true
      }
    });

    // 5. Founder Card Parallax/Reveal
    gsap.from('.founder-card-container', {
      x: -50,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-founder-section',
        start: 'top 90%',
        once: true
      }
    });
  }, { scope: container, dependencies: [aboutContent] });

  return (
    <div ref={container} className="about-page-editorial">

      {/* Fullscreen Hero Section with Parallax Background */}
      <section className="about-fullscreen-hero">
        <div className="about-hero-bg-wrapper">
          <img src={aboutContent.heroBg} alt={aboutContent.heroBgAlt || "The Story Behind The Light"} className="about-hero-bg-img" />
          <div className="about-hero-overlay"></div>
        </div>
        <div className="about-hero-centered-content">
          <span className="subtitle-accent-white">BEHIND THE LENS</span>
          <h1 className="about-hero-title">
            {aboutContent.heroTitleMain} <br /><i>{aboutContent.heroTitleHighlight}</i>
          </h1>
          <p className="about-hero-tagline">{aboutContent.heroTagline}</p>
          <div className="scroll-indicator-boutique white-indicator">
            <span className="line"></span>
            <span className="txt">DISCOVER OUR JOURNEY</span>
          </div>
        </div>
      </section>

      <Breadcrumbs />

      {/* The Founder Section */}
      <section className="about-founder-section section-padding">
        <div className="container">
          <div className="founder-grid">

            <div className="founder-image-col">
              <div className="founder-card-container">
                <div className="founder-vertical-tag">{aboutContent.founderTagline}</div>
                <div className="founder-backdrop-frame"></div>
                <div className="founder-img-wrapper">
                  <img src={aboutContent.founderImg} alt={aboutContent.founderImgAlt || "Pavithra — Founder & Director"} />
                </div>
              </div>
            </div>

            <div className="founder-content-col">
              <span className="subtitle-accent">MEET THE FOUNDER</span>
              <h2 className="founder-main-title">{aboutContent.founderName || "Pavithra Arun Kumar"}</h2>
              <p className="founder-sub-headline">{aboutContent.founderSub || "Founder & Lead Visual Storyteller"}</p>

              <h3 className="founder-quote">
                "{aboutContent.founderQuote || 'Every journey begins with a single moment of passion. Mine began with a phone camera.'}"
              </h3>

              <div className="founder-bio">
                <p className="bio-paragraph dropcap-para">
                  {aboutContent.founderBio1}
                </p>
                <p className="bio-paragraph">
                  {aboutContent.founderBio2}
                </p>
                {aboutContent.founderBio3 && (
                  <p className="bio-paragraph highlight-purpose">
                    {aboutContent.founderBio3}
                  </p>
                )}
                {aboutContent.founderBio4 && (
                  <p className="bio-paragraph">
                    {aboutContent.founderBio4}
                  </p>
                )}
              </div>

              <div className="founder-pillars">
                <div className="pillar-item">
                  <span className="pillar-num">01 /</span>
                  <div className="pillar-info">
                    <span className="pillar-title">{aboutContent.pillar1Title}</span>
                    <span className="pillar-desc">{aboutContent.pillar1Desc}</span>
                  </div>
                </div>
                <div className="pillar-item">
                  <span className="pillar-num">02 /</span>
                  <div className="pillar-info">
                    <span className="pillar-title">{aboutContent.pillar2Title}</span>
                    <span className="pillar-desc">{aboutContent.pillar2Desc}</span>
                  </div>
                </div>
              </div>

              <div className="founder-signature-block">
                <span className="founder-name">{aboutContent.founderName}</span>
                <span className="founder-title">{aboutContent.signatureTitle}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Team / Magazine Spread */}
      <section className="about-hero-spread container section-padding">
        <div className="about-hero-grid">
          <div className="about-hero-text">
            <span className="subtitle-accent">{aboutContent.studioTagline}</span>
            <h2 className="about-main-title">
              <span className="about-title-word">{aboutContent.studioTitleMain} <i>{aboutContent.studioTitleHighlight}</i></span><br/>
              <span className="about-title-word">{aboutContent.studioTitleEnd}</span>
            </h2>
            <p className="about-hero-desc about-title-word">
              {aboutContent.studioDesc}
            </p>
          </div>

          <div className="about-hero-img">
            <div className="about-team-card-container">
              <div className="about-team-vertical-tag">CREATIVE COLLECTIVE // EST. 2018</div>
              <div className="about-team-backdrop"></div>
              <div className="about-img-mask">
                <img src={aboutContent.teamImg} alt={aboutContent.teamImgAlt || "Shoot At Sight Weddings Studio Team"} />
              </div>
            </div>
            <div className="img-caption">{aboutContent.teamCaption}</div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="about-philosophy section-padding container">
        <div className="philosophy-split-grid">

          {/* Left Column: Gorgeous Light-filled Portrait */}
          <div className="philosophy-image-col">
            <div className="philosophy-portrait-wrapper">
              {/* Offset Backdrop Line */}
              <div className="philosophy-portrait-backdrop"></div>

              <div className="philosophy-portrait-mask">
                <img src={aboutContent.philosophyBg} alt={aboutContent.philosophyBgAlt || "Fine art lighting and details"} className="philosophy-portrait-img" />
              </div>

              <div className="philosophy-portrait-tag">{aboutContent.philosophyTagline}</div>
            </div>
          </div>

          {/* Right Column: Highly Highlighted Content Stack */}
          <div className="philosophy-content-col">
            <span className="subtitle-accent">OUR CORE PILLARS</span>
            <h2 className="philosophy-split-title">{aboutContent.philosophyTitleMain} <i>{aboutContent.philosophyTitleHighlight}</i></h2>

            <div className="philosophy-vertical-stack">
              {aboutContent.philosophyPillars && aboutContent.philosophyPillars.map((pillar, idx) => (
                <div key={idx} className="philosophy-stack-item">
                  <span className="philosophy-stack-num">{pillar.num}</span>
                  <div className="philosophy-stack-info">
                    <h3 className="philosophy-stack-title">{pillar.title}</h3>
                    <p className="philosophy-stack-desc">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Signature Closing */}
      <section className="about-signature-editorial section-padding">
        <div className="container text-center">
          <p className="editorial-quote">"{aboutContent.closingQuote}"</p>
          <div className="editorial-signature">{aboutContent.closingSignature}</div>
        </div>
      </section>

    </div>
  );
};

export default About;
