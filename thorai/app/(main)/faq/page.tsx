import type { Metadata } from "next";
import FAQSearch from "./_components/FAQSearch";
import type { FAQItem } from "./_components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ — ThorAI",
  description: "Everything you need to know about ThorAI, vendor setup, payments, and buyer safety.",
};

const FAQ_DATA: FAQItem[] = [
  // For Vendors
  {
    category: "vendors",
    q: "How do I register my business on ThorAI?",
    a: "Click 'Get Started Free' on the homepage and follow our conversational setup flow. It takes about 2 minutes and our AI assistant guides you through every step.",
  },
  {
    category: "vendors",
    q: "Is ThorAI free to use?",
    a: "Getting started is completely free. You can register, set up your store, and publish it at no cost. We offer premium plans for vendors who want advanced analytics, custom domains, and priority support.",
  },
  {
    category: "vendors",
    q: "How long does store setup take?",
    a: "Most vendors complete setup in under 5 minutes. The conversational setup process is designed to be fast and stress-free. Your store is live the moment you finish.",
  },
  {
    category: "vendors",
    q: "What is the Verified Vendor Badge and how do I get it?",
    a: "After you complete identity verification (a quick process using a valid ID), your store displays the ThorAI Verified badge. This tells buyers that your business is real, verified, and trustworthy — significantly increasing your conversion rate.",
  },
  {
    category: "vendors",
    q: "Can I use my own domain name?",
    a: "Yes! Premium plan vendors can connect a custom domain (e.g. mystore.com) to their ThorAI store. This is managed from your dashboard under Settings > Domain.",
  },
  {
    category: "vendors",
    q: "How do I manage my products and inventory?",
    a: "Your dashboard includes a full product management section where you can add products with photos, set prices, manage stock levels, and create categories. Changes go live instantly.",
  },
  {
    category: "vendors",
    q: "What happens if I get a dispute from a buyer?",
    a: "ThorAI has a built-in dispute resolution process. You'll be notified through the platform, be able to communicate with the buyer, and provide evidence. Our team reviews all disputes fairly and aims to resolve them within 48 hours.",
  },
  {
    category: "vendors",
    q: "Can I sell multiple product categories?",
    a: "Yes. During setup you can select up to 2 primary categories, but you can add products in any category from your dashboard. There are no restrictions on product variety.",
  },
  {
    category: "vendors",
    q: "How do I customise my store design?",
    a: "From your dashboard, go to Design to change your color palette, upload your logo, edit your homepage banner, and adjust your store layout. Premium plans unlock additional themes and customization options.",
  },
  {
    category: "vendors",
    q: "What analytics and reports do I get?",
    a: "All vendors get a sales dashboard with order history, revenue totals, and basic customer insights. Premium plans include advanced analytics: conversion rates, traffic sources, customer lifetime value, and exportable reports.",
  },
  // For Buyers
  {
    category: "buyers",
    q: "How do I know if a vendor is legitimate?",
    a: "Look for the ThorAI Verified badge on any store. This badge means the vendor has passed our identity verification process. Only verified vendors can display this badge.",
  },
  {
    category: "buyers",
    q: "Is it safe to pay on ThorAI stores?",
    a: "Yes. All transactions are processed through encrypted, PCI-compliant payment gateways (Paystack and mobile money providers). Your card data is never stored on ThorAI servers.",
  },
  {
    category: "buyers",
    q: "What do I do if my order doesn't arrive?",
    a: "Contact the vendor directly through the platform first. If the issue isn't resolved within 48 hours, you can open a dispute through your order page. ThorAI's team will investigate and ensure a fair resolution.",
  },
  {
    category: "buyers",
    q: "Can I get a refund?",
    a: "Refund policies vary by vendor. Each vendor's store page displays their return and refund policy. If you believe a refund is owed and the vendor is unresponsive, ThorAI's dispute process can help.",
  },
  {
    category: "buyers",
    q: "How do I contact a vendor directly?",
    a: "Every ThorAI store has a contact button that lets you message the vendor on WhatsApp directly. Vendors on verified stores are required to respond within 24 hours.",
  },
  // Payments
  {
    category: "payments",
    q: "What payment methods are supported?",
    a: "ThorAI stores accept Paystack (card payments), MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and direct bank transfer. The available options depend on the vendor's setup.",
  },
  {
    category: "payments",
    q: "How quickly are funds released to vendors?",
    a: "Funds are typically available within 24–48 hours of a confirmed order. Paystack settlements follow their standard schedule. Mobile money transfers are often instant. ThorAI never holds vendor funds.",
  },
  {
    category: "payments",
    q: "Are there transaction fees?",
    a: "ThorAI does not add extra transaction fees. Standard payment processor fees apply (Paystack charges 1.5% + GHS 0.50 per transaction in Ghana). These are deducted at the payment processor level.",
  },
  {
    category: "payments",
    q: "What currencies are supported?",
    a: "Ghana Cedis (GHS) and Nigerian Naira (NGN) are fully supported. Kenyan Shillings (KES) and South African Rand (ZAR) are in beta. All prices are set by vendors in their local currency.",
  },
  // Technical
  {
    category: "technical",
    q: "What devices does ThorAI work on?",
    a: "ThorAI works on all modern devices — smartphones, tablets, and computers. Both the vendor dashboard and customer-facing stores are fully mobile-optimized.",
  },
  {
    category: "technical",
    q: "Do I need to install any software?",
    a: "No. ThorAI is entirely web-based. Everything runs in your browser — no app download, no software installation required for either vendors or buyers.",
  },
  {
    category: "technical",
    q: "How do I share my store link?",
    a: "Your store link is thorai.com/your-store-name. You can copy it from your dashboard and share it on WhatsApp, Instagram, Facebook, or anywhere online. Premium users can also use a custom domain.",
  },
  {
    category: "technical",
    q: "Can I export my customer data?",
    a: "Yes. From your dashboard under Customers, you can export your customer list as a CSV file. This includes order history, contact details, and purchase frequency. Your data is always yours.",
  },
];

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
        opacity: 0.06,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="faq-dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="white" fillOpacity="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#faq-dot-grid)" />
    </svg>
  );
}

export default function FAQPage() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Hero strip */}
      <div
        style={{
          position: "relative",
          paddingTop: "6rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          textAlign: "center",
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        <DotGrid />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 60% 60% at 50% 60%, rgba(94,106,210,0.1) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative", maxWidth: "56rem", margin: "0 auto" }}>
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
              Support
            </span>
          </div>
          <h1
            style={{
              fontWeight: 700,
              color: "var(--color-text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              margin: 0,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "1rem",
              color: "var(--color-text-secondary)",
              maxWidth: "36rem",
            }}
          >
            Everything you need to know about ThorAI, vendor setup, payments, and buyer safety.
          </p>
        </div>
      </div>

      {/* FAQ content with search */}
      <FAQSearch items={FAQ_DATA} heroSearch />
    </div>
  );
}
