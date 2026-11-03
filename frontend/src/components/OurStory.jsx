import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/siteConfigState';
import './OurStory.css';

gsap.registerPlugin(ScrollTrigger);

const OurStory = () => {
  const containerRef = useRef(null);
  const { config } = useSiteConfig();

  const storyContent = config?.about_philosophy || {
    tagline: '01 // OUR PHILOSOPHY',
    titleMain: 'The Art',
    titleHighlight: 'Observing',
    pLead: 'We approach each wedding not as a checklist, but as a living, breathing narrative. Our lenses are drawn to the quiet glances, the unscripted laughter, and the fleeting tears.',
    pBody: "We believe the most profound moments aren't the ones directed, but the ones discovered. Our approach is quiet, immersive, and deeply intentional.",
    stat1Num: '250+',
    stat1Label: 'Weddings Covered',
    stat2Num: '15+',
    stat2Label: 'Cities Covered',
    img1: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/SYD08443%20(3).jpg.webp',
    img2: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/DSC_0347-_2_.jpg.webp',
    img3: 'https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/shoot-sight-latest-images/NGD_5981-_1_.jpg.webp'
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for images
      gsap.to(".story-img-wrapper.type-1 img", {
        scale: 1.1,
        y: -30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".story-img-wrapper.type-2", {
        y: -100,
        x: -20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".story-img-wrapper.type-3", {
        y: -60,
        x: -20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4
        }
      });

      // Text reveal
      gsap.from(".story-content-new > *", {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="boutique-story-section">
      <div className="container">
        <div className="story-grid-new">

          {/* VISUALS NOW ON THE LEFT */}
          <div className="story-visuals-new">
            <div className="story-img-wrapper type-1">
              <img src={storyContent.img1} alt={storyContent.img1Alt || "Wedding portrait"} />
            </div>
            <div className="story-img-wrapper type-2">
              <img src={storyContent.img2} alt={storyContent.img2Alt || "Wedding celebration details"} />
            </div>
            <div className="story-img-wrapper type-3">
              <img src={storyContent.img3} alt={storyContent.img3Alt || "Candid wedding moment"} loading="lazy" decoding="async" />
            </div>
          </div>

          {/* CONTENT NOW ON THE RIGHT */}
          <div className="story-content-new">
            <div className="vertical-label">{storyContent.tagline}</div>
            <h1 className="section-title-large" style={{ marginBottom: '40px' }}>
              {storyContent.titleMain} <br />of <i>{storyContent.titleHighlight}</i>
            </h1>
            <p className="story-p-lead">
              {storyContent.pLead}
            </p>
            <p className="story-p-new">
              {storyContent.pBody}
            </p>

            <div className="story-stats-row">
              <div className="stat-item">
                <span className="stat-num">{storyContent.stat1Num}</span>
                <span className="stat-label">{storyContent.stat1Label}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{storyContent.stat2Num}</span>
                <span className="stat-label">{storyContent.stat2Label}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurStory;
