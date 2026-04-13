"use client";

import { memo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── AntlerIcon (unchanged) ──────────────────────────────────────────────────
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
      <path d="M18 14 L8 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 20 L14 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M26 26 L34 14 L38 4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M34 14 L44 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 20 L38 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
});

// ─── OverlayContent (existing — behavior preserved) ──────────────────────────
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
          textAlign: "left",
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

// ─── Phase 3: Bottom-center text (3 lines) ───────────────────────────────────
const BottomCenterText = memo(function BottomCenterText({ opacity, y }) {
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-16 left-0 right-0 z-3 flex flex-col items-center text-center px-6 pointer-events-none"
    >
      <div
        style={{
          width: "2rem",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.35)",
          marginBottom: "1.25rem",
        }}
      />
      <p
        className="text-white/85"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
          fontWeight: 300,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          textShadow: "0 2px 24px rgba(0,0,0,0.55)",
          lineHeight: 2.4,
        }}
      >
        Nestled between ancient forests and open skies
        <br />
        A sanctuary where silence becomes a luxury
        <br />
        Where every season tells a different story
      </p>
    </motion.div>
  );
});

// ─── Phase 4: Center text — "Experience Méchante Cabane" ─────────────────────
const ExperienceText = memo(function ExperienceText({ opacity, y }) {
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 z-3 flex items-center justify-center pointer-events-none"
    >
      {/* Offset slightly below vertical center */}
      <div className="text-center mt-20">
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(0.55rem, 0.9vw, 0.7rem)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1.1rem",
          }}
        >
          Discover
        </p>
        <h2
          style={{
            fontFamily: "var(--font-satoshi)",
            fontSize: "clamp(2rem, 5.5vw, 5rem)",
            fontWeight: 300,
            letterSpacing: "0.06em",
            color: "white",
            textShadow:
              "0 0 80px rgba(0,0,0,0.35), 0 2px 40px rgba(0,0,0,0.25)",
            lineHeight: 1.1,
          }}
        >
          Experience Méchante Cabane
        </h2>
        <div
          style={{
            width: "3rem",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.35)",
            margin: "1.75rem auto 0",
          }}
        />
      </div>
    </motion.div>
  );
});

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const containerRef = useRef(null);
  const bwLayerRef    = useRef(null);
  const rafRef        = useRef(null);   // throttle move updates
  const fadeRafRef    = useRef(null);   // fade-back animation loop
  const mousePosRef   = useRef({ x: -9999, y: -9999 });
  const strengthRef   = useRef(0);      // 0 = full B&W, 1 = full color reveal

  // ── Writes the radial mask at the given cursor position & reveal strength ──
  const applyMask = useCallback((x, y, strength) => {
    if (!bwLayerRef.current) return;
    if (strength <= 0.005) {
      // Fully hidden — remove mask entirely (clean full B&W)
      bwLayerRef.current.style.webkitMaskImage = "";
      bwLayerRef.current.style.maskImage = "";
      return;
    }
    // Center is fully transparent (color shows), edges are black (B&W shows).
    // Interpolate center & mid-stop alpha by strength so fade-back animates smoothly.
    const c  = (1 - strength).toFixed(4);              // center  transparent → black
    const m  = (1 - strength * 0.42).toFixed(4);       // mid-ring soft shoulder
    const mask = [
      `radial-gradient(circle 320px at ${x}px ${y}px,`,
      ` rgba(0,0,0,${c})  0%,`,
      ` rgba(0,0,0,${c}) 28%,`,   // wide flat core
      ` rgba(0,0,0,${m}) 62%,`,   // soft feathered shoulder
      ` black             88%,`,
      ` black            100%)`,
    ].join("");
    bwLayerRef.current.style.webkitMaskImage = mask;
    bwLayerRef.current.style.maskImage = mask;
  }, []);

  // ── Mouse move: reveal instantly, cancel any ongoing fade-back ───────────
  const handleMouseMove = useCallback((e) => {
    // Cancel fade-back if cursor re-enters
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    strengthRef.current = 1;
    if (rafRef.current) return;                        // already a frame queued
    rafRef.current = requestAnimationFrame(() => {
      applyMask(mousePosRef.current.x, mousePosRef.current.y, 1);
      rafRef.current = null;
    });
  }, [applyMask]);

  // ── Mouse leave: animate reveal strength 1 → 0 with ease-out cubic ───────
  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const DURATION   = 750;          // ms for full fade-back
    const startPower = strengthRef.current;
    const lastX      = mousePosRef.current.x;
    const lastY      = mousePosRef.current.y;
    const startTime  = performance.now();

    const tick = (now) => {
      const t       = Math.min((now - startTime) / DURATION, 1);
      const eased   = 1 - Math.pow(1 - t, 3);         // ease-out cubic
      const current = startPower * (1 - eased);
      strengthRef.current = current;
      applyMask(lastX, lastY, current);
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  }, [applyMask]);

  // Track scroll progress across the full 550vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Phase 1: Initial hero content exits (0 → 0.10) ──────────────────────
  const contentY = useTransform(scrollYProgress, [0, 0.12], ["0%", "-28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const contentBlurRaw = useTransform(scrollYProgress, [0, 0.10], [0, 10]);
  const contentFilter = useTransform(
    contentBlurRaw,
    (v) => `blur(${v.toFixed(2)}px)`
  );

  // Scroll indicator fades before content
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  // ── Phase 2: Drone zoom-out — continuous across the full scroll ──────────
  // Scale 1.9 (tight close-up) → 1.0 (full landscape visible)
  const imageScale = useTransform(scrollYProgress, [0, 0.88], [1.9, 1.0]);

  // ── Phase 3: OverlayContent — fade in, hold, fade out ───────────────────
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.26, 0.36, 0.44, 0.52],
    [0, 1, 1, 0]
  );
  const overlayY = useTransform(
    scrollYProgress,
    [0.26, 0.36],
    ["24px", "0px"]
  );

  // ── Phase 4: Bottom-center text — fade in, hold, fade out ───────────────
  const text1Opacity = useTransform(
    scrollYProgress,
    [0.54, 0.62, 0.68, 0.75],
    [0, 1, 1, 0]
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0.54, 0.63],
    ["22px", "0px"]
  );

  // ── Phase 5: "Experience Méchante Cabane" — fade in, hold, fade out ─────
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.77, 0.85, 0.90, 0.96],
    [0, 1, 1, 0]
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.77, 0.85],
    ["22px", "0px"]
  );

  return (
    // 550vh — generous room for all 5 animation phases
    <section ref={containerRef} className="relative" style={{ height: "550vh" }}>
      {/* Sticky viewport — fixed while scrolling through the section */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden grain-overlay"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* ── Background image: continuous drone zoom-out ── */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imageScale }}
        >
          <Image
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2560&auto=format&fit=crop"
            alt="Aerial drone view zooming out from a cabin retreat to reveal the full surrounding landscape"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* ── B&W layer: same zoom, masked by cursor to reveal color below ── */}
        <motion.div
          ref={bwLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{ scale: imageScale }}
        >
          <Image
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2560&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-center grayscale"
          />
        </motion.div>

        {/* Gradient overlays (unchanged) */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60 z-1" />
        <div className="absolute inset-0 bg-black/25 z-1" />

{/* ── Phase 1: Hero content (title / subtitle / CTA) ── */}
        <motion.div
          className="relative z-2 flex flex-col items-center justify-center h-full px-4 text-center will-change-transform"
          style={{
            y: contentY,
            opacity: contentOpacity,
            filter: contentFilter,
          }}
        >
          <h1
            className="text-white uppercase leading-none tracking-[0.08em] mb-36 select-none"
            style={{
              fontFamily: "var(--font-satoshi)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 300,
              textShadow:
                "0 0 80px rgba(0,0,0,0.3), 0 2px 40px rgba(0,0,0,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            Méchante Cabane
          </h1>

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

        {/* ── Scroll indicator (fades early, unchanged) ── */}
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

        {/* ── Phase 3: OverlayContent description (existing, now with fade-out) ── */}
        <OverlayContent opacity={overlayOpacity} y={overlayY} />

        {/* ── Phase 4: Bottom-center 3-line text ── */}
        <BottomCenterText opacity={text1Opacity} y={text1Y} />

        {/* ── Phase 5: "Experience Méchante Cabane" center text ── */}
        <ExperienceText opacity={text2Opacity} y={text2Y} />
      </div>
    </section>
  );
}

export default memo(Hero);
