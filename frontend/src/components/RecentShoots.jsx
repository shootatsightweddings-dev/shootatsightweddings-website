import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API_URL } from '../config';
import './RecentShoots.css';






gsap.registerPlugin(ScrollTrigger);

const mockShoots = [
  { id: 'raghudixith-varijashree', title: "Raghu Dixit & Varijashree", cat: "Wedding", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp" },
  { id: 'naveen-kate', title: "Naveen & Kate", cat: "Wedding", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/NAVEEN%20AND%20KATE/SYD08467.webp" },
  { id: 'ragini', title: "Ragini", cat: "Portrait", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/ragini/_I3A6607.webp" },
  { id: 'aishwarya-and-akshay', title: "Aishwarya & Akshay", cat: "Wedding", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/aishwarya%20and%20akshay/KRP_8213.webp" },
  { id: 'srinidhi-and-ramya', title: "Srinidhi & Ramya", cat: "Wedding", img: "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/srinidhi%20and%20ramya/DSC00045.webp" },
];

const RecentShoots = () => {
  const horizontalRef = useRef(null);
  const containerRef = useRef(null);
  // Start with mock data immediately — no blank loading screen
  const [shoots, setShoots] = useState(mockShoots);

  const handleMobileScroll = (direction) => {
    if (horizontalRef.current) {
      const scrollAmount = 290; // item width (260px) + gap (30px)
      if (direction === 'left') {
        horizontalRef.current.scrollLeft -= scrollAmount;
      } else {
        horizontalRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 3 second timeout — if API is slow, we already have mock data showing
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`${API_URL}/shoots`, { signal: controller.signal });
        clearTimeout(timeout);

        const data = await res.json();
        if (res.ok && data.data && data.data.length > 0) {
          const mapped = data.data.map(s => ({
            id: s.slug || s._id,
            title: s.title,
            cat: s.category,
            img: s.heroImage
          }));
          setShoots(mapped); // show ALL clients from DB

          // Recalculate ScrollTrigger parameters on the next tick
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      } catch {
        // Keep showing mock data — already loaded
      }
    };
    loadData();
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Desktop horizontal ScrollTrigger pinning
      const scrollWidth = horizontalRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      const overflow = scrollWidth - windowWidth;

      if (overflow > 0) {
        gsap.to(horizontalRef.current, {
          x: -overflow,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            pinSpacing: true,
            scrub: true, // Synced in real-time with global Lenis scroll
            end: () => "+=" + overflow, // Mathematically precise scroll distance
            invalidateOnRefresh: true, // Dynamically recalibrates coordinates on viewport updates
          }
        });
      } else {
        gsap.set(horizontalRef.current, { x: 0 });
      }
    });

    mm.add("(max-width: 768px)", () => {
      // Clear GSAP translations on mobile to let native CSS horizontal scroll take over
      gsap.set(horizontalRef.current, { x: 0 });
    });

    // Refresh ScrollTrigger after DOM has fully painted the shoots to guarantee exact pixel widths
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      mm.revert();
    };
  }, [shoots]); // Re-run when shoots load to calculate exact dynamic database widths!


  return (
    <section ref={containerRef} className="horizontal-shoots-section">
      <div className="horizontal-header container">
        <span className="subtitle-accent">LATEST WORK</span>
        <h2 className="section-title-large">Recent <i>Captures</i></h2>
      </div>

      <div ref={horizontalRef} className="horizontal-scroll-container">
        {shoots.map((shoot, index) => (
          <Link to={`/shoot/${shoot.id}`} key={index} className="horizontal-item-link">
            <div className="horizontal-item">
              <span className="item-number-overlay">0{index + 1}</span>
              <div className="horizontal-img-wrapper">
                <img src={shoot.img} alt={shoot.title} loading={index < 2 ? 'eager' : 'lazy'} />
                <div className="view-more-hover">
                  <span>EXPLORE</span>
                </div>
              </div>
              <div className="horizontal-item-info">
                <span className="item-cat-new">{shoot.cat}</span>
                <h4 className="item-title-new">{shoot.title}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile navigation arrows */}
      <div className="mobile-scroll-arrows">
        <button onClick={() => handleMobileScroll('left')} aria-label="Scroll left" className="scroll-arrow-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button onClick={() => handleMobileScroll('right')} aria-label="Scroll right" className="scroll-arrow-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default RecentShoots;
