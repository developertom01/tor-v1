"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Security", href: "/#security" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 56,
        backgroundColor: scrolled ? "rgba(10,10,11,0.9)" : "rgba(10,10,11,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "background-color 0.3s, border-color 0.3s",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Thor<span style={{ color: "var(--color-accent)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          className="hidden md:flex"
          style={{ gap: 32, alignItems: "center" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ gap: 12, alignItems: "center" }}>
          <Link
            href="/auth"
            style={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: 6,
              backgroundColor: "var(--color-accent)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(94,106,210,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            padding: 4,
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--color-bg)",
            borderTop: "1px solid var(--color-border)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            zIndex: 49,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontSize: "1rem",
                fontWeight: 400,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              padding: "12px 0",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              marginTop: 16,
              padding: "14px 20px",
              borderRadius: 8,
              backgroundColor: "var(--color-accent)",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
