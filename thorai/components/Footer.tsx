"use client";

import Link from "next/link";
import { Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "5rem",
        paddingBottom: "3rem",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: "2rem",
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: "inline-block", textDecoration: "none" }}>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                }}
              >
                Thor<span style={{ color: "var(--color-accent)" }}>AI</span>
              </span>
            </Link>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                maxWidth: "13rem",
              }}
            >
              Putting African businesses online with confidence.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: MessageCircle, label: "WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{ color: "var(--color-text-tertiary)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
                marginBottom: "1rem",
              }}
            >
              Platform
            </p>
            {["Start for free", "Features", "How it works", "Pricing", "FAQ"].map((link) => (
              <Link
                key={link}
                href={
                  link === "FAQ"
                    ? "/faq"
                    : link === "How it works"
                    ? "/#how-it-works"
                    : link === "Features"
                    ? "/#features"
                    : "#"
                }
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
                marginBottom: "1rem",
              }}
            >
              Company
            </p>
            {["About ThorAI", "Blog", "Careers", "Press", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Trust & Legal */}
          <div>
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
                marginBottom: "1rem",
              }}
            >
              Trust
            </p>
            {["Privacy Policy", "Terms of Service", "Vendor Verification", "Buyer Protection", "Security"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)" }}>
            &copy; 2026 ThorAI. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)" }}>
            Built for Africa.
          </p>
        </div>
      </div>
    </footer>
  );
}
