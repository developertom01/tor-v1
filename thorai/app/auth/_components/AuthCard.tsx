"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

type Tab = "signin" | "signup";

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

function DarkInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  rightElement,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          borderRadius: 8,
          paddingTop: "1.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "0.875rem",
          paddingRight: rightElement ? "2.5rem" : "0.875rem",
          fontSize: "0.875rem",
          outline: "none",
          backgroundColor: "rgba(255,255,255,0.04)",
          border: focused
            ? "1px solid rgba(94,106,210,0.6)"
            : "1px solid rgba(255,255,255,0.1)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-inter)",
          boxShadow: focused ? "0 0 0 3px rgba(94,106,210,0.12)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: "0.875rem",
          pointerEvents: "none",
          transition: "all 0.15s",
          top: lifted ? "0.35rem" : "0.875rem",
          fontSize: lifted ? "0.6875rem" : "0.875rem",
          fontFamily: "var(--font-inter)",
          fontWeight: lifted ? 500 : 400,
          color: lifted && focused
            ? "var(--color-accent-light)"
            : "var(--color-text-tertiary)",
        }}
      >
        {label}
      </label>
      {rightElement && (
        <div
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {rightElement}
        </div>
      )}
    </div>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  return (
    <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.5rem" }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 9999,
            transition: "background-color 0.3s",
            backgroundColor: i < strength ? colors[strength - 1] : "rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
      <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-text-primary)">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function AuthCard() {
  const [tab, setTab] = useState<Tab>("signin");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinShowPassword, setSigninShowPassword] = useState(false);

  const eyeBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--color-text-tertiary)",
    padding: 0,
    display: "flex",
  };

  return (
    <div
      style={{
        maxWidth: "22rem",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "4rem 2rem",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Mobile logo */}
      <div className="lg:hidden" style={{ marginBottom: "2.5rem" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Thor<span style={{ color: "var(--color-accent)" }}>AI</span>
          </span>
        </Link>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontWeight: 700,
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          {tab === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p
          style={{
            marginTop: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--color-text-secondary)",
          }}
        >
          {tab === "signin" ? "Sign in to your ThorAI account." : "Start selling in minutes."}
        </p>
      </div>

      {/* Tab switcher — underline style */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border)",
          marginBottom: "2rem",
        }}
      >
        {(["signin", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              paddingBottom: "0.75rem",
              paddingTop: "0.25rem",
              fontSize: "0.875rem",
              fontWeight: tab === t ? 600 : 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === t ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              borderBottom: tab === t ? "2px solid var(--color-accent)" : "2px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
              fontFamily: "var(--font-inter)",
            }}
          >
            {t === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Form area */}
      <AnimatePresence mode="wait">
        {tab === "signin" ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <DarkInput
                id="signin-email"
                label="Email address"
                type="email"
                value={signinEmail}
                onChange={setSigninEmail}
                autoComplete="email"
              />
              <div>
                <DarkInput
                  id="signin-password"
                  label="Password"
                  type={signinShowPassword ? "text" : "password"}
                  value={signinPassword}
                  onChange={setSigninPassword}
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setSigninShowPassword((s) => !s)}
                      style={eyeBtnStyle}
                    >
                      {signinShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.375rem" }}>
                  <a
                    href="#"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--color-accent-light)",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 8,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  marginTop: "0.5rem",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
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
                Sign In
              </button>
            </form>

            <OAuthSection />

            <p
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontSize: "0.8125rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setTab("signup")}
                style={{
                  fontWeight: 500,
                  color: "var(--color-accent-light)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                  padding: 0,
                  fontSize: "inherit",
                }}
              >
                Sign up free
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <DarkInput
                id="signup-name"
                label="Full Name"
                value={signupName}
                onChange={setSignupName}
                autoComplete="name"
              />
              <DarkInput
                id="signup-email"
                label="Email address"
                type="email"
                value={signupEmail}
                onChange={setSignupEmail}
                autoComplete="email"
              />
              <div>
                <DarkInput
                  id="signup-password"
                  label="Password"
                  type={signupShowPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={setSignupPassword}
                  autoComplete="new-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setSignupShowPassword((s) => !s)}
                      style={eyeBtnStyle}
                    >
                      {signupShowPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <PasswordStrengthBar password={signupPassword} />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 8,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  marginTop: "0.5rem",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
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
                Create Account
              </button>
            </form>

            <OAuthSection />

            <p
              style={{
                marginTop: "1rem",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              By creating an account you agree to our{" "}
              <a href="#" style={{ color: "inherit" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "inherit" }}>Privacy Policy</a>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OAuthSection() {
  const oauthBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    borderRadius: 8,
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--color-text-primary)",
    backgroundColor: "rgba(255,255,255,0.04)",
    fontFamily: "var(--font-inter)",
    transition: "border-color 0.2s, background-color 0.2s",
  };

  return (
    <>
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <hr style={{ flex: 1, borderColor: "var(--color-border)", borderTop: 0 }} />
        <span
          style={{
            fontSize: "0.75rem",
            flexShrink: 0,
            color: "var(--color-text-tertiary)",
          }}
        >
          or continue with
        </span>
        <hr style={{ flex: 1, borderColor: "var(--color-border)", borderTop: 0 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
        <button
          style={oauthBtnStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
          }}
        >
          <GoogleIcon />
          Google
        </button>
        <button
          style={oauthBtnStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
          }}
        >
          <AppleIcon />
          Apple
        </button>
      </div>
    </>
  );
}
