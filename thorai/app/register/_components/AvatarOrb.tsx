"use client";

import { motion } from "framer-motion";

interface AvatarOrbProps {
  size?: "sm" | "md" | "lg";
  showEqualizer?: boolean;
}

export default function AvatarOrb({ size = "md", showEqualizer = true }: AvatarOrbProps) {
  // For the premium orb the base sphere is always 80px regardless of size prop,
  // but we scale the container so existing callers keep working.
  const containerSize = { sm: 32, md: 80, lg: 128 }[size];
  const scale = containerSize / 80;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      {/* Scaled wrapper so existing size prop still works */}
      <div
        style={{
          width: containerSize,
          height: containerSize,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pulse ring */}
        <motion.div
          animate={{ opacity: [0.15, 0, 0.15], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          style={{
            position: "absolute",
            width: 128 * scale,
            height: 128 * scale,
            borderRadius: "50%",
            border: "1px solid rgba(94,106,210,0.15)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Ring 2 — counter-rotating */}
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute",
            width: 112 * scale,
            height: 112 * scale,
            borderRadius: "50%",
            borderBottom: `1.5px solid rgba(155,163,235,${size === "sm" ? 0.15 : 0.3})`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Ring 1 — rotating */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute",
            width: 96 * scale,
            height: 96 * scale,
            borderRadius: "50%",
            borderTop: `1.5px solid rgba(94,106,210,${size === "sm" ? 0.3 : 0.6})`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Breathing sphere */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          style={{
            position: "absolute",
            width: 80 * scale,
            height: 80 * scale,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #9BA3EB 0%, #5E6AD2 40%, #2A3190 100%)",
            boxShadow: `0 0 0 ${8 * scale}px rgba(94,106,210,0.08), 0 0 0 ${16 * scale}px rgba(94,106,210,0.05), 0 0 ${40 * scale}px rgba(94,106,210,0.2)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "hidden",
          }}
        >
          {/* Specular highlight */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "18%",
              width: "30%",
              height: "18%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              filter: "blur(3px)",
              transform: "rotate(-20deg)",
            }}
          />
        </motion.div>
      </div>

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
