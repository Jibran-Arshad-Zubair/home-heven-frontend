"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ── Data ───────────────────────────────────────────────────────────────────────
const SCROLL_STEPS = [
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
    word: "Disappear",
  },
  {
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop",
    word: "Breathe",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    word: "Rest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
    word: "Wander",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    word: "Reconnect",
  },
  {
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1600&auto=format&fit=crop",
    word: "Dream",
  },
];

const STICKY_IMAGE =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600&auto=format&fit=crop";

// ── Shared text styles ─────────────────────────────────────────────────────────
const wordStyle = {
  fontFamily: "var(--font-satoshi)",
  fontSize: "clamp(3rem, 6.5vw, 8.5rem)",
  fontWeight: 300,
  color: "white",
  letterSpacing: "0.03em",
  lineHeight: 1.05,
};

const prefixStyle = {
  fontFamily: "var(--font-inter)",
  fontSize: "0.58rem",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.32)",
  marginBottom: "0.85rem",
  display: "block",
};

// ── Camera-viewfinder corner markers ──────────────────────────────────────────
const CornerMarkers = memo(function CornerMarkers() {
  return (
    <>
      <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/20 pointer-events-none" />
      <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/20 pointer-events-none" />
      <span className="absolute bottom-10 left-3 w-5 h-5 border-b border-l border-white/20 pointer-events-none" />
      <span className="absolute bottom-10 right-3 w-5 h-5 border-b border-r border-white/20 pointer-events-none" />
      <p
        className="absolute bottom-5 left-5 pointer-events-none"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.48rem",
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.38)",
        }}
      >
        Explore The Cabin
      </p>
    </>
  );
});

// ── Reusable image panel ──────────────────────────────────────────────────────
const ImagePanel = memo(function ImagePanel({ image, word, fromLeft, isInView }) {
  return (
    <motion.div
      className="w-full md:w-1/2 flex items-center shrink-0"
      style={{
        paddingTop: "clamp(2.5rem, 4vh, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vh, 4rem)",
        paddingLeft: fromLeft ? "clamp(2rem, 5vw, 6rem)" : "clamp(1rem, 2vw, 2rem)",
        paddingRight: fromLeft ? "clamp(1rem, 2vw, 2rem)" : "clamp(2rem, 5vw, 6rem)",
      }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : (fromLeft ? -50 : 50) }}
      initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative w-full overflow-hidden rounded-xl" style={{ height: "clamp(50vh, 72vh, 78vh)" }}>
        <Image
          src={image}
          alt={word}
          fill
          sizes="(max-width: 768px) 95vw, 50vw"
          className="object-cover"
        />
        <CornerMarkers />
      </div>
    </motion.div>
  );
});

// ── Reusable text panel ───────────────────────────────────────────────────────
const TextPanel = memo(function TextPanel({ word, fromLeft, isInView, delay = 0 }) {
  return (
    <motion.div
      className="w-full md:w-1/2 flex flex-col items-center md:items-start"
      style={{
        // "slightly above center" — push content down by ~22vh so it sits in the upper-middle
        paddingTop: "clamp(18vh, 22vh, 26vh)",
        paddingLeft: !fromLeft
          ? "clamp(2rem, 5vw, 6rem)"
          : "clamp(1.5rem, 3vw, 4rem)",
        paddingRight: !fromLeft
          ? "clamp(1.5rem, 3vw, 4rem)"
          : "clamp(2rem, 5vw, 6rem)",
      }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : (fromLeft ? -50 : 50) }}
      initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span style={prefixStyle}>A place to</span>
      <h2 style={wordStyle}>{word}</h2>
    </motion.div>
  );
});

// ── Individual scroll step with alternating layout ────────────────────────────
const StepItem = memo(function StepItem({ image, word, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  // Even index (0,2,4) → image LEFT, text RIGHT
  // Odd index  (1,3,5) → text LEFT, image RIGHT
  const imageOnLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="h-screen flex flex-col md:flex-row overflow-hidden"
    >
      {imageOnLeft ? (
        <>
          <ImagePanel image={image} word={word} fromLeft isInView={isInView} />
          <TextPanel word={word} fromLeft={false} isInView={isInView} delay={0.09} />
        </>
      ) : (
        <>
          <TextPanel word={word} fromLeft isInView={isInView} delay={0} />
          <ImagePanel image={image} word={word} fromLeft={false} isInView={isInView} />
        </>
      )}
    </div>
  );
});

