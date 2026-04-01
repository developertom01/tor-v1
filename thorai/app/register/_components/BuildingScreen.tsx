"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarOrb from "./AvatarOrb";

const MESSAGES = [
  "Setting up your store...",
  "Configuring your payment methods...",
  "Almost ready...",
];

interface BuildingScreenProps {
  onComplete: () => void;
}

export default function BuildingScreen({ onComplete }: BuildingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const calledRef = useRef(false);

  // Cycle messages
  useEffect(() => {
    if (msgIndex < MESSAGES.length - 1) {
      const t = setTimeout(() => setMsgIndex((i) => i + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [msgIndex]);

  // After 3.2s total, trigger onComplete
  useEffect(() => {
    if (calledRef.current) return;
    const t = setTimeout(() => {
      calledRef.current = true;
      onComplete();
    }, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  const circumference = 2 * Math.PI * 54;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "2rem",
        padding: "0 1.5rem",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <AvatarOrb size="lg" showEqualizer />

      {/* SVG progress ring */}
      <div style={{ position: "relative", width: 128, height: 128 }}>
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          {/* Animated foreground ring */}
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Message sequence */}
      <div style={{ height: 32 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "1.125rem",
              textAlign: "center",
              color: "var(--color-text-primary)",
              fontWeight: 500,
              fontFamily: "var(--font-inter)",
              margin: 0,
            }}
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
