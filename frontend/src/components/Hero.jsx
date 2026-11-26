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
  const videoRef = useRef(null);
  const { config } = useSiteConfig();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );

  const heroContent = config?.hero || {
    videoUrl: "/Naveen%20%26%20Kate%204K%20Teaser.mp4"
  };

  const videoUrl = /^(https:\/\/|\/(?!\/))/.test(heroContent.videoUrl || '') ? heroContent.videoUrl : "/Naveen%20%26%20Kate%204K%20Teaser.mp4";

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

  // The build-time prerender (a headless browser at desktop width) snapshots
  // this page. Leave the video address out of that snapshot: otherwise phones
  // start downloading the 23 MB desktop teaser from the static HTML before
  // the app swaps in the mobile reel.
  const renderVideoSrc = typeof window === "undefined" || !window.__PRERENDER__;

  // iPhone Safari only autoplays a video it knows is muted and inline. React
  // sets `muted` as a property, not an attribute, so set both and start
  // playback ourselves. If the phone still refuses (e.g. Low Power Mode),
  // start on the first touch or scroll instead of leaving a still poster.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !renderVideoSrc) return undefined;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const events = ["touchstart", "scroll", "click"];
    const onGesture = () => {
      tryPlay();
      if (!v.paused) events.forEach((e) => window.removeEventListener(e, onGesture));
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => {
      v.removeEventListener("canplay", tryPlay);
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };
  }, [isMobile, mobileVideoUrl, videoUrl, renderVideoSrc]);

  return (
    <section ref={containerRef} className="hero-full">
      <div className="hero-video-container">

        {isMobile ? (
          <video
            key="mobile"
            ref={videoRef}
            src={renderVideoSrc ? mobileVideoUrl : undefined}
            poster={HERO_POSTER}
            preload="auto"
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
              ref={videoRef}
              src={renderVideoSrc ? videoUrl : undefined}
              poster={HERO_POSTER}
              preload="auto"
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
