import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteConfig } from "../context/siteConfigState";
import "./Hero.css";
import { DEFAULT_MOBILE_VIDEO_URL } from "../data/videoDefaults";

gsap.registerPlugin(ScrollTrigger);

const HERO_POSTER = "/NAVEEN%20AND%20KATE/SYD08467.webp";

const Hero = () => {
  const containerRef = useRef(null);
  const { config } = useSiteConfig();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );

  const heroContent = config?.hero || {
    videoUrl: "/Naveen%20%26%20Kate%204K%20Teaser.mp4"
  };

  const videoUrl = /^https:\/\//.test(heroContent.videoUrl || '') ? heroContent.videoUrl : "/Naveen%20%26%20Kate%204K%20Teaser.mp4";

  // Set scroll restoration and reset scroll position early
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => {
      clearTimeout(refreshTimer);
    };
  }, []);

  // Ship one hero video, not two: only the viewport-appropriate <video> is
  // ever mounted, so the browser only ever fetches one media file.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const mobileVideoUrl = heroContent.mobileVideoUrl || DEFAULT_MOBILE_VIDEO_URL;

  return (
    <section ref={containerRef} className="hero-full">
      <div className="hero-video-container">

        {isMobile ? (
          <video
            key="mobile"
            src={mobileVideoUrl}
            poster={HERO_POSTER}
            preload="none"
            autoPlay
            loop
            muted
            playsInline
            className="hero-mobile-video"
          />
        ) : (
          <div className="hero-desktop-video">
            <video
              key="desktop"
              src={videoUrl}
              poster={HERO_POSTER}
              preload="none"
              autoPlay
              loop
              muted
              playsInline
              className="hero-html-video"
            />
          </div>
        )}

        <div className="hero-video-blocker" />

      </div>
    </section>
  );
};

export default Hero;
