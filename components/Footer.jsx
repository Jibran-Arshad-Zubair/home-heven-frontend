"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// ── AntlerIcon — matches the one in Hero ─────────────────────────────────────
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

// ── Footer columns data ───────────────────────────────────────────────────────
const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    items: ["The Cabin", "The Forest", "The Lake", "All Seasons"],
  },
  {
    heading: "Stay",
    items: ["Book a Retreat", "Pricing & Rates", "Availability", "Group Stays"],
  },
  {
    heading: "Connect",
    items: ["Contact Us", "Mailing List", "Instagram", "Press Enquiries"],
  },
];

// ── Main Footer Component ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="relative bg-black w-full"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.10)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {/* ── Corner markers — consistent with other sections ─────────────── */}
      <span className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/20 pointer-events-none" />
      <span className="absolute top-6 right-6 w-5 h-5 border-t border-r border-white/20 pointer-events-none" />
      <span className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-white/20 pointer-events-none" />
      <span className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/20 pointer-events-none" />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row w-full"
        style={{
          paddingTop: "clamp(3rem, 6vh, 5rem)",
          paddingBottom: "clamp(3rem, 6vh, 5rem)",
          paddingLeft: "clamp(2rem, 5vw, 5rem)",
          paddingRight: "clamp(2rem, 5vw, 5rem)",
        }}
      >
        {/* ── LEFT: Logo (40%) ─────────────────────────────────────────── */}
        <div
          className="w-full md:w-[40%] flex flex-col items-start justify-start shrink-0"
          style={{ marginBottom: "clamp(2.5rem, 5vw, 0rem)" }}
        >
          {/* Logo mark + wordmark */}
          <div className="flex items-center gap-3">
            <AntlerIcon size={52} />
           
          </div>
        </div>

      

        {/* ── RIGHT: 3 columns (60%) ───────────────────────────────────── */}
        <div
          className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6"
        >
          {FOOTER_COLUMNS.map((col, colIndex) => (
            <div key={col.heading}>
              {/* Column heading */}
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "white",
                  fontWeight: 600,
                  marginBottom: "1.4rem",
                }}
              >
                {col.heading}
              </p>

              {/* Sub-items */}
              <ul className="flex flex-col" style={{ gap: "0.85rem" }}>
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "clamp(0.72rem, 1vw, 0.82rem)",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.42)",
                        letterSpacing: "0.02em",
                        textDecoration: "none",
                        transition: "color 0.25s ease",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.82)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.42)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "1.4rem",
          paddingBottom: "1.6rem",
          paddingLeft: "clamp(2rem, 5vw, 5rem)",
          paddingRight: "clamp(2rem, 5vw, 5rem)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          © {new Date().getFullYear()} Méchante Cabane — All rights reserved
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          Privacy Policy &nbsp;·&nbsp; Terms of Use
        </p>
      </div>
    </footer>
  );
}

export default memo(Footer);