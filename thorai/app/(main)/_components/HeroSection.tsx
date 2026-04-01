"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
        zIndex: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dot-grid-hero" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="white" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid-hero)" />
    </svg>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="clip-diagonal-bottom"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Dot grid */}
      <DotGrid />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{zIndex:1}}>
        <div style={{position:'absolute',top:'20%',left:'25%',width:500,height:500,borderRadius:'50%',background:'#5E6AD2',opacity:0.18,filter:'blur(80px)',animation:'blob1 14s ease-in-out infinite'}} />
        <div style={{position:'absolute',top:'30%',right:'20%',width:400,height:400,borderRadius:'50%',background:'#3A45B0',opacity:0.14,filter:'blur(80px)',animation:'blob2 16s ease-in-out infinite'}} />
        <div style={{position:'absolute',bottom:'20%',left:'40%',width:300,height:300,borderRadius:'50%',background:'#F0A500',opacity:0.06,filter:'blur(80px)',animation:'blob3 12s ease-in-out infinite'}} />
        <div style={{position:'absolute',top:'10%',right:'35%',width:350,height:350,borderRadius:'50%',background:'#9BA3EB',opacity:0.10,filter:'blur(80px)',animation:'blob4 18s ease-in-out infinite'}} />
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: 2,
          height: 120,
          background: "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, zIndex: 10, position: "relative" }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        {/* Overline badge */}
        <div style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "6px 14px",
              borderRadius: 100,
              backgroundColor: "var(--color-accent-glow)",
              border: "1px solid rgba(94,106,210,0.3)",
              color: "var(--color-accent-light)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              fontFamily: "var(--font-inter)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--color-accent-light)",
                flexShrink: 0,
              }}
            />
            AI-Powered · Built for Africa
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontSize: "clamp(3.5rem, 6vw, 6rem)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter)",
            margin: 0,
          }}
        >
          <span style={{ display: "block" }}>Put Your Business</span>
          <span
            className="accent-text"
            style={{ display: "block" }}
          >
            Online With
          </span>
          <span style={{ display: "block" }}>Confidence.</span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "2.5rem",
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--color-text-secondary)",
            maxWidth: "52ch",
            lineHeight: 1.7,
            fontFamily: "var(--font-inter)",
          }}
        >
          ThorAI gives vendors across West Africa a fully verified online store in minutes — and gives buyers the confidence to shop without fear.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/register"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 8,
              backgroundColor: "var(--color-accent)",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "var(--font-inter)",
              transition: "background-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(94,106,210,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Get Started Free
          </Link>
          <Link
            href="#how-it-works"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 8,
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--color-text-primary)",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "var(--font-inter)",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.24)";
              el.style.backgroundColor = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.12)";
              el.style.backgroundColor = "transparent";
            }}
          >
            See How It Works
          </Link>
        </div>

        {/* Product preview */}
        <motion.div
          initial={{y:40,opacity:0}}
          animate={{y:0,opacity:1}}
          transition={{delay:0.5,duration:0.8,ease:[0.16,1,0.3,1]}}
          style={{marginTop:48,width:'min(860px,90vw)',marginLeft:'auto',marginRight:'auto'}}
        >
          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#555555',marginBottom:12,letterSpacing:'0.08em',textTransform:'uppercase'}}>Your store, live in minutes</p>
          <motion.div
            animate={{y:[0,-8,0]}}
            transition={{duration:6,ease:'easeInOut',repeat:Infinity}}
            style={{
              background:'#111113',
              borderRadius:12,
              border:'1px solid rgba(255,255,255,0.08)',
              boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              transform:'perspective(1000px) rotateX(4deg)',
              overflow:'hidden',
            }}
          >
            {/* Browser chrome */}
            <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.15)'}} />
              <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.15)'}} />
              <div style={{width:8,height:8,borderRadius:'50%',background:'rgba(255,255,255,0.15)'}} />
              <div style={{flex:1,height:20,borderRadius:4,background:'rgba(255,255,255,0.05)',marginLeft:8}} />
            </div>
            {/* Mock store content */}
            <div style={{padding:16}}>
              {/* Navbar strip */}
              <div style={{height:32,borderRadius:6,background:'rgba(255,255,255,0.04)',marginBottom:12,display:'flex',alignItems:'center',padding:'0 12px',gap:8}}>
                <div style={{width:60,height:10,borderRadius:3,background:'rgba(94,106,210,0.4)'}} />
                <div style={{flex:1}} />
                <div style={{width:40,height:10,borderRadius:3,background:'rgba(255,255,255,0.08)'}} />
                <div style={{width:40,height:10,borderRadius:3,background:'rgba(255,255,255,0.08)'}} />
                <div style={{width:56,height:22,borderRadius:4,background:'rgba(94,106,210,0.5)'}} />
              </div>
              {/* Hero banner */}
              <div style={{height:80,borderRadius:8,background:'linear-gradient(135deg,rgba(94,106,210,0.2),rgba(58,69,176,0.1))',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{width:120,height:10,borderRadius:3,background:'rgba(255,255,255,0.2)',margin:'0 auto 6px'}} />
                  <div style={{width:80,height:8,borderRadius:3,background:'rgba(255,255,255,0.1)',margin:'0 auto'}} />
                </div>
              </div>
              {/* Product grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {[0.4,0.3,0.35].map((op,i)=>(
                  <div key={i} style={{borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
                    <div style={{height:48,background:`rgba(94,106,210,${op})`,margin:8,borderRadius:6}} />
                    <div style={{padding:'0 8px 8px'}}>
                      <div style={{height:7,borderRadius:2,background:'rgba(255,255,255,0.15)',marginBottom:4}} />
                      <div style={{height:7,borderRadius:2,background:'rgba(255,255,255,0.08)',width:'60%'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stat strip */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {[
            { number: "500+", label: "Active stores across Africa" },
            { number: "GHS 0", label: "To get started today" },
            { number: "24/7", label: "AI assistant included" },
          ].map((stat) => (
            <div key={stat.number} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <ChevronDown
          size={22}
          className="animate-bounce-soft"
          style={{ color: "var(--color-text-tertiary)" }}
        />
      </div>
    </section>
  );
}
