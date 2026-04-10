"use client";

import { memo, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── FAQ Data ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "Where is Méchante Cabane located?",
    answer:
      "Nestled deep within an ancient boreal forest, Méchante Cabane sits at the edge of a glacial lake, hours from the nearest town. Exact coordinates are shared only upon confirmed booking — the journey is part of the ritual.",
  },
  {
    question: "What is included in the retreat experience?",
    answer:
      "Every stay includes full cabin access, a daily guided forest walk at dawn, wood-fired sauna sessions each evening, locally foraged breakfast provisions, and access to the private lakeside dock with canoe.",
  },
  {
    question: "How many guests can the cabin accommodate?",
    answer:
      "The cabin is designed as an intimate retreat for up to four guests. We also offer exclusive sole-occupancy bookings for those who wish to experience the wilderness in complete solitude.",
  },
  {
    question: "What is the best season to visit?",
    answer:
      "Each season reveals a different face of the forest. Summer offers warm evenings and midnight light; autumn transforms the canopy into fire; winter buries everything in silence and snow; spring brings the thaw and the first birdsong. There is no wrong time — only different moods.",
  },
  {
    question: "Is the cabin suitable for disconnecting from technology?",
    answer:
      "Intentionally so. The cabin has no WiFi and limited cell signal. Guests are encouraged to leave devices stored away. We provide a curated library, field notebooks, and star charts for the nights.",
  },
  {
    question: "How do I make a booking or enquiry?",
    answer:
      "Bookings are made directly through our private reservation form, which opens seasonally. Priority access is given to returning guests. Sign up to our mailing list to be notified of upcoming availability windows.",
  },
  {
    question: "Are pets allowed at Méchante Cabane?",
    answer:
      "We welcome well-behaved dogs with prior arrangement. A small additional cleaning fee applies, and we ask that pets remain leashed when outside to respect the delicate forest ecosystem and local wildlife. Please mention your furry companion when booking.",
  },
  {
    question: "What should I bring for my stay?",
    answer:
      "We provide all bedding, towels, basic toiletries, and kitchen essentials. We recommend bringing sturdy walking boots, layered clothing for unpredictable forest weather, a good book, a journal, and an open mind. A detailed packing list is shared upon booking confirmation.",
  },
  {
    question: "Is there heating and electricity in the cabin?",
    answer:
      "Yes, the cabin is equipped with a wood-burning stove as the primary heat source (firewood provided), supplemented by solar-powered electricity for essential lighting and charging small devices. Hot water is available via a gas-powered system. The experience balances rustic authenticity with quiet comfort.",
  },
];

// ── Shared text styles — identical to ScrollStory & VideoSection ──────────────
const questionStyle = {
  fontFamily: "var(--font-cormorant)",
  fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)",
  fontWeight: 400,
  color: "white",
  letterSpacing: "0.02em",
  lineHeight: 1.3,
  flex: 1,
  textAlign: "left",
};

const answerStyle = {
  fontFamily: "var(--font-inter)",
  fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
  fontWeight: 300,
  color: "rgba(255,255,255,0.52)",
  lineHeight: 1.8,
  letterSpacing: "0.01em",
};

// ── Corner markers — consistent with VideoSection ─────────────────────────────
const SectionCorners = memo(function SectionCorners() {
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

// ── Single FAQ accordion item ─────────────────────────────────────────────────
const FAQItem = memo(function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
  isInView,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 24 }}
      transition={{
        duration: 0.7,
        delay: 0.1 + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 py-5 text-left group focus:outline-none"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        aria-expanded={isOpen}
      >
        {/* Toggle icon */}
        <span
          className="shrink-0 mt-1 w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-300"
          style={{
            border: "1px solid rgba(255,255,255,0.25)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <motion.svg
            viewBox="0 0 12 12"
            width={10}
            height={10}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <line x1="6" y1="1" x2="6" y2="11" />
            <line x1="1" y1="6" x2="11" y2="6" />
          </motion.svg>
        </span>

        <span style={questionStyle}>{question}</span>
      </button>

      {/* Answer — AnimatePresence for unmount animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                ...answerStyle,
                paddingLeft: "2.25rem",
                paddingBottom: "1.4rem",
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ── Main Component ────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1, once: true });

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-black overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Corner decoration — consistent with other sections */}
      <SectionCorners />

      {/* Top gradient — blends with VideoSection above */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "18vh",
          background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Inner layout container */}
      <div
        className="relative flex flex-col md:flex-row w-full"
        style={{
          minHeight: "100vh",
          zIndex: 2,
        }}
      >
        {/* ── LEFT: Video (30%) - Full height ────────────────────────────────── */}
        <motion.div
          className="w-full md:w-[30%] shrink-0 flex flex-col"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Video container - Full height */}
          <div
            className="relative overflow-hidden w-full h-full"
            style={{
              minHeight: "100%",
            }}
          >
            {/* Corner viewfinder markers on the video */}
            <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 pointer-events-none z-10" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 pointer-events-none z-10" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20 pointer-events-none z-10" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 pointer-events-none z-10" />

            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              className="absolute inset-0 w-full h-full object-cover"
              style={{ pointerEvents: "none" }}
            >
              {/* Peaceful forest / nature stock — Pexels free */}
              <source
                src="https://www.pexels.com/download/video/13724665/"
                type="video/mp4"
              />
            </video>

            {/* Dark overlay — cinematic feel */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.38)" }}
            />

            {/* Bottom fade — blends into section bg */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: "40%",
                background: "linear-gradient(to top, #000 0%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Vertical divider (hidden on mobile) */}
        <motion.div
          className="hidden md:block shrink-0 self-stretch"
          style={{ width: "1px", background: "rgba(255,255,255,0.08)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isInView ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* ── RIGHT: FAQs (70%) ─────────────────────────────────────────────── */}
        <div
          className="w-full md:w-[70%] flex flex-col justify-center"
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 5rem)",
            paddingRight: "clamp(2rem, 5vw, 5rem)",
            paddingTop: "clamp(5rem, 10vh, 9rem)",
            paddingBottom: "clamp(4rem, 8vh, 7rem)",
          }}
        >
          
          {/* Bottom border on last item */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
                isInView={isInView}
              />
            ))}
          </div>

          {/* Subtle footnote */}
          <motion.p
            className="mt-8"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.52rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Further enquiries welcome — contact@mechantecabane.com
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default memo(FAQSection);