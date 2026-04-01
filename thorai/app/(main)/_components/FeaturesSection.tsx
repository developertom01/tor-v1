"use client";

import { motion } from "framer-motion";
import { Store, BrainCircuit, CreditCard, Receipt, Users, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

const BUBBLES = [
  { from: "user", text: "What products sell best in Accra this month?" },
  { from: "ai", text: "Wigs and clip-ins are trending 📈" },
  { from: "user", text: "Here's your marketing plan for this week..." },
];

function ChatMockup() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => (v + 1) % (BUBBLES.length + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      {BUBBLES.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: visible > i ? 1 : 0, y: visible > i ? 0 : 8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            alignSelf: bubble.from === "ai" ? "flex-start" : "flex-end",
            maxWidth: "85%",
            padding: "8px 12px",
            borderRadius: bubble.from === "ai" ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
            background: bubble.from === "ai"
              ? "rgba(94,106,210,0.15)"
              : "rgba(94,106,210,0.35)",
            border: "1px solid rgba(94,106,210,0.25)",
            fontSize: "0.75rem",
            lineHeight: 1.5,
            color: "#D4D8F7",
          }}
        >
          {bubble.text}
        </motion.div>
      ))}
    </div>
  );
}

function BrowserMockup() {
  return (
    <div
      style={{
        marginTop: 16,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0A0A0B",
      }}
    >
      {/* Chrome */}
      <div
        style={{
          padding: "6px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ flex: 1, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.05)", marginLeft: 6 }} />
      </div>
      {/* Content blocks */}
      <div style={{ padding: 10 }}>
        <div style={{ height: 32, borderRadius: 4, background: "linear-gradient(90deg,rgba(94,106,210,0.25),rgba(58,69,176,0.15))", marginBottom: 8 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <div style={{ height: 28, borderRadius: 4, background: "rgba(94,106,210,0.12)" }} />
          <div style={{ height: 28, borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ height: 28, borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ height: 28, borderRadius: 4, background: "rgba(94,106,210,0.08)" }} />
        </div>
      </div>
    </div>
  );
}

function PaymentPills() {
  const pills = ["Paystack ✓", "MTN MoMo ✓", "Card ✓"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      {pills.map((label) => (
        <div
          key={label}
          style={{
            padding: "8px 14px",
            borderRadius: 100,
            background: "rgba(94,106,210,0.12)",
            border: "1px solid rgba(94,106,210,0.3)",
            color: "#9BA3EB",
            fontSize: "0.8125rem",
            fontWeight: 500,
            display: "inline-block",
            alignSelf: "flex-start",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function SparklineChart() {
  const points = "0,40 20,28 40,34 60,12 80,20";
  return (
    <div style={{ marginTop: 16 }}>
      <svg width="100%" height="52" viewBox="0 0 80 52" preserveAspectRatio="none" style={{ display: "block" }}>
        <rect width="80" height="52" rx="4" fill="rgba(255,255,255,0.03)" />
        <polyline
          points={points}
          fill="none"
          stroke="#5E6AD2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.split(" ").map((pt, i) => {
          const [x, y] = pt.split(",").map(Number);
          return <circle key={i} cx={x} cy={y} r="2" fill="#9BA3EB" />;
        })}
      </svg>
    </div>
  );
}

function ReceiptMockup() {
  return (
    <div
      style={{
        marginTop: 16,
        padding: "12px 14px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {[0.5, 0.35, 0.45, 0.3].map((w, i) => (
        <div
          key={i}
          style={{
            height: 7,
            borderRadius: 3,
            background: "rgba(255,255,255,0.12)",
            width: `${w * 100}%`,
            marginBottom: 8,
          }}
        />
      ))}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "10px 0" }} />
      <div
        style={{
          height: 9,
          borderRadius: 3,
          background: "rgba(94,106,210,0.4)",
          width: "55%",
        }}
      />
    </div>
  );
}

function ShieldBadge() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, gap: 10 }}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        style={{ filter: "drop-shadow(0 0 16px rgba(94,106,210,0.5))" }}
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          fill="rgba(94,106,210,0.2)"
          stroke="#5E6AD2"
          strokeWidth="1.5"
        />
        <path d="M9 12l2 2 4-4" stroke="#9BA3EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        style={{
          fontSize: "0.75rem",
          color: "#9BA3EB",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Verified by ThorAI
      </span>
    </div>
  );
}

