"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const AntlerIcon = memo(function AntlerIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 52 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 38 L26 26 L18 14 L14 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14 L8 20"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M22 20 L14 24"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 26 L34 14 L38 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 14 L44 20"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M30 20 L38 24"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
});


const OverlayContent = memo(function OverlayContent({ opacity, y }) {
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute top-32 left-1/2 z-3 max-w-sm md:max-w-md lg:max-w-lg"
    >
      <p 
        className="text-white/95 leading-relaxed"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
          fontWeight: 500,
          letterSpacing: "0.02em",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          marginLeft: "2rem", 
          textAlign: "left"
        }}
      >
        Méchante Cabane is a luxury short-term retreat set within an expansive
        private natural domain in Canada. Designed with a strong architectural
        identity, the property blends contemporary living with the raw beauty of
        its surroundings.
      </p>
    </motion.div>
  );
});

function Hero() {
  const containerRef = useRef(null);

  // Track scroll progress across the entire scroll container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Phase 1: Content exits (0 → 0.32) ---
  const contentY = useTransform(scrollYProgress, [0, 0.32], ["0%", "-28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const contentBlurRaw = useTransform(scrollYProgress, [0, 0.28], [0, 10]);
  const contentFilter = useTransform(
    contentBlurRaw,
    (v) => `blur(${v.toFixed(2)}px)`
  );

  // Scroll indicator matches content fade
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // --- Phase 2: Image scale — zoom OUT effect (0.28 → 0.62) ---
  const imageScale = useTransform(scrollYProgress, [0.28, 0.62], [1.05, 0.88]);

  // --- Phase 3: Overlay content appears bottom-left (0.6 → 0.82) ---
  const overlayOpacity = useTransform(scrollYProgress, [0.6, 0.82], [0, 1]);
  const overlayY = useTransform(scrollYProgress, [0.6, 0.82], ["24px", "0px"]);

  return (
    // Tall scroll container — 280vh gives comfortable scroll pacing
    <section ref={containerRef} className="relative" style={{ height: "280vh" }}>
      {/* Sticky viewport — stays fixed while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grain-overlay">
        {/* Background image — scales on scroll for zoom-out effect */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imageScale }}
        >
          <Image
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2560&auto=format&fit=crop"
            alt="Aerial view of a peaceful cabin retreat surrounded by forest"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60 z-1" />
        <div className="absolute inset-0 bg-black/25 z-1" />

        {/* Hero content — moves up + fades + blurs on scroll */}
        <motion.div
          className="relative z-2 flex flex-col items-center justify-center h-full px-4 text-center will-change-transform"
          style={{
            y: contentY,
            opacity: contentOpacity,
            filter: contentFilter,
          }}
        >
          {/* Title */}
          <h1
            className="text-white uppercase leading-none tracking-[0.08em] mb-36 select-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 300,
              textShadow:
                "0 0 80px rgba(0,0,0,0.3), 0 2px 40px rgba(0,0,0,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            Méchante Cabane
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/85 text-center max-w-lg md:max-w-xl leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
              fontWeight: 300,
              letterSpacing: "0.03em",
            }}
          >
            A peaceful retreat surrounded by changing landscapes &mdash; from
            warm autumn tones to serene winter silences.
          </p>

          {/* CTA Link */}
          <Link
            href="#explore"
            className="group flex items-center gap-3 text-white/90 hover:text-white transition-colors duration-300"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            <span className="w-8 h-px bg-white/60 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
            Explore the Cabin
            <span className="w-8 h-px bg-white/60 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Scroll Down Indicator — fades with content */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-2 flex flex-col items-center gap-3"
          style={{ opacity: indicatorOpacity }}
        >
          <Link
            href="#explore"
            className="relative flex flex-col items-center gap-2 group"
            aria-label="Scroll down"
          >
            <div className="relative pulse-ring">
              <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:bg-white/10 transition-colors duration-300">
                <AntlerIcon size={26} />
              </div>
            </div>
            <span
              className="text-white/70 group-hover:text-white transition-colors duration-300"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Scroll Down
            </span>
          </Link>
        </motion.div>

        {/* Phase 3 — Overlay content, bottom-left */}
        <OverlayContent opacity={overlayOpacity} y={overlayY} />
      </div>
    </section>
  );
}

export default memo(Hero);
