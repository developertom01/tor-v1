"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

const TESTIMONIALS = [
  {
    quote: "I'd been selling on Instagram for 2 years and couldn't get people to trust me. The ThorAI Verified badge changed everything. My first week with a store, I made more than the previous month.",
    name: "Abena Kusi",
    business: "Abena's Boutique, Accra",
    badge: "Fashion",
    initial: "A",
  },
  {
    quote: "Setting it up felt like chatting with a friend. I answered a few questions and my store was live before I finished my tea. The payment integration alone is worth everything.",
    name: "Chukwuemeka Obi",
    business: "EM Gadgets, Lagos",
    badge: "Electronics",
    initial: "C",
  },
  {
    quote: "My customers now get automatic receipts and updates. They trust the process more, and I spend less time answering 'has my order shipped?' — the platform handles it.",
    name: "Fatima Al-Hassan",
    business: "Fatima Cosmetics, Kumasi",
    badge: "Beauty",
    initial: "F",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-surface)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: easeCustom }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
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
              Testimonials
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
            Vendors who trusted
            <br />
            <span className="accent-text">the process.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: "1rem",
          }}
          className="lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, ease: easeCustom, delay: i * 0.12 }}
              style={{
                padding: "2rem",
                borderRadius: "0.75rem",
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-border-hover)";
                el.style.boxShadow = "0 0 0 1px rgba(94,106,210,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-border)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    style={{ color: "var(--color-accent)", fill: "var(--color-accent)" }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                  color: "var(--color-text-primary)",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                style={{
                  paddingTop: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    backgroundColor: "var(--color-accent-glow)",
                    border: "1px solid rgba(94,106,210,0.3)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--color-accent-light)",
                    }}
                  >
                    {t.initial}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "var(--color-text-primary)",
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      marginTop: "0.125rem",
                      color: "var(--color-text-secondary)",
                      margin: 0,
                    }}
                  >
                    {t.business}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    padding: "3px 10px",
                    borderRadius: 100,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    flexShrink: 0,
                    backgroundColor: "var(--color-accent-glow)",
                    color: "var(--color-accent-light)",
                    border: "1px solid rgba(94,106,210,0.2)",
                  }}
                >
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