const cardBase: React.CSSProperties = {
  background: "#111113",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: 24,
  transition: "border-color 0.2s, transform 0.2s",
  cursor: "default",
};

function BentoCard({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: easeCustom, delay }}
      style={{ ...cardBase, ...style }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(94,106,210,0.3)";
        el.style.transform = (style?.transform ?? "") + " translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = style?.transform ?? "";
      }}
    >
      {children}
    </motion.div>
  );
}

function CardIcon({ Icon }: { Icon: React.ElementType }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(94,106,210,0.12)",
        marginBottom: 12,
        flexShrink: 0,
      }}
    >
      <Icon size={18} style={{ color: "#9BA3EB" }} />
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontWeight: 600,
        fontSize: "0.9375rem",
        color: "var(--color-text-primary)",
        letterSpacing: "-0.01em",
        margin: "0 0 6px 0",
        lineHeight: 1.3,
      }}
    >
      {children}
    </h3>
  );
}

function CardDesc({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.8125rem",
        lineHeight: 1.65,
        color: "var(--color-text-secondary)",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

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

        {/* Bento grid — desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
          className="bento-grid"
        >
          {/* Card 1 — AI Assistant */}
          <BentoCard style={{ gridColumn: "1", gridRow: "1", minHeight: 280 }} delay={0}>
            <CardIcon Icon={BrainCircuit} />
            <CardTitle>AI Marketing Assistant</CardTitle>
            <CardDesc>
              Your 24/7 growth partner. Get AI-generated product descriptions, promotion ideas, and customer messaging — all tailored to your business.
            </CardDesc>
            <ChatMockup />
          </BentoCard>

          {/* Card 2 — Customized Website */}
          <BentoCard style={{ gridColumn: "2", gridRow: "1" }} delay={0.08}>
            <CardIcon Icon={Store} />
            <CardTitle>Fully Customized Website</CardTitle>
            <CardDesc>Your brand, your rules. No code. No designer.</CardDesc>
            <BrowserMockup />
          </BentoCard>

          {/* Card 3 — Easy Payments */}
          <BentoCard style={{ gridColumn: "3", gridRow: "1" }} delay={0.16}>
            <CardIcon Icon={CreditCard} />
            <CardTitle>Easy Payments</CardTitle>
            <CardDesc>Accept Paystack, MTN MoMo, and more. Funds land directly in your account.</CardDesc>
            <PaymentPills />
          </BentoCard>

          {/* Card 4 — Customer Tracking */}
          <BentoCard style={{ gridColumn: "1", gridRow: "2" }} delay={0.24}>
            <CardIcon Icon={Users} />
            <CardTitle>Easy Customer Tracking</CardTitle>
            <CardDesc>Know your customers. See who bought what, when, and how often.</CardDesc>
            <SparklineChart />
          </BentoCard>

          {/* Card 5 — Receipt Generation */}
          <BentoCard style={{ gridColumn: "2", gridRow: "2" }} delay={0.32}>
            <CardIcon Icon={Receipt} />
            <CardTitle>Receipts & Notifications</CardTitle>
            <CardDesc>Every order generates a receipt and triggers customer notifications instantly.</CardDesc>
            <ReceiptMockup />
          </BentoCard>

          {/* Card 6 — Verified Vendor Badge */}
          <BentoCard style={{ gridColumn: "3", gridRow: "2" }} delay={0.4}>
            <CardIcon Icon={ShieldCheck} />
            <CardTitle>Verified Vendor Badge</CardTitle>
            <CardDesc>After identity verification, your store displays the ThorAI Verified badge.</CardDesc>
            <ShieldBadge />
          </BentoCard>
        </div>

        {/* Mobile fallback — single column via Tailwind override */}
        <style>{`
          @media (max-width: 767px) {
            .bento-grid {
              grid-template-columns: 1fr !important;
              grid-template-rows: auto !important;
            }
            .bento-grid > * {
              grid-column: 1 !important;
              grid-row: auto !important;
              min-height: unset !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
