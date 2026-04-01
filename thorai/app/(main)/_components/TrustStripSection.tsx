"use client";

import { motion } from "framer-motion";

const STATS = [
  { number: "500+", label: "across Ghana & Nigeria" },
  { number: "GHS 2M+", label: "processed in transactions" },
  { number: "4.9 / 5", label: "average vendor rating" },
  { number: "< 5 min", label: "average store setup time" },
];

export default function TrustStripSection() {
  return (
    <section
      style={{
        paddingTop: "3rem",
        paddingBottom: "3rem",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-accent-light)",
              }}
            >
              Trusted Across Africa
            </span>
            <div
              className="hidden lg:block"
              style={{ width: 1, height: 32, backgroundColor: "var(--color-border)" }}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.number}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.125rem",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                fontStyle: "italic",
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
              }}
            >
              &ldquo;ThorAI gave me a real business&rdquo; — Abena K., Accra
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
