"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

const FAQS = [
  {
    q: "Is ThorAI free to use?",
    a: "Getting started is completely free. You can register, set up your store, and publish it at no cost. We offer premium plans for vendors who want advanced analytics, custom domains, and priority support.",
  },
  {
    q: "Do I need to know how to code or build websites?",
    a: "Not at all. Our AI assistant guides you through setup conversationally — like a chat. You answer simple questions and ThorAI builds your store automatically. No technical knowledge required.",
  },
  {
    q: "How do I receive payments?",
    a: "Payments go through Paystack and MTN Mobile Money — two of the most trusted payment processors in West Africa. Funds are deposited directly to your account. ThorAI never holds your money.",
  },
  {
    q: "What is the Verified Vendor Badge?",
    a: "After you complete identity verification (a quick process), your store displays the ThorAI Verified badge. This tells buyers that your business is real, verified, and trustworthy — which increases your conversion rate significantly.",
  },
  {
    q: "Can buyers trust that their purchases are safe?",
    a: "Yes. All transactions on ThorAI are processed through encrypted, PCI-compliant payment gateways. Buyer data is never shared or sold. Every verified store is monitored for fraudulent activity.",
  },
  {
    q: "How long does store setup take?",
    a: "Most vendors complete setup in under 5 minutes. The conversational setup process is designed to be fast and stress-free. Your store is live the moment you finish.",
  },
];

export default function LandingFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: easeCustom }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
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
              FAQ
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
            Questions we get
            <br />
            <span className="accent-text">all the time.</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, ease: easeCustom, delay: i * 0.06 }}
              style={{
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 0",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  gap: "1rem",
                }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter)",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1px solid rgba(94,106,210,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent-light)",
                    fontSize: "1rem",
                    lineHeight: 1,
                    transition: "background-color 0.2s",
                    backgroundColor: openIndex === i ? "var(--color-accent-glow)" : "transparent",
                  }}
                >
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        paddingBottom: "1.25rem",
                        fontSize: "0.9375rem",
                        lineHeight: 1.7,
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-inter)",
                        margin: 0,
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
