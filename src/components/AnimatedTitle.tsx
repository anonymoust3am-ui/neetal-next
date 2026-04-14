"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // 🔥 Split text into words + chars
    const split = new SplitType(ref.current, {
      types: "words,chars",
    });

    // 🔥 Animate chars (GSAP style)
    gsap.from(split.chars, {
      y: 60,
      opacity: 0,
      stagger: 0.04,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%", // 👈 when enters viewport
        toggleActions: "play none none none", // only once
      },
    });

    return () => {
      split.revert(); // cleanup
    };
  }, []);

  return (
    <h2 ref={ref} className={className}>
      {text}
    </h2>
  );
}
