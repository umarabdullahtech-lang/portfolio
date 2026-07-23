"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function MotionSystem() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const distance = Number(element.dataset.parallax || -10);
        gsap.to(element, {
          yPercent: distance,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        });
      });

      const marquee = document.querySelector<HTMLElement>(".marquee-track");
      if (marquee) {
        const marqueeTween = gsap.to(marquee, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate(self) {
            const velocityBoost = 1 + Math.min(Math.abs(self.getVelocity()) / 1400, 2.4);
            gsap.to(marqueeTween, {
              timeScale: velocityBoost,
              duration: 0.15,
              overwrite: true,
            });
            gsap.to(marqueeTween, {
              timeScale: 1,
              duration: 0.8,
              delay: 0.12,
              overwrite: true,
            });
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-scrub-text] span").forEach((word, index, words) => {
        gsap.fromTo(
          word,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: word.parentElement,
              start: `top ${76 - (index / Math.max(words.length, 1)) * 18}%`,
              end: `top ${54 - (index / Math.max(words.length, 1)) * 18}%`,
              scrub: true,
            },
          }
        );
      });

      const desktopMotion = gsap.matchMedia();
      desktopMotion.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stack-card]").forEach((card) => {
          gsap.to(card, {
            scale: 0.955,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 18%",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    });

    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return null;
}
