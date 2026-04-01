"use client";

import { motion } from "framer-motion";

interface AvatarOrbProps {
  size?: "sm" | "md" | "lg";
  showEqualizer?: boolean;
}

export default function AvatarOrb({ size = "md", showEqualizer = true }: AvatarOrbProps) {
  const dimensions = {
    sm: { outer: 32, text: "0.6rem" },
    md: { outer: 96, text: "0.875rem" },
    lg: { outer: 128, text: "1.1rem" },
  }[size];

  const inset = size === "sm" ? 2 : 8;
  const innerInset = size === "sm" ? 4 : 16;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", width: dimensions.outer, height: dimensions.outer }}
      >
        {/* Outer spinning ring */}
        <div
          className="animate-spin-slow"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(94,106,210,0.25)",
          }}
        />
        {/* Middle counter-rotating ring */}
        <div
          className="animate-spin-slow-reverse"
          style={{
            position: "absolute",
            inset: inset,
            borderRadius: "50%",
            border: "1px solid rgba(94,106,210,0.15)",
          }}
        />
        {/* Inner sphere */}
        <div
          style={{
            position: "absolute",
            inset: innerInset,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 35% 35%, #5E6AD2, #3A45B0)",
            boxShadow: "0 0 30px rgba(94,106,210,0.4), inset 0 0 20px rgba(94,106,210,0.15)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: dimensions.text,
              color: "white",
              fontFamily: "var(--font-inter)",
            }}
          >
            T
          </span>
        </div>
      </motion.div>

      {/* Equalizer bars */}
      {showEqualizer && size !== "sm" && (
        <div style={{ display: "flex", gap: "0.125rem", alignItems: "flex-end", height: 16 }}>
          {[
            { animation: "eq-bar-1", delay: "0s" },
            { animation: "eq-bar-2", delay: "0.15s" },
            { animation: "eq-bar-3", delay: "0.3s" },
          ].map((bar, i) => (
            <div
              key={i}
              style={{
                width: 4,
                borderRadius: 9999,
                backgroundColor: "var(--color-accent)",
                animation: `${bar.animation} 1.2s ease-in-out ${bar.delay} infinite`,
                height: 8,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
