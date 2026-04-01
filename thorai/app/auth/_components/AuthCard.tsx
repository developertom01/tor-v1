"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

async function signInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

export default function AuthCard() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", marginBottom: "1.5rem" }}>
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

        {/* Heading */}
        <h1
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            margin: "0 0 0.5rem 0",
            textAlign: "center",
          }}
        >
          Welcome to ThorAI
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-text-secondary)",
            textAlign: "center",
            margin: "0 0 2.5rem 0",
            lineHeight: 1.5,
          }}
        >
          Sign in with Google to get your store online.
        </p>

        {/* Google button */}
        <button
          onClick={signInWithGoogle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            width: "100%",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "0.9375rem",
            fontWeight: 500,
            cursor: "pointer",
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid rgba(0,0,0,0.12)",
            fontFamily: "var(--font-inter)",
            transition: "box-shadow 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f8f8";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Terms */}
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
            textAlign: "center",
          }}
        >
          By continuing, you agree to our{" "}
          <a href="#" style={{ color: "var(--color-text-tertiary)", textDecoration: "underline" }}>
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
