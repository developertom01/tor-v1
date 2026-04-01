"use client";

import { useState } from "react";
import { submitRegistration } from "@/lib/actions/registrations";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Shirt,
  Sparkles,
  Cpu,
  ShoppingBasket,
  Scissors,
  Home,
  Heart,
  Palette,
  Package,
  Upload,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  Pencil,
} from "lucide-react";
import AvatarOrb from "./AvatarOrb";
import StepSidebar from "./StepSidebar";
import BuildingScreen from "./BuildingScreen";
import SuccessScreen from "./SuccessScreen";

const TOTAL_STEPS = 10;
const easeCustom = [0.4, 0, 0.2, 1] as const;

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface Answers {
  name: string;
  businessName: string;
  categories: string[];
  country: string;
  city: string;
  logoFile: File | null;
  logoPreview: string | null;
  whatsapp: string;
  palette: string;
  payments: string[];
}

const CATEGORIES = [
  { id: "fashion", label: "Fashion & Clothing", icon: Shirt },
  { id: "beauty", label: "Beauty & Cosmetics", icon: Sparkles },
  { id: "electronics", label: "Electronics", icon: Cpu },
  { id: "food", label: "Food & Groceries", icon: ShoppingBasket },
  { id: "hair", label: "Hair & Wigs", icon: Scissors },
  { id: "home", label: "Home & Living", icon: Home },
  { id: "health", label: "Health & Wellness", icon: Heart },
  { id: "art", label: "Art & Crafts", icon: Palette },
  { id: "other", label: "Other", icon: Package },
];

const COUNTRIES = [
  { id: "GH", label: "Ghana", flag: "🇬🇭", code: "+233" },
  { id: "NG", label: "Nigeria", flag: "🇳🇬", code: "+234" },
  { id: "CI", label: "Côte d'Ivoire", flag: "🇨🇮", code: "+225" },
  { id: "SN", label: "Senegal", flag: "🇸🇳", code: "+221" },
  { id: "KE", label: "Kenya", flag: "🇰🇪", code: "+254" },
  { id: "ZA", label: "South Africa", flag: "🇿🇦", code: "+27" },
  { id: "OTHER", label: "Other", flag: "🌍", code: "+1" },
];

const PALETTES = [
  { id: "midnight-gold", name: "Midnight Gold", primary: "#0A0F2C", accent: "#F4A820", desc: "The ThorAI default" },
  { id: "forest", name: "Forest", primary: "#0F2E1A", accent: "#D4A843", desc: "Deep & earthy" },
  { id: "rose", name: "Rose", primary: "#2A0F1A", accent: "#E8A0A0", desc: "Warm & feminine" },
  { id: "slate", name: "Slate", primary: "#1A1A2E", accent: "#4A90E2", desc: "Modern & electric" },
];

const PAYMENT_METHODS = [
  { id: "paystack", label: "Paystack", icon: CreditCard },
  { id: "mtn", label: "MTN Mobile Money", icon: Smartphone },
  { id: "vodafone", label: "Vodafone Cash", icon: Smartphone },
  { id: "airteltigo", label: "AirtelTigo Money", icon: Smartphone },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
];

