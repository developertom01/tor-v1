"use client";

import { motion } from "framer-motion";
import { Store, BrainCircuit, CreditCard, Receipt, Users, ShieldCheck } from "lucide-react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

const FEATURES = [
  {
    icon: Store,
    title: "Fully Customized Website",
    description: "Your brand, your rules. Choose your colors, upload your logo, set your layout. No code. No designer. Your store looks exactly how you imagined it.",
  },
  {
    icon: BrainCircuit,
    title: "AI Marketing Assistant",
    description: "Your 24/7 growth partner. Get AI-generated product descriptions, promotion ideas, and customer messaging — all tailored to your business and your buyers.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Get paid, hassle-free. Accept Paystack, MTN Mobile Money, and more. Funds land in your account directly. No middlemen. No delays.",
  },
  {
    icon: Receipt,
    title: "Receipts & Notifications",
    description: "Automated, professional. Every order generates a receipt and triggers customer notifications instantly. Your buyers always know what's happening.",
  },
  {
    icon: Users,
    title: "Easy Customer Tracking",
    description: "Know your customers. See who bought what, when, and how often. Understand your top buyers and re-engage them when it matters.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Vendor Badge",
    description: "Trust you can see. After identity verification, your store displays the ThorAI Verified badge — a signal that buyers across Africa recognize and trust.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-bg)",
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
              Features
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
            Everything you need to{" "}
            <span className="accent-text">sell with confidence.</span>
          </h2>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1rem",
              color: "var(--color-text-secondary)",
              maxWidth: "32rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            One platform. Six tools that work together from day one.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: "1rem",
          }}
          className="sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, ease: easeCustom, delay: Math.min(i * 0.08, 0.4) }}
                style={{
                  padding: "2rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--color-border-hover)";
                  el.style.boxShadow = "0 0 0 1px rgba(94,106,210,0.2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--color-border)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-accent-glow)",
                    marginBottom: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: "var(--color-accent-light)" }} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.625rem",
                    lineHeight: 1.3,
                    fontSize: "1rem",
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                    margin: "0 0 0.625rem 0",
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "var(--color-text-secondary)",
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
