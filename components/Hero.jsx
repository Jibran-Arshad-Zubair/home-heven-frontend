"use client";

import { memo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

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

  // ── GSAP cursor reveal refs ──────────────────────────────────────────────
  const colorLayerRef = useRef(null);
  const glowRef       = useRef(null);
  // Proxy object — GSAP animates these numeric values directly, no re-renders
  const clipState     = useRef({ x: -9999, y: -9999, r: 0 });
  const idleTimer     = useRef(null);
  // Stores quickTo functions and active tween references between events
  const gsapRefs      = useRef({
    xTo: null,
    yTo: null,
    glowXTo: null,
    glowYTo: null,
    expandTween: null,
    collapseTween: null,
  });

  useEffect(() => {
    const colorEl = colorLayerRef.current;
    const glowEl  = glowRef.current;
    if (!colorEl || !glowEl) return;

    // Skip on touch-only devices — no cursor to track
    if (!window.matchMedia("(hover: hover)").matches) return;

    const state = clipState.current;
    const refs  = gsapRefs.current;

    // Push glow off-screen until first cursor move
    gsap.set(glowEl, { xPercent: -50, yPercent: -50, x: -9999, y: -9999 });

    // Single reusable updater — called by every GSAP onUpdate
    function applyClipPath() {
      colorEl.style.clipPath = `circle(${state.r.toFixed(1)}px at ${state.x.toFixed(1)}px ${state.y.toFixed(1)}px)`;
    }

    // quickTo returns a function you call with the target value — ultra-fast path, no tween object overhead
    refs.xTo = gsap.quickTo(state, "x", {
      duration: 0.38,
      ease: "power3.out",
      onUpdate: applyClipPath,
    });
    refs.yTo = gsap.quickTo(state, "y", {
      duration: 0.38,
      ease: "power3.out",
      onUpdate: applyClipPath,
    });

    // Glow lags further behind for depth — slowest layer
    refs.glowXTo = gsap.quickTo(glowEl, "x", { duration: 1.15, ease: "power2.out" });
    refs.glowYTo = gsap.quickTo(glowEl, "y", { duration: 1.15, ease: "power2.out" });

    return () => {
      gsap.killTweensOf(state);
      gsap.killTweensOf(glowEl);
      clearTimeout(idleTimer.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;

    const refs  = gsapRefs.current;
    const state = clipState.current;

    // Feed new position into quickTo — GSAP blends toward it smoothly
    refs.xTo(x);
    refs.yTo(y);
    refs.glowXTo(x);
    refs.glowYTo(y);

    // If a collapse is in flight, abort it and expand back to full size
    if (refs.collapseTween?.isActive()) {
      refs.collapseTween.kill();
      refs.collapseTween = null;
    }

    // Only launch an expand tween if the circle isn't already fully open
    if (!refs.expandTween?.isActive() && state.r < 578) {
      refs.expandTween = gsap.to(state, {
        r: 580,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          if (colorLayerRef.current) {
            colorLayerRef.current.style.clipPath = `circle(${state.r.toFixed(1)}px at ${state.x.toFixed(1)}px ${state.y.toFixed(1)}px)`;
          }
        },
      });
    }

    // Reset idle collapse timer on every move
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (refs.expandTween?.isActive()) refs.expandTween.kill();
      refs.collapseTween = gsap.to(state, {
        r: 0,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => {
          if (colorLayerRef.current) {
            colorLayerRef.current.style.clipPath = `circle(${state.r.toFixed(1)}px at ${state.x.toFixed(1)}px ${state.y.toFixed(1)}px)`;
          }
        },
      });
    }, 260);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(idleTimer.current);
    const refs  = gsapRefs.current;
    const state = clipState.current;

    if (refs.expandTween?.isActive()) refs.expandTween.kill();
    refs.collapseTween = gsap.to(state, {
      r: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        if (colorLayerRef.current) {
          colorLayerRef.current.style.clipPath = `circle(${state.r.toFixed(1)}px at ${state.x.toFixed(1)}px ${state.y.toFixed(1)}px)`;
        }
      },
    });
  }, []);

  // Track scroll progress across the full 550vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Phase 1: Initial hero content exits (0 → 0.10) ──────────────────────
  const contentY = useTransform(scrollYProgress, [0, 0.12], ["0%", "-28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const contentBlurRaw = useTransform(scrollYProgress, [0, 0.10], [0, 10]);
  const contentFilter  = useTransform(
    contentBlurRaw,
    (v) => `blur(${v.toFixed(2)}px)`
  );

  // Scroll indicator fades before content
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  // ── Phase 2: Drone zoom-out — continuous across the full scroll ──────────
  const imageScale = useTransform(scrollYProgress, [0, 0.88], [1.9, 1.0]);

  // ── Phase 3: OverlayContent — fade in, hold, fade out ───────────────────
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0.26, 0.36, 0.44, 0.52],
    [0, 1, 1, 0]
  );
  const overlayY = useTransform(scrollYProgress, [0.26, 0.36], ["24px", "0px"]);

  // ── Phase 4: Bottom-center text — fade in, hold, fade out ───────────────
  const text1Opacity = useTransform(
    scrollYProgress,
    [0.54, 0.62, 0.68, 0.75],
    [0, 1, 1, 0]
  );
  const text1Y = useTransform(scrollYProgress, [0.54, 0.63], ["22px", "0px"]);

  // ── Phase 5: "Experience Méchante Cabane" — fade in, hold, fade out ─────
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.77, 0.85, 0.90, 0.96],
    [0, 1, 1, 0]
  );
  const text2Y = useTransform(scrollYProgress, [0.77, 0.85], ["22px", "0px"]);

  return (
    // 550vh — generous room for all 5 animation phases
    <section ref={containerRef} className="relative" style={{ height: "550vh" }}>
      {/* Sticky viewport — fixed while scrolling through the section */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden grain-overlay"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* ── Layer 1 (bottom): B&W image — always visible ── */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imageScale }}
        >
          <Image
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2560&auto=format&fit=crop"
            alt="Aerial drone view zooming out from a cabin retreat to reveal the full surrounding landscape"
            fill
            sizes="100vw"
            className="object-cover object-center grayscale"
            priority
          />
        </motion.div>

        {/* ── Layer 2: full-color image — GSAP drives clip-path reveal ── */}
        <motion.div
          ref={colorLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{
            scale: imageScale,
            // Initial clip-path keeps layer invisible; GSAP takes over after mount
            clipPath: "circle(0px at -9999px -9999px)",
            willChange: "clip-path, transform",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2560&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* ── Glow trail: GSAP drives position — lags behind clip circle ── */}
        <div
          ref={glowRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 380,
            height: 380,
            left: 0,
            top: 0,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 45%, transparent 70%)",
            filter: "blur(18px)",
            zIndex: 1,
            willChange: "transform",
          }}
        />

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
