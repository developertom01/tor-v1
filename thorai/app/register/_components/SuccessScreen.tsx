"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";

const CONFETTI_PIECES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 400,
  y: -(Math.random() * 300 + 100),
  color:
    i % 3 === 0
      ? "var(--color-accent)"
      : i % 3 === 1
      ? "white"
      : "var(--color-accent-light)",
  size: Math.random() * 6 + 3,
  delay: Math.random() * 0.3,
}));

interface SuccessScreenProps {
  storeSlug: string;
}

export default function SuccessScreen({ storeSlug }: SuccessScreenProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "0 1.5rem",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Confetti */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        {CONFETTI_PIECES.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: piece.x, y: piece.y, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: piece.delay }}
            style={{
              position: "absolute",
              width: piece.size,
              height: piece.size,
              borderRadius: 2,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-accent-glow)",
              border: "1px solid rgba(94,106,210,0.4)",
            }}
          >
            <CheckCircle2 size={40} style={{ color: "var(--color-accent-light)" }} />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontWeight: 700,
            fontSize: "1.875rem",
            color: "var(--color-text-primary)",
            textAlign: "center",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Your store is live.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontSize: "1rem",
            textAlign: "center",
            marginTop: "0.75rem",
            marginLeft: "auto",
            marginRight: "auto",
            color: "var(--color-text-secondary)",
            maxWidth: "24rem",
            lineHeight: 1.6,
          }}
        >
          Visit your store, share the link, and start selling. Your first order might be closer than you think.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "1rem",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0.875rem 1.5rem",
            borderRadius: "0.75rem",
            color: "var(--color-text-secondary)",
            maxWidth: "28rem",
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
          }}
        >
          A ticket has been created for your onboarding — our team will reach out within 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
            maxWidth: "20rem",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: 8,
              fontSize: "0.9375rem",
              fontWeight: 600,
              backgroundColor: "var(--color-accent)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              transition: "background-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(94,106,210,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            View My Store
          </button>
          <button
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: 8,
              fontSize: "0.9375rem",
              fontWeight: 500,
              border: "1px solid rgba(94,106,210,0.4)",
              color: "var(--color-accent-light)",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              transition: "background-color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-glow)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(94,106,210,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(94,106,210,0.4)";
            }}
          >
            Go to Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            textAlign: "center",
            color: "var(--color-text-tertiary)",
          }}
        >
          <LinkIcon size={12} />
          thorai.com/{storeSlug}
        </motion.div>
      </div>
    </div>
  );
}
