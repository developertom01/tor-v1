"use client";

import { motion } from "framer-motion";

const easeCustom = [0.25, 0.46, 0.45, 0.94] as const;

export default function CoreMissionSection() {
  return (
    <section
      style={{
        paddingTop: "7rem",
        paddingBottom: "7rem",
        backgroundColor: "var(--color-surface)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div
        style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
      >
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeCustom }}
        >
          {/* Overline */}
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
              Our Mission
            </span>
          </div>

          <h2
            style={{
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            African commerce deserves
            <br />
            <span className="accent-text">the trust it was built on.</span>
          </h2>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--color-text-secondary)",
            }}
          >
            Online shopping in West Africa has a trust problem. Buyers have been burned by scams. Vendors struggle to be believed. ThorAI was built to fix both — not by accident, but by design.
          </p>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              color: "var(--color-text-secondary)",
            }}
          >
            Every store on our platform carries a Verified Vendor Badge. Every transaction is monitored. Every buyer has recourse. This is not just an e-commerce builder. It&apos;s infrastructure for trust.
          </p>

          {/* Stats */}
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "2rem",
              display: "flex",
              gap: "2.5rem",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div
                className="accent-text"
                style={{ fontWeight: 700, fontSize: "1.875rem" }}
              >
                2,000+
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                vendor-buyer interactions protected
              </div>
            </motion.div>

            <div
              style={{
                width: 1,
                height: 48,
                backgroundColor: "var(--color-border)",
                alignSelf: "center",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <div
                className="accent-text"
                style={{ fontWeight: 700, fontSize: "1.875rem" }}
              >
                Zero
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                reported fraud on verified stores
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeCustom, delay: 0.15 }}
        >
          <div
            style={{
              borderRadius: "1rem",
              padding: "2rem",
              aspectRatio: "1 / 1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              {["Vendor", "Buyer"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Split composition */}
            <div style={{ display: "flex", flex: 1, position: "relative" }}>
              {/* Vendor side */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  paddingRight: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-accent-glow)",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: "100%",
                      height: 24,
                      borderRadius: "0.5rem",
                      backgroundColor: `rgba(255,255,255,${0.03 + n * 0.02})`,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "5px 10px",
                    borderRadius: 100,
                    border: "1.5px solid rgba(94,106,210,0.5)",
                    color: "var(--color-accent-light)",
                    backgroundColor: "var(--color-accent-glow)",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  VERIFIED
                </div>
              </div>

              {/* Vertical divider with lock */}
              <div
                style={{
                  width: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    width: 1,
                    borderLeft: "2px dashed rgba(255,255,255,0.08)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Buyer side */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  paddingLeft: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 76,
                    borderRadius: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.6rem",
                    gap: "0.35rem",
                    border: "2px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                >
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      style={{
                        width: "100%",
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `rgba(255,255,255,${0.05 + n * 0.02})`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-accent-glow)",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