export default function RegisterFlow() {
  const [step, setStep] = useState(1);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    name: "",
    businessName: "",
    categories: [],
    country: "",
    city: "",
    logoFile: null,
    logoPreview: null,
    whatsapp: "",
    palette: "midnight-gold",
    payments: ["paystack"],
  });

  const canContinue = () => {
    switch (step) {
      case 1: return answers.name.trim().length > 1;
      case 2: return answers.businessName.trim().length > 1;
      case 3: return answers.categories.length > 0;
      case 4: return answers.country.length > 0 && answers.city.trim().length > 0;
      case 5: return true;
      case 6: return answers.whatsapp.trim().length > 5;
      case 7: return answers.palette.length > 0;
      case 8: return answers.payments.length > 0;
      case 9: return true;
      default: return false;
    }
  };

  const handleContinue = () => {
    if (!canContinue()) return;
    if (step === 9) {
      setIsBuilding(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitRegistration({
        ownerName: answers.name,
        businessName: answers.businessName,
        category: answers.categories[0] ?? "",
        locationCountry: answers.country,
        locationCity: answers.city || undefined,
        whatsapp: answers.whatsapp || undefined,
        logoUrl: answers.logoPreview || undefined,
        colorPalette: answers.palette || undefined,
        paymentMethods: answers.payments,
      });
      setIsBuilding(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (id: string) => {
    setAnswers((prev) => {
      const has = prev.categories.includes(id);
      if (has) return { ...prev, categories: prev.categories.filter((c) => c !== id) };
      if (prev.categories.length >= 2) {
        return { ...prev, categories: [prev.categories[1], id] };
      }
      return { ...prev, categories: [...prev.categories, id] };
    });
  };

  const togglePayment = (id: string) => {
    setAnswers((prev) => {
      const has = prev.payments.includes(id);
      return { ...prev, payments: has ? prev.payments.filter((p) => p !== id) : [...prev.payments, id] };
    });
  };

  const handleLogoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setAnswers((prev) => ({ ...prev, logoFile: file, logoPreview: url }));
  };

  const selectedCountry = COUNTRIES.find((c) => c.id === answers.country);
  const storeSlug = slugify(answers.businessName) || "your-store";

  if (isBuilding && !isComplete) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
        <BuildingScreen onComplete={() => { setIsBuilding(false); setIsComplete(true); }} />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
        <SuccessScreen storeSlug={storeSlug} />
      </div>
    );
  }

  const continueEnabled = canContinue();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <StepSidebar currentStep={step} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Progress bar */}
        <div
          style={{
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              flexShrink: 0,
              color: "var(--color-text-tertiary)",
            }}
          >
            Step {step} of {TOTAL_STEPS}
          </span>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 9999,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: 9999,
                backgroundColor: "var(--color-accent)",
              }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 2rem",
          }}
        >
          <div style={{ maxWidth: "36rem", width: "100%" }}>
            {/* Mobile orb label */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <AvatarOrb size="sm" showEqualizer={false} />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                ThorAI
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent)",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 32, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -32, scale: 0.97 }}
                transition={{ duration: 0.3, ease: easeCustom }}
              >
                <QuestionContent
                  step={step}
                  answers={answers}
                  setAnswers={setAnswers}
                  onToggleCategory={toggleCategory}
                  onTogglePayment={togglePayment}
                  onLogoFile={handleLogoFile}
                  storeSlug={storeSlug}
                  selectedCountry={selectedCountry}
                  onEditStep={(s) => setStep(s)}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nav buttons */}
        {step < 9 && (
          <div
            style={{
              padding: "1.25rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {step > 1 ? (
              <button
                onClick={handleBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.875rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-inter)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
              >
                <ChevronLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleContinue}
              disabled={!continueEnabled}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: 8,
                fontSize: "0.9375rem",
                fontWeight: 500,
                cursor: continueEnabled ? "pointer" : "not-allowed",
                fontFamily: "var(--font-inter)",
                backgroundColor: continueEnabled ? "var(--color-accent)" : "rgba(94,106,210,0.2)",
                color: continueEnabled ? "white" : "rgba(94,106,210,0.5)",
                border: "none",
                transition: "background-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                if (continueEnabled) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(94,106,210,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (continueEnabled) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 9 nav */}
        {step === 9 && (
          <div
            style={{
              padding: "1.25rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              onClick={handleBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-tertiary)",
                fontFamily: "var(--font-inter)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <div />
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Question Content ----
interface QuestionContentProps {
  step: number;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onToggleCategory: (id: string) => void;
  onTogglePayment: (id: string) => void;
  onLogoFile: (file: File) => void;
  storeSlug: string;
  selectedCountry: { id: string; label: string; flag: string; code: string } | undefined;
  onEditStep: (s: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

function QuestionContent({
  step,
  answers,
  setAnswers,
  onToggleCategory,
  onTogglePayment,
  onLogoFile,
  storeSlug,
  selectedCountry,
  onEditStep,
  onSubmit,
  isSubmitting,
  submitError,
}: QuestionContentProps) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    color: "var(--color-text-primary)",
    fontSize: "1.125rem",
    fontFamily: "var(--font-inter)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const questionStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    fontWeight: 600,
    fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
    color: "var(--color-text-primary)",
    marginBottom: "0.5rem",
    lineHeight: 1.2,
  };

  const subStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    color: "var(--color-text-secondary)",
    fontSize: "1rem",
    marginBottom: "2rem",
  };

  const onFocusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(94,106,210,0.6)";
    e.target.style.boxShadow = "0 0 0 3px rgba(94,106,210,0.12)";
  };

  const onBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  if (step === 1) {
    return (
      <div>
        <h2 style={questionStyle}>What&apos;s your name?</h2>
        <p style={subStyle}>Let&apos;s start simple. What should we call you?</p>
        <input
          style={inputStyle}
          value={answers.name}
          onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
          placeholder="Your full name..."
          autoFocus
          onFocus={onFocusInput}
          onBlur={onBlurInput}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h2 style={questionStyle}>What&apos;s your business called?</h2>
        <p style={subStyle}>This becomes your store name, so make it count.</p>
        <input
          style={inputStyle}
          value={answers.businessName}
          onChange={(e) => setAnswers((a) => ({ ...a, businessName: e.target.value }))}
          placeholder="e.g. Abena's Fashion Hub"
          autoFocus
          onFocus={onFocusInput}
          onBlur={onBlurInput}
        />
        <AnimatePresence>
          {answers.businessName.length >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              Your store will be at:{" "}
              <span style={{ color: "var(--color-accent-light)" }}>
                thorai.com/{storeSlug}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <h2 style={questionStyle}>What do you sell?</h2>
        <p style={subStyle}>Pick the category that fits best. Up to 2.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.75rem",
          }}
          className="sm:grid-cols-3"
        >
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const selected = answers.categories.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggleCategory(id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  border: selected
                    ? "1px solid rgba(94,106,210,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: selected ? "var(--color-accent-glow)" : "rgba(255,255,255,0.02)",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
              >
                <Icon
                  size={22}
                  style={{ color: selected ? "var(--color-accent-light)" : "var(--color-text-tertiary)" }}
                />
                <span
                  style={{
                    fontSize: "0.8125rem",
                    textAlign: "center",
                    fontWeight: 500,
                    color: selected ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <h2 style={questionStyle}>Where are you based?</h2>
        <p style={subStyle}>We&apos;ll set your default currency and payment methods based on your location.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.625rem",
            marginBottom: "1.5rem",
          }}
          className="sm:grid-cols-3"
        >
          {COUNTRIES.map(({ id, label, flag }) => {
            const selected = answers.country === id;
            return (
              <button
                key={id}
                onClick={() => setAnswers((a) => ({ ...a, country: id }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.625rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: selected
                    ? "1px solid rgba(94,106,210,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: selected ? "var(--color-accent-glow)" : "rgba(255,255,255,0.02)",
                  color: selected ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter)",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answers.country && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <input
                style={inputStyle}
                value={answers.city}
                onChange={(e) => setAnswers((a) => ({ ...a, city: e.target.value }))}
                placeholder="Your city or town"
                autoFocus
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div>
        <h2 style={questionStyle}>Do you have a logo?</h2>
        <p style={subStyle}>Upload your logo if you have one — or skip this and add it later.</p>

        {answers.logoPreview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={answers.logoPreview}
              alt="Logo preview"
              style={{
                width: 128,
                height: 128,
                borderRadius: "0.75rem",
                objectFit: "contain",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
            <button
              onClick={() => setAnswers((a) => ({ ...a, logoFile: null, logoPreview: null }))}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        ) : (
          <>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                padding: "2.5rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                border: "2px dashed rgba(255,255,255,0.12)",
                backgroundColor: "transparent",
                transition: "border-color 0.2s, background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(94,106,210,0.4)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onLogoFile(file);
                }}
              />
              <Upload size={28} style={{ color: "var(--color-text-tertiary)" }} />
              <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                Drop your logo here or click to browse
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", marginTop: "-0.5rem" }}>
                PNG, JPG or SVG — max 5MB
              </span>
            </label>
            <button
              onClick={() => {}}
              style={{
                marginTop: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                textDecoration: "underline",
                color: "var(--color-text-tertiary)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
            >
              Skip for now →
            </button>
          </>
        )}
      </div>
    );
  }

  if (step === 6) {
    return (
      <div>
        <h2 style={questionStyle}>What&apos;s your WhatsApp number?</h2>
        <p style={subStyle}>We&apos;ll send you order notifications here. You can change this later.</p>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0 1rem",
              fontSize: "0.875rem",
              flexShrink: 0,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRight: "none",
              borderRadius: "0.75rem 0 0 0.75rem",
              color: "var(--color-text-primary)",
              height: 54,
            }}
          >
            {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : "🌍 +1"}
          </div>
          <input
            style={{
              ...inputStyle,
              borderRadius: "0 0.75rem 0.75rem 0",
              flex: 1,
            }}
            type="tel"
            value={answers.whatsapp}
            onChange={(e) => setAnswers((a) => ({ ...a, whatsapp: e.target.value }))}
            placeholder="Phone number"
            onFocus={onFocusInput}
            onBlur={onBlurInput}
          />
        </div>
        <p
          style={{
            marginTop: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
          }}
        >
          <Lock size={11} />
          Your number is never shared publicly.
        </p>
      </div>
    );
  }

  if (step === 7) {
    return (
      <div>
        <h2 style={questionStyle}>Pick your store colors</h2>
        <p style={subStyle}>Choose a palette that feels like your brand. You can always change it later.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {PALETTES.map((p) => {
            const selected = answers.palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setAnswers((a) => ({ ...a, palette: p.id }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.75rem",
                  textAlign: "left",
                  cursor: "pointer",
                  border: selected
                    ? "1px solid rgba(94,106,210,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: selected ? "var(--color-accent-glow)" : "rgba(255,255,255,0.02)",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  {[p.primary, p.accent].map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      margin: 0,
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 8) {
    return (
      <div>
        <h2 style={questionStyle}>What payment methods do you accept?</h2>
        <p style={subStyle}>Select all that apply. You can add more from your dashboard.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
            const selected = answers.payments.includes(id);
            return (
              <button
                key={id}
                onClick={() => onTogglePayment(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1.125rem",
                  borderRadius: 9999,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: selected
                    ? "1px solid rgba(94,106,210,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: selected ? "var(--color-accent-glow)" : "rgba(255,255,255,0.02)",
                  color: selected ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  fontFamily: "var(--font-inter)",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.75rem",
            color: "var(--color-text-tertiary)",
          }}
        >
          Paystack requires a quick setup step after registration.
        </p>
      </div>
    );
  }

  if (step === 9) {
    const selectedPalette = PALETTES.find((p) => p.id === answers.palette);
    const summaryRows = [
      { label: "Name", value: answers.name },
      { label: "Business", value: answers.businessName },
      { label: "Category", value: answers.categories.join(", ") },
      { label: "Location", value: [answers.city, COUNTRIES.find((c) => c.id === answers.country)?.label].filter(Boolean).join(", ") },
      { label: "Logo", value: answers.logoPreview ? "Uploaded" : "Using text logo" },
      { label: "WhatsApp", value: answers.whatsapp ? `${selectedCountry?.code || ""} ${answers.whatsapp}` : "Not provided" },
      { label: "Color Palette", value: selectedPalette?.name ?? "—", palette: selectedPalette },
      { label: "Payments", value: answers.payments.join(", ") },
    ];

    return (
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            padding: "4px 10px",
            borderRadius: 100,
            backgroundColor: "var(--color-accent-glow)",
            border: "1px solid rgba(94,106,210,0.25)",
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--color-accent-light)",
            }}
          >
            Almost There
          </span>
        </div>
        <h2 style={{ ...questionStyle, marginBottom: "0.25rem" }}>
          Here&apos;s what we&apos;re building for you.
        </h2>

        {/* Summary card */}
        <div
          style={{
            marginTop: "2rem",
            borderRadius: "0.75rem",
            padding: "2rem",
            position: "relative",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={() => onEditStep(1)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-accent-light)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <Pencil size={11} />
            Edit answers
          </button>

          {summaryRows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: i < summaryRows.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                  color: "var(--color-text-tertiary)",
                }}
              >
                {row.label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {row.palette && (
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {[row.palette.primary, row.palette.accent].map((c, ci) => (
                      <div
                        key={ci}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.1)",
                          backgroundColor: c,
                        }}
                      />
                    ))}
                  </div>
                )}
                <span
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    textAlign: "right",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Launch button */}
        <button
          onClick={() => onSubmit()}
          disabled={isSubmitting}
          style={{
            width: "100%",
            marginTop: "2rem",
            padding: "1rem",
            borderRadius: 8,
            fontSize: "1rem",
            fontWeight: 600,
            backgroundColor: isSubmitting ? "rgba(94,106,210,0.5)" : "var(--color-accent)",
            color: "white",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: "var(--font-inter)",
            boxShadow: isSubmitting ? "none" : "0 4px 24px rgba(94,106,210,0.35)",
            transition: "background-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(94,106,210,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(94,106,210,0.35)";
            }
          }}
        >
          {isSubmitting ? "Submitting…" : "Launch My Store"}
        </button>
        {submitError && (
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8125rem",
              textAlign: "center",
              color: "#f87171",
            }}
          >
            {submitError}
          </p>
        )}
        <p
          style={{
            marginTop: "0.875rem",
            fontSize: "0.75rem",
            textAlign: "center",
            color: "var(--color-text-tertiary)",
          }}
        >
          By submitting, you agree to our Terms of Service.
        </p>
      </div>
    );
  }

  return null;
}
