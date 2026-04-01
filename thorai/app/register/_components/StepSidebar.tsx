"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import AvatarOrb from "./AvatarOrb";

const STEP_NAMES = [
  "Your name",
  "Business name",
  "What you sell",
  "Your location",
  "Logo",
  "WhatsApp",
  "Store colors",
  "Payment methods",
  "Review",
  "Launch",
];

interface StepSidebarProps {
  currentStep: number;
}

export default function StepSidebar({ currentStep }: StepSidebarProps) {
  return (
    <div
      className="hidden lg:flex flex-col"
      style={{
        width: "18rem",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 2rem", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Thor<span style={{ color: "var(--color-accent)" }}>AI</span>
          </span>
        </Link>
      </div>

      {/* Orb */}
      <div style={{ padding: "0 2rem", marginBottom: "2rem" }}>
        <AvatarOrb size="md" showEqualizer />
      </div>

      {/* Step list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {STEP_NAMES.map((name, i) => {
          const stepNum = i + 1;
          const completed = stepNum < currentStep;
          const active = stepNum === currentStep;

          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 1.5rem",
                backgroundColor: active ? "rgba(94,106,210,0.08)" : "transparent",
                borderLeft: active ? "2px solid var(--color-accent)" : "2px solid transparent",
              }}
            >
              {completed ? (
                <CheckCircle
                  size={15}
                  style={{ color: "var(--color-accent)", flexShrink: 0 }}
                />
              ) : active ? (
                <div
                  style={{
                    flexShrink: 0,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid var(--color-accent)",
                    backgroundColor: "var(--color-accent-glow)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      color: "var(--color-accent-light)",
                    }}
                  >
                    {stepNum}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    flexShrink: 0,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: completed
                    ? "var(--color-text-tertiary)"
                    : active
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                  textDecoration: completed ? "line-through" : "none",
                }}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Help */}
      <div style={{ padding: "1.5rem 2rem 0" }}>
        <a
          href="https://wa.me/233000000000"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
        >
          Need help? Chat with us
        </a>
      </div>
    </div>
  );
}
