"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ── Reveal image shown behind the curtain ─────────────────────────────────────
const REVEAL_IMAGE =
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2400&auto=format&fit=crop";

// ── Shared text styles — identical to ScrollStory ─────────────────────────────
const labelStyle = {
  fontFamily: "var(--font-inter)",
  fontSize: "0.58rem",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.42)",
  display: "block",
  marginBottom: "1.1rem",
};

const headingStyle = {
  fontFamily: "var(--font-cormorant)",
  fontSize: "clamp(2.8rem, 6vw, 7.5rem)",
  fontWeight: 300,
  color: "white",
  letterSpacing: "0.03em",
  lineHeight: 1.08,
  textAlign: "center",
};

// ── Corner markers — consistent with ScrollStory ──────────────────────────────
const CurtainCorners = memo(function CurtainCorners() {
  return (
    <>
      <span className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/20 pointer-events-none" />
      <span className="absolute top-6 right-6 w-5 h-5 border-t border-r border-white/20 pointer-events-none" />
      <span className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-white/20 pointer-events-none" />
      <span className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/20 pointer-events-none" />
      <p
        className="absolute bottom-8 left-8 pointer-events-none"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.48rem",
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.32)",
        }}
      >
        Méchante Cabane
      </p>
    </>
  );
});

// ── Main Component ────────────────────────────────────────────────────────────
function VideoSection() {
  // Single ref drives both useInView (entrance) and useScroll (curtain)
  const containerRef = useRef(null);

  // Fade-in on first entry — fires once when section reaches 12% in viewport
  const isInView = useInView(containerRef, { amount: 0.12, once: true });

  // Scroll progress through the full 200vh canvas
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Curtain: video slides from its natural position up by 100vh ───────────
  // scrollYProgress 0 → 1  maps to  translateY 0% → -100%
  const curtainY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  // ── Reveal image: subtle zoom-out as it's uncovered (feels alive) ─────────
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.07, 1.0]);

  return (
    // 200vh canvas — first 100vh the video is static, second 100vh curtain rises
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{ height: "200vh" }}
    >
      {/* ── Sticky viewport — locked to screen for the full 200vh scroll ──── */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >

        {/* ════════════════════════════════════════════════════════════════════
            LAYER 0 — Reveal image (always behind the curtain, z-index auto)
            Scales subtly from 1.07 → 1.0 as it's uncovered, giving depth
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale }}
        >
          <Image
            src={REVEAL_IMAGE}
            alt="Méchante Cabane — The Retreat"
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />

          {/* Subtle dark film over the reveal image */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.35)" }}
          />

          {/* Bottom gradient — blends into whatever section follows */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "22vh",
              background: "linear-gradient(to top, #000 0%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            LAYER 1 — Video curtain
            - Fades in on entrance (isInView)
            - Translates upward via curtainY as user scrolls
            - overflow:hidden on parent clips it cleanly as it exits
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0"
          style={{
            y: curtainY,
            zIndex: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background video — autoplay, loop, muted, no controls */}
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
          >
            {/* Aerial mountain travel footage — Pexels free stock */}
            <source
              src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark film over video — keeps it cinematic */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.45)" }}
          />

          {/* Top gradient — blends with ScrollStory above */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "22vh",
              background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
            }}
          />

          {/* Bottom gradient — softens the curtain bottom edge during lift */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "22vh",
              background: "linear-gradient(to top, #000 0%, transparent 100%)",
            }}
          />

          {/* Center text overlay — rises in after video fades in */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 28 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={labelStyle}>The Journey Awaits</span>
            <h2 style={headingStyle}>
              Where Every Path<br />Tells a Story
            </h2>
          </motion.div>

          {/* Corner markers + brand label */}
          <CurtainCorners />

        </motion.div>

      </div>
    </section>
  );
}

export default memo(VideoSection);
