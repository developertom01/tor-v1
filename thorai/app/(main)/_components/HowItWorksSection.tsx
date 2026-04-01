"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Store, TrendingUp } from "lucide-react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

const STEPS = [
  {
    number: 1,
    title: "Register your business",
    description: "Tell our AI assistant about you and your business. Takes 2 minutes. No paperwork.",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Get your store",
    description: "ThorAI builds your branded store automatically. Customize it to match your vision.",
    icon: Store,
  },
  {
    number: 3,
    title: "Start selling",
    description: "Share your store link. Accept payments. Track orders. Your AI assistant does the rest.",
    icon: TrendingUp,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: easeCustom }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              padding: "5px 12px",
              borderRadius: 100,
              backgroundColor: "var(--color-accent-glow)",
              border: "1px solid rgba(94,106,210,0.25)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-accent-light)",
              }}
            >
              How It Works
            </span>
          </div>
          <h2
            style={{
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            Your store, live in{" "}
            <span className="accent-text">under 5 minutes.</span>
          </h2>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1rem",
              color: "var(--color-text-secondary)",
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Three steps. No technical knowledge required. We handle everything else.
          </p>
        </motion.div>

        {/* Steps */}
        <div
          style={{ position: "relative" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0"
        >
          {/* Connector lines (desktop) */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              top: 28,
              left: "calc(33.333% + 1rem)",
              right: "calc(33.333% + 1rem)",
              zIndex: 0,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease: easeCustom, delay: i * 0.15 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 1.5rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-accent)",
                    boxShadow: "0 0 0 8px rgba(94,106,210,0.12)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      lineHeight: 1,
                      color: "white",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <h3
                    style={{
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                      fontSize: "1.125rem",
                      color: "var(--color-text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                      color: "var(--color-text-secondary)",
                      maxWidth: "14rem",
                      margin: "0 auto",
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <Icon size={20} style={{ color: "var(--color-text-tertiary)" }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easeCustom, delay: 0.5 }}
          style={{ marginTop: "4rem", display: "flex", justifyContent: "center" }}
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
              fontFamily: "var(--font-inter)",
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
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
