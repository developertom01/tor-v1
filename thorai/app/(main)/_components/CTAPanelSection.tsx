"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, BadgeCheck } from "lucide-react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

export default function CTAPanelSection() {
  return (
    <section
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}>
        {/* Panel */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "1rem",
            border: "1px solid rgba(94,106,210,0.2)",
            padding: "5rem 2rem",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(94,106,210,0.1) 0%, transparent 60%), var(--color-surface)",
          }}
        >
          {/* Subtle radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(94,106,210,0.08) 0%, transparent 70%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easeCustom }}
              style={{ marginBottom: "1.25rem" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "5px 14px",
                  borderRadius: 100,
                  backgroundColor: "var(--color-accent-glow)",
                  border: "1px solid rgba(94,106,210,0.3)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "var(--color-accent-light)",
                }}
              >
                Get Started Today
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easeCustom, delay: 0.1 }}
              style={{
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                color: "var(--color-text-primary)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                margin: 0,
              }}
            >
              Your store is
              <br />
              <span className="accent-text">waiting for you.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easeCustom, delay: 0.2 }}
              style={{
                marginTop: "1.25rem",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "1rem",
                color: "var(--color-text-secondary)",
                maxWidth: "36rem",
              }}
            >
              Join 500+ vendors across Africa who chose to build their business the right way.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: easeCustom, delay: 0.3 }}
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "2.5rem",
              }}
            >
              <Link
                href="/register"
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  borderRadius: 8,
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(94,106,210,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Launch My Store Free
              </Link>
              <Link
                href="#"
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  borderRadius: 8,
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--color-text-primary)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.24)";
                  el.style.backgroundColor = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.backgroundColor = "transparent";
                }}
              >
                Talk to Us
              </Link>
            </motion.div>

            {/* Trust marks */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: easeCustom, delay: 0.45 }}
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "1.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
                color: "var(--color-text-tertiary)",
              }}
            >
              {[
                { icon: ShieldCheck, text: "No credit card required" },
                { icon: Zap, text: "Live in under 5 minutes" },
                { icon: BadgeCheck, text: "Free forever plan included" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  <Icon size={14} />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
