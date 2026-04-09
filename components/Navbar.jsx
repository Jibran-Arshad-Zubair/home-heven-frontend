"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";

const AntlerLogo = memo(function AntlerLogo() {
  return (
    <svg
      width="52"
      height="42"
      viewBox="0 0 52 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Méchante Cabane logo"
    >
      {/* Left antler */}
      <path
        d="M26 38 L26 26 L18 14 L14 4"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14 L8 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 20 L14 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right antler */}
      <path
        d="M26 26 L34 14 L38 4"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 14 L44 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 20 L38 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Explore", href: "#explore" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-14 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <AntlerLogo />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-12">
          {NAV_LINKS.map(({ label, href, active }) => (
            <li key={label}>
              <Link
                href={href}
                className={`relative flex items-center gap-1.5 text-sm tracking-[0.15em] uppercase font-light transition-opacity duration-200 hover:opacity-100 ${
                  active ? "opacity-100" : "opacity-60"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {active && (
                  <span className="w-1 h-1 rounded-full bg-white inline-block" />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Book Now + Arrow */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#book"
            className="text-xs tracking-[0.2em] uppercase font-medium text-white border border-white/40 px-5 py-2.5 hover:bg-white hover:text-black transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Book Now
          </Link>
          <button
            aria-label="Next"
            className="w-10 h-10 flex items-center justify-center border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-black/90 backdrop-blur-md`}
      >
        <ul className="flex flex-col px-6 py-6 gap-5">
          {NAV_LINKS.map(({ label, href, active }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={toggleMenu}
                className={`flex items-center gap-2 text-sm tracking-[0.15em] uppercase transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-60"
                }`}
              >
                {active && (
                  <span className="w-1 h-1 rounded-full bg-white inline-block" />
                )}
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-4 border-t border-white/20">
            <Link
              href="#book"
              onClick={toggleMenu}
              className="text-xs tracking-[0.2em] uppercase font-medium text-white border border-white/40 px-5 py-3 inline-block hover:bg-white hover:text-black transition-all duration-300"
            >
              Book Now
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default memo(Navbar);
