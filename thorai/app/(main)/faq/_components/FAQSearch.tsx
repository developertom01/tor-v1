"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FAQAccordion, { type FAQItem } from "./FAQAccordion";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "vendors", label: "For Vendors" },
  { id: "buyers", label: "For Buyers" },
  { id: "payments", label: "Payments" },
  { id: "technical", label: "Technical" },
];

interface FAQSearchProps {
  items: FAQItem[];
  heroSearch?: boolean;
}

export default function FAQSearch({ items, heroSearch }: FAQSearchProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = items.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchQuery =
      query.trim() === "" ||
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All Questions";

  return (
    <div style={{ fontFamily: "var(--font-inter)" }}>
      {heroSearch && (
        <div
          style={{
            maxWidth: "36rem",
            margin: "0 auto",
            padding: "0 24px",
            marginTop: "-1.5rem",
            marginBottom: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={17}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--color-text-tertiary)",
                zIndex: 1,
              }}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCategory("all");
              }}
              placeholder="Search questions..."
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                paddingLeft: "2.75rem",
                paddingRight: "1.25rem",
                paddingTop: "0.875rem",
                paddingBottom: "0.875rem",
                fontSize: "0.9375rem",
                outline: "none",
                backgroundColor: "var(--color-surface)",
                border: query
                  ? "1px solid rgba(94,106,210,0.5)"
                  : "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter)",
                boxShadow: query ? "0 0 0 3px rgba(94,106,210,0.1)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "5rem 24px",
          display: "flex",
          gap: "3rem",
        }}
      >
        {/* Sidebar (desktop) */}
        <aside
          className="hidden lg:block"
          style={{
            width: "13rem",
            flexShrink: 0,
            position: "sticky",
            top: "5rem",
            alignSelf: "flex-start",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--color-text-tertiary)",
              marginBottom: "0.75rem",
            }}
          >
            Categories
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? items.length
                  : items.filter((i) => i.category === cat.id).length;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setQuery("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    textAlign: "left",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: active ? "var(--color-accent-glow)" : "transparent",
                    color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    fontWeight: active ? 600 : 400,
                    fontFamily: "var(--font-inter)",
                    transition: "background-color 0.15s, color 0.15s",
                    outline: active ? "1px solid rgba(94,106,210,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.5,
                      marginLeft: "0.5rem",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile category pills */}
          <div
            className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide lg:hidden"
            style={{
              marginLeft: "-1.5rem",
              paddingLeft: "1.5rem",
              marginRight: "-1.5rem",
              paddingRight: "1.5rem",
            }}
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setQuery("");
                  }}
                  style={{
                    flexShrink: 0,
                    padding: "0.5rem 1rem",
                    borderRadius: 9999,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                    backgroundColor: active ? "var(--color-accent)" : "transparent",
                    color: active ? "white" : "var(--color-text-secondary)",
                    fontWeight: active ? 600 : 400,
                    border: active
                      ? "none"
                      : "1px solid var(--color-border)",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Status line */}
          <p
            style={{
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            {query ? (
              <>
                <Search size={13} style={{ color: "var(--color-accent-light)" }} />
                Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </>
            ) : (
              <>
                <Filter size={13} style={{ color: "var(--color-accent-light)" }} />
                Showing: {activeCategoryLabel} ({filtered.length})
              </>
            )}
          </p>

          {/* Accordion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FAQAccordion items={filtered} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
