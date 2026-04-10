"use client";

import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ── Label style — matches ScrollStory prefixStyle exactly ─────────────────────
const labelStyle = {
  fontFamily: "var(--font-inter)",
  fontSize: "0.58rem",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.42)",
  display: "block",
  marginBottom: "1.1rem",
};

// ── Heading style — matches ScrollStory wordStyle ─────────────────────────────
const headingStyle = {
  fontFamily: "var(--font-cormorant)",
  fontSize: "clamp(2.8rem, 6vw, 7.5rem)",
  fontWeight: 300,
  color: "white",
  letterSpacing: "0.03em",
  lineHeight: 1.08,
  textAlign: "center",
};

// ── Main Component ────────────────────────────────────────────────────────────
function VideoSection() {
  const sectionRef = useRef(null);

  // Trigger once when 15% of section enters the viewport
  const isInView = useInView(sectionRef, { amount: 0.15, once: true });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* ── Fade-in wrapper — entire section fades in on scroll ────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Background video ─────────────────────────────────────────────── */}
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        >
          {/* Aerial forest / mountain travel footage — Pexels free stock */}
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* ── Overlays ─────────────────────────────────────────────────────── */}

        {/* Base dark film — keeps video cinematic */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />

        {/* Top vignette — blends seamlessly with ScrollStory above */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "22vh",
            background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          }}
        />

        {/* Bottom vignette — blends into whatever follows */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "22vh",
            background: "linear-gradient(to top, #000 0%, transparent 100%)",
          }}
        />

        {/* ── Center text overlay ──────────────────────────────────────────── */}
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

        {/* ── Corner markers — consistent with ScrollStory ─────────────────── */}
        <span className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/20 pointer-events-none" />
        <span className="absolute top-6 right-6 w-5 h-5 border-t border-r border-white/20 pointer-events-none" />
        <span className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-white/20 pointer-events-none" />
        <span className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/20 pointer-events-none" />

        {/* ── Bottom-left label — consistent with ScrollStory ─────────────── */}
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

      </motion.div>
    </section>
  );
}

export default memo(VideoSection);