// ── Step 7: Sticky image (left) + FOR → EVERY → GENERATION on right ───────────
const StickyStep = memo(function StickyStep() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // FOR  — fade in [0.00 → 0.08], hold [0.08 → 0.27], rise + fade [0.27 → 0.36]
  const forOpacity = useTransform(scrollYProgress, [0.0, 0.08, 0.27, 0.36], [0, 1, 1, 0]);
  const forY = useTransform(scrollYProgress, [0.0, 0.08, 0.27, 0.36], ["32px", "0px", "0px", "-52px"]);

  // EVERY — fade in [0.36 → 0.46], hold [0.46 → 0.63], rise + fade [0.63 → 0.72]
  const everyOpacity = useTransform(scrollYProgress, [0.36, 0.46, 0.63, 0.72], [0, 1, 1, 0]);
  const everyY = useTransform(scrollYProgress, [0.36, 0.46, 0.63, 0.72], ["32px", "0px", "0px", "-52px"]);

  // GENERATION — fade in [0.72 → 0.84], hold [0.84 → 1.0]
  const generationOpacity = useTransform(scrollYProgress, [0.72, 0.84, 1.0], [0, 1, 1]);
  const generationY = useTransform(scrollYProgress, [0.72, 0.84, 1.0], ["32px", "0px", "0px"]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen flex flex-col md:flex-row overflow-hidden">

        {/* Left: sticky image — enters once, stays fixed */}
        <motion.div
          className="w-full md:w-1/2 flex items-center shrink-0"
          style={{
            paddingTop: "clamp(2.5rem, 4vh, 4rem)",
            paddingBottom: "clamp(2.5rem, 4vh, 4rem)",
            paddingLeft: "clamp(2rem, 5vw, 6rem)",
            paddingRight: "clamp(1rem, 2vw, 2rem)",
          }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl"
            style={{ height: "clamp(50vh, 72vh, 78vh)" }}
          >
            <Image
              src={STICKY_IMAGE}
              alt="A place for every generation"
              fill
              sizes="(max-width: 768px) 95vw, 50vw"
              className="object-cover"
            />
            <CornerMarkers />
          </div>
        </motion.div>

        {/* Right: cycling word transitions */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center md:items-start relative"
          style={{
            paddingTop: "clamp(18vh, 22vh, 26vh)",
            paddingLeft: "clamp(1.5rem, 3vw, 4rem)",
            paddingRight: "clamp(2rem, 5vw, 6rem)",
          }}
        >
          <span style={prefixStyle}>A place to</span>

          {/* Word slot — all three words occupy the same position */}
          <div className="relative" style={{ height: "clamp(4rem, 10vh, 10rem)", width: "100%" }}>
            <motion.h2
              style={{ ...wordStyle, opacity: forOpacity, y: forY, position: "absolute", top: 0, left: 0 }}
            >
              For
            </motion.h2>
            <motion.h2
              style={{ ...wordStyle, opacity: everyOpacity, y: everyY, position: "absolute", top: 0, left: 0 }}
            >
              Every
            </motion.h2>
            <motion.h2
              style={{ ...wordStyle, opacity: generationOpacity, y: generationY, position: "absolute", top: 0, left: 0 }}
            >
              Generation
            </motion.h2>
          </div>
        </div>

      </div>
    </div>
  );
});

// ── Main export ────────────────────────────────────────────────────────────────
function ScrollStory() {
  return (
    <section className="bg-black">
      {SCROLL_STEPS.map((step, i) => (
        <StepItem key={step.word} image={step.image} word={step.word} index={i} />
      ))}
      <StickyStep />
    </section>
  );
}

export default memo(ScrollStory);
