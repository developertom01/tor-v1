"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ShieldCheck, Lock, BadgeCheck, AlertCircle, UserCheck, CreditCard, MessageSquare, RefreshCw } from "lucide-react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

interface CounterProps {
  target: number;
  suffix: string;
  label: string;
}

function Counter({ target, suffix, label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const duration = 1500;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  const display = Number.isInteger(target) ? Math.round(count) : count.toFixed(1);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        className="accent-text"
        style={{
          fontWeight: 800,
          lineHeight: 1,
          fontSize: "2.25rem",
          fontFamily: "var(--font-inter)",
        }}
      >
        {display}{suffix}
      </div>
      <div
        style={{
          fontSize: "0.875rem",
          marginTop: "0.5rem",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-inter)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          margin: "0.75rem auto 0",
          width: 40,
          height: 1,
          backgroundColor: "rgba(94,106,210,0.4)",
        }}
      />
    </div>
  );
}

const VENDOR_POINTS = [
  { icon: ShieldCheck, text: "Identity verification before your store goes live" },
  { icon: Lock, text: "End-to-end encrypted payment processing" },
  { icon: BadgeCheck, text: "Verified Vendor Badge shown to all buyers" },
  { icon: AlertCircle, text: "Dispute resolution support included" },
];

const BUYER_POINTS = [
  { icon: UserCheck, text: "Only verified vendors can sell on ThorAI" },
  { icon: CreditCard, text: "Secure payment gateway — your card data is never stored" },
  { icon: MessageSquare, text: "Direct vendor contact before and after purchase" },
  { icon: RefreshCw, text: "Clear return and dispute process for every order" },
];

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="clip-diagonal-bottom-reverse"
      style={{
        position: "relative",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
        backgroundColor: "var(--color-surface)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div
        style={{ position: "relative", maxWidth: "1152px", margin: "0 auto", padding: "0 24px", zIndex: 1 }}
      >
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
              Security &amp; Trust
            </span>
          </div>
          <h2
            style={{
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              color: "var(--color-text-primary)",
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              margin: 0,
            }}
          >
            We protect everyone
            <br />
            in the transaction.
          </h2>
          <p
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "1rem",
              color: "var(--color-text-secondary)",
              maxWidth: "44rem",
            }}
          >
            Fraud prevention, identity verification, and buyer guarantees — built into every store from day one.
          </p>
        </motion.div>

        {/* Two-column card */}
        <div
          style={{
            display: "grid",
            borderRadius: "1.25rem",
            overflow: "hidden",
            border: "1px solid var(--color-border)",
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Vendor column */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeCustom }}
            style={{
              position: "relative",
              padding: "3rem",
              backgroundColor: "rgba(94,106,210,0.04)",
              backdropFilter: "blur(4px)",
              transition: "box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 0 1px rgba(94,106,210,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "var(--color-accent-light)",
              }}
            >
              For Vendors
            </p>
            <h3
              style={{
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "2rem",
                fontSize: "1.25rem",
              }}
            >
              Your store, protected.
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {VENDOR_POINTS.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      marginTop: 2,
                      flexShrink: 0,
                      color: "var(--color-accent-light)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {text}
                  </span>
                </motion.li>
              ))}
            </ul>
            {/* Watermark */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                opacity: 0.04,
                pointerEvents: "none",
              }}
            >
              <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </motion.div>

          {/* Buyer column */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeCustom, delay: 0.1 }}
            style={{
              position: "relative",
              padding: "3rem",
              backgroundColor: "var(--color-bg)",
              borderLeft: "1px solid var(--color-border)",
              transition: "box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 0 1px rgba(94,106,210,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "var(--color-accent-light)",
              }}
            >
              For Buyers
            </p>
            <h3
              style={{
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "2rem",
                fontSize: "1.25rem",
              }}
            >
              Shop with certainty.
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {BUYER_POINTS.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      marginTop: 2,
                      flexShrink: 0,
                      color: "var(--color-accent-light)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Counter strip */}
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            gap: "4rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Counter target={99.8} suffix="%" label="Uptime SLA" />
          <Counter target={256} suffix="-bit" label="Encryption standard" />
          <Counter target={24} suffix="/7" label="Fraud monitoring" />
        </div>
      </div>
    </section>
  );
}
