"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useGsapFadeUp() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-animate='fade-up']", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope }
  );

  return scope;
}