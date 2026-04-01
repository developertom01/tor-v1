import type { Metadata } from "next";
import AuthCard from "./_components/AuthCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In — ThorAI",
  description: "Sign in or create your ThorAI vendor account.",
};

function DotGrid() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.07,
        zIndex: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="auth-dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="white" fillOpacity="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-dot-grid)" />
    </svg>
  );
}

export default function AuthPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "var(--font-inter)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Left panel — desktop only */}
      <div
        className="hidden lg:flex flex-col"
        style={{
          width: "40%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--color-bg)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <DotGrid />

        {/* Radial accent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(94,106,210,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 3rem",
            zIndex: 2,
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
              }}
            >
              Thor<span style={{ color: "var(--color-accent)" }}>AI</span>
            </span>
          </Link>
          <p
            style={{
              fontStyle: "italic",
              fontSize: "0.875rem",
              marginTop: "0.75rem",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            Your business. Verified. Trusted.
          </p>

          {/* Product quote */}
          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
              backgroundColor: "rgba(255,255,255,0.02)",
              maxWidth: "18rem",
              width: "100%",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
                margin: 0,
              }}
            >
              &ldquo;ThorAI gave me a real business. My customers finally trust me because they can see I&apos;m verified.&rdquo;
            </p>
            <div style={{ marginTop: "1rem" }}>
              <p
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                Abena K.
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-tertiary)",
                  margin: "0.125rem 0 0 0",
                }}
              >
                Fashion vendor, Accra
              </p>
            </div>
          </div>

          {/* Micro stats */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              width: "100%",
              maxWidth: "18rem",
            }}
          >
            {[
              { number: "500+", label: "Active vendors" },
              { number: "Zero", label: "Reported fraud" },
              { number: "5 min", label: "Average setup" },
            ].map((stat, i) => (
              <div key={stat.number}>
                {i > 0 && (
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "var(--color-border)",
                      margin: "0.875rem 0",
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {stat.number}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            textAlign: "center",
            paddingBottom: "2rem",
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
            zIndex: 2,
          }}
        >
          Join Africa&apos;s verified marketplace
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--color-surface)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AuthCard />
      </div>
    </div>
  );
}
