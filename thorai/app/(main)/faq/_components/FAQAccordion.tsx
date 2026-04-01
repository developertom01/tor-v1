"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQItem {
  q: string;
  a: string;
  category: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <p
        style={{
          fontSize: "0.875rem",
          padding: "2rem 0",
          textAlign: "center",
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-inter)",
        }}
      >
        No questions found.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={`${faq.category}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
            style={{
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <button
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "1.25rem 0",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                gap: "1rem",
              }}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: isOpen ? "var(--color-text-primary)" : "var(--color-text-primary)",
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
                  border: isOpen
                    ? "1px solid rgba(94,106,210,0.6)"
                    : "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isOpen ? "var(--color-accent-light)" : "var(--color-text-tertiary)",
                  fontSize: "1rem",
                  lineHeight: 1,
                  marginTop: 2,
                  backgroundColor: isOpen ? "var(--color-accent-glow)" : "transparent",
                  transition: "border-color 0.2s, background-color 0.2s, color 0.2s",
                }}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
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
        );
      })}
    </div>
  );
}
