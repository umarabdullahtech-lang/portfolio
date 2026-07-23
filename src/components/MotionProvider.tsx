"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const eligible = window.matchMedia("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!eligible.matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      overscroll: false,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", updateScrollTrigger);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
