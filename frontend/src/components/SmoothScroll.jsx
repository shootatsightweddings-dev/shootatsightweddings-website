import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = () => {
  const { pathname } = useLocation();
  const lenisRef = useRef(null);

  // 1. Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Auto-recalculate Lenis scroll limits on every ScrollTrigger refresh (image paint, dynamic data updates)
    const handleRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  // 2. Force Lenis unlock/reset on route changes
  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.start(); // Unlock scroll in case a modal left it locked
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // 3. Post-paint refresh: Reset scroll position and recalculate dimensions once the new DOM finishes rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
        lenisRef.current.resize();
      } else {
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default SmoothScroll;
