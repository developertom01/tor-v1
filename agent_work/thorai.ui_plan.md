# UI Plan — ThorAI
**Generated:** 2026-04-01
**Store slug:** thorai
**Brand archetype:** Bold Aspirational Platform — Africa-forward, trustworthy, modern. The "Stripe for African vendors" energy: powerful infrastructure wrapped in warmth.

---

## Brand Personality

ThorAI is not a generic SaaS landing page wearing an African flag emoji. It is a platform born from a specific problem — the distrust that has calcified around online commerce in West Africa, where buyers fear scams and vendors fear invisibility. The brand exists to dissolve both fears simultaneously. The name itself is deliberate: Thor connotes power, reliability, a force that shows up. The AI suffix signals that this power is intelligent, not brute.

The visual identity should feel like walking into a well-designed bank in Accra that also has a startup energy — midnight blue walls, brass fixtures, clean glass. Not cold. Not corporate. There is warmth in the gold, weight in the navy, breathing room in the white. When a vendor from Kumasi or Lagos lands on this page, they should feel: "This was built for me, and it will work."

The differentiator against every generic e-commerce builder is the trust infrastructure. ThorAI does not just give you a website — it gives you a Verified Vendor Badge, fraud prevention, and a system buyers can trust. That triple promise (your store, your customers, their safety) is the emotional core of every section.

---

## Color Strategy

The ThorAI palette is described here in functional terms. No app globals.css is being prescribed — this plan describes visual intent so the builder can map it to the appropriate design system.

**Deep Navy (primary dark):** Used as the dominant background on the hero, "What We Ensure" security section, "How It Works" section, the full-width CTA panel, and the footer. Also used as the card background in dark-mode glass cards. Creates gravitas, authority, and visual continuity across the most important trust-building sections.

**White / Off-white (primary light):** Used for the Features section, FAQ section, and auth/register pages. These are the "working" sections where information density is high. Light backgrounds reduce cognitive load during reading and form interaction.

**Subtle Navy-tinted background (mid tone, approximately brand-50 equivalent):** Used for the Core Mission section and the Testimonials section. Not pure white — just enough tint to differentiate from the features section and create section rhythm. Suggests a blueprint, a draft being built.

**Gold / Amber accent:** Appears at every major conversion touchpoint and hierarchy landmark:
- Primary CTA button background ("Get Started Free") — solid gold fill, navy text
- All overline labels above section headings (uppercase, wide tracking, gold, small size)
- Hero headline second line gets gold color treatment
- Feature card icon backgrounds use a low-opacity gold tint with full-opacity gold icon
- Step number indicators in "How It Works" — large numerals in gold
- Verified badge icon and any trust seal graphic
- Active FAQ category pill — gold background, navy text
- Footer brand name in the mission statement
- Glow/halo effect behind the hero orb/avatar element: radial gradient in gold at ~15% opacity
- Horizontal rule / divider lines that separate overline from headline: 40px wide, 2px tall, gold

**Visual rhythm across the full page:**
Dark (Hero) → Light-tinted (Social Proof strip) → Navy-tinted (Core Mission) → White (Features) → Dark (What We Ensure) → Navy-tinted (How It Works) → White (Testimonials) → White (FAQ) → Dark (CTA Panel) → Dark (Footer)

This alternation prevents monotony and keeps dark sections feeling earned and dramatic rather than oppressive.

### Overlay strategy for background images and pattern layers

The hero uses a multi-layer overlay system:
- **Layer 1 (base flat tint):** `bg-[navy]/70` — ensures the abstract animated background is brand-tinted throughout
- **Layer 2 (directional gradient):** `bg-gradient-to-b from-[navy]/80 via-[navy]/50 to-[navy]/90` — top and bottom are darker (navbar and scroll indicator legibility), middle breathes
- **Layer 3 (pattern):** SVG inline pattern of interlocking geometric diamonds/triangles at 4% opacity white, absolutely positioned, full coverage, `pointer-events-none` — this is the African motif layer. It is visible but never distracting. It adds texture that reads as intentional craft, not decoration.

Dark content sections (What We Ensure, CTA) use only Layer 1 equivalent (flat navy background) plus the SVG pattern layer at 3% opacity.

---

## Typography Strategy

### Display / Headlines (h1) — Hero
- Font family: `Syne` (Google Fonts, weight 800) — geometric, confident, African-forward without being a cliché. Pairs authority with modernity.
- Size: `clamp(3rem, 6vw, 5.5rem)` — scales from 48px on mobile to 88px on large screens
- Weight: 800 (Extra Bold)
- Letter spacing: `-0.02em` (slightly tight — makes large display text feel cohesive, not stretched)
- Line height: 1.05
- Case: Mixed case — NOT all caps. First letter of each line capitalized naturally.
- Color pattern: Line 1 white, Line 2 gold (the line containing the core value proposition word), Line 3 white
- Text rendering: `text-rendering: optimizeLegibility` + `font-smooth: antialiased`

### Section headings (h2)
- Font family: `Syne`, weight 700
- Size: `clamp(2rem, 3.5vw, 3rem)` — 32px mobile to 48px desktop
- Weight: 700
- Letter spacing: `-0.015em`
- Line height: 1.1
- Color: White on dark sections, deep navy on light sections

### Section sub-headings (h3) — used inside cards and steps
- Font family: `Syne`, weight 600
- Size: `clamp(1.1rem, 1.5vw, 1.35rem)` — 18px to 22px
- Weight: 600
- Letter spacing: `-0.01em`

### Body / Taglines / Descriptions
- Font family: `Inter` (Google Fonts, weight 400/500) — the workhorse. Maximally legible at all sizes.
- Size: `clamp(1rem, 1.2vw, 1.125rem)` — 16px to 18px
- Weight: 400 for body, 500 for emphasis
- Line height: 1.7 (generous — this content is being read by people making a business decision)
- Color: `white/75` on dark sections, `navy/70` on light sections
- Max-width: `60ch` for standalone paragraphs, `52ch` for card descriptions

### Labels / Overlines (above section headings)
- Font family: `Inter`, weight 600
- Size: `0.75rem` (12px)
- Letter spacing: `0.2em` (very wide — this is the "signal" treatment)
- Case: ALL CAPS
- Color: Gold
- Usage: Every section heading has an overline. E.g.: "OUR MISSION", "FEATURES", "SECURITY", "HOW IT WORKS", "TESTIMONIALS", "FAQ"
- Display: flex row with a 32px gold line on the left (`border-t-2 border-gold w-8 self-center mr-3`) and the text after it

### Button typography
- Font family: `Inter`, weight 700
- Size: `0.875rem` (14px)
- Letter spacing: `0.12em`
- Case: ALL CAPS

---

## Animation Strategy

### Entrance animations (whileInView)
All non-hero content sections use Framer Motion `whileInView` with `once: true` and `amount: 0.2`. The base pattern:
- `initial={{ opacity: 0, y: 32 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}` — custom cubic bezier, feels deliberate not bouncy
- Grid children (feature cards, testimonial cards) stagger: `delay: index * 0.1` with a max cap of 0.4s so the last card doesn't feel forgotten
- Overline + heading pairs: overline enters first (`delay: 0`), heading enters second (`delay: 0.12`), body text third (`delay: 0.24`)

### Scroll-driven
- Hero background particle/dot grid: `useScroll` on the hero container. `y` transform from `0px` to `80px` on `scrollYProgress` 0 → 0.5. This creates a subtle parallax on the background layer only — content does not move.
- Hero text content: `opacity` maps from `1` to `0` between `scrollYProgress` 0.3 → 0.6. The headline fades out gracefully as you scroll past, not abruptly.
- "How It Works" step connector lines: `scaleX` from `0` to `1` driven by scroll, `transformOrigin: left`. Each line draws in as that step enters the viewport.

### Hero animated background
The background is not a canvas particle system (too heavy). It is an SVG-based dot grid with CSS animation:
- A 40×40px dot grid pattern as an SVG `<pattern>` element
- Each dot is 2px radius, `white` at 20% opacity
- The SVG element has a CSS `@keyframes float` that translates `Y` by `-20px` over 8 seconds, `ease-in-out`, `alternate`, `infinite` — creates a very slow vertical drift
- On top of this, 6 absolutely positioned geometric shapes (triangles and diamonds, SVG paths in gold at 8–15% opacity) at various sizes (24px to 80px) with individual staggered `float` animations at different speeds (6s, 9s, 12s, 7s, 11s, 8s) and different directions (Y up, Y down, slight rotation)
- These floating elements are `pointer-events-none`, `position: absolute`, distributed across the hero canvas away from the text column
- On mobile: only 3 of the 6 geometric shapes render (the 3 smallest)

### Conversational onboarding transitions
- Each question "card" enters with: `initial={{ opacity: 0, x: 32, scale: 0.97 }}` → `animate={{ opacity: 1, x: 0, scale: 1 }}` — a subtle slide-from-right with micro-scale
- Previous question exits with: `exit={{ opacity: 0, x: -32, scale: 0.97 }}`
- AnimatePresence wraps each question card
- AI avatar orb pulses: `scale: 1 → 1.04 → 1` over 2s, `repeat: Infinity` — a breathing animation
- Progress bar fills with: `scaleX` transition, `duration: 0.4`
- "Building your store" loading: A custom SVG ring with `strokeDashoffset` animated from full to zero over 3s with `ease: linear`

### Hover states
- Feature cards (dark glass): `whileHover={{ y: -6, transition: { duration: 0.2 } }}` + CSS `box-shadow` transitions from `0 0 0 rgba(gold,0)` to `0 8px 40px rgba(gold, 0.15)`. The gold glow appears on hover.
- Primary CTA button (gold): `whileHover={{ scale: 1.03 }}` + CSS `box-shadow` grows from `0 4px 16px rgba(gold, 0.3)` to `0 8px 32px rgba(gold, 0.5)`
- Secondary CTA (outlined): border-color transitions from `white/20` to `gold/60` over 0.25s; text transitions from `white/80` to `white`
- Testimonial cards: `whileHover={{ scale: 1.02 }}` subtle
- FAQ accordion trigger: background transitions from transparent to `navy/5` on light section, `white/5` on dark section
- Nav links: a 1px underline slides in from left using `::after` pseudo-element `scaleX: 0 → 1`

---

## Section Plans

---

### Section 1: Hero (Landing Page `/`)

**Purpose:** Establish brand authority in under 3 seconds. Communicate the core promise (AI-powered store, African trust). Capture the two primary user types (vendor wanting to sell, visitor wanting to understand). Drive to "Get Started Free."

**Layout:**
Full-viewport-height section (`min-h-screen`). Content is centered both vertically and horizontally inside a `max-w-4xl mx-auto px-6` container. The text column is centered on desktop — not left-aligned. This is a brand declaration, not a product demo. On screens wider than 1280px, max-w is `max-w-5xl` to allow the headline to breathe across the full width. Mobile: same centered layout, full-width, `px-5`.

The layout stack from top to bottom within the centered column:
1. Overline label (gold, "POWERED BY AI")
2. Headline (3 lines)
3. Subtext (1–2 sentences)
4. CTA button group (horizontal on desktop, stacked on mobile)
5. Stat strip / trust micro-strip (3 inline stats)

Below the stat strip, a centered scroll indicator arrow pulses at the very bottom of the viewport.

**Background:**
- Layer 0: Solid deep navy base (`bg-[#0A0F2C]` equivalent — the darkest point of the brand color scale)
- Layer 1: Dot grid SVG pattern (described in animation section) — `absolute inset-0 z-0 pointer-events-none overflow-hidden`
- Layer 2: 6 floating geometric shapes (triangles and diamonds in gold) — `absolute z-1 pointer-events-none`
- Layer 3: A large radial gradient, centered, going from `gold/12` at center to `transparent` at 60% — creates a warm glow behind the headline. `absolute inset-0 z-2 pointer-events-none`. This is the single most important "premium vs generic" detail.
- Layer 4: A gradient at the very bottom of the section: `bg-gradient-to-b from-transparent to-[navy-base]` over the last 120px — creates a seamless transition into the next section if the next section is also dark, or a clean fade.

**Overlay:** No image overlay needed — background is fully constructed from CSS/SVG layers.

**Headline copy:**
```
Put Your Business
Online With
Confidence.
```
"Online With" is the line that receives gold color treatment — it contains the core verb and the aspirational modifier. The period at the end of "Confidence." is intentional — it reads as a statement of fact, not a promise.
- Font: Syne 800
- Size: `clamp(3rem, 6vw, 5.5rem)`
- Line height: 1.05
- Letter spacing: `-0.02em`

**Overline / label above headline:**
- Text: "POWERED BY AI — BUILT FOR AFRICA"
- Color: Gold
- Font: Inter 600
- Size: `0.75rem`
- Letter spacing: `0.2em`
- Uppercase
- Displayed with the gold left-line treatment (32px line, 2px tall, gold, `mr-3`, `inline-flex items-center`)
- Margin below overline, above headline: `mb-5`

**Subheading / tagline:**
- Text: "ThorAI gives vendors across West Africa a fully verified online store in minutes — and gives buyers the confidence to shop without fear."
- Color: `white/70`
- Font: Inter 400
- Size: `clamp(1.05rem, 1.3vw, 1.2rem)`
- Max-width: `52ch`
- Margin: `mt-6 mb-10`
- Centered alignment (`text-center mx-auto`)

**CTAs:**
CTA 1: "GET STARTED FREE" — `href="/register"` — Style: solid gold background, deep navy text, `px-8 py-4`, `font-bold`, `text-sm`, `tracking-widest`, `uppercase`, `rounded-lg`, gold glow shadow on hover (described in hover states). Framer Motion `whileHover={{ scale: 1.03 }}`.

CTA 2: "SEE HOW IT WORKS" — `href="#how-it-works"` — Style: `border border-white/20 hover:border-gold/60 text-white/80 hover:text-white`, same padding and typography as CTA 1, `rounded-lg`, `bg-transparent`. Transition `duration-250`.

CTA group: `flex gap-4 justify-center flex-wrap mt-2`

**Supporting elements:**

Stat micro-strip below CTAs (`mt-12 pt-8 border-t border-white/10`):
- Layout: `flex gap-10 justify-center flex-wrap`
- 3 stats:
  - "500+ Vendors" — label: "Active stores across Africa"
  - "GHS 0" — label: "To get started today"
  - "24/7" — label: "AI assistant included"
- Each stat: number in `Syne 700 text-white text-2xl`, label in `Inter 400 text-white/50 text-xs mt-1`
- On mobile: 3 stats in a row, compressed text

Scroll indicator: `position: absolute bottom-8 left-1/2 -translate-x-1/2`. A `ChevronDown` lucide icon, `text-white/40`, size 24px, with a CSS `@keyframes bounce-soft` that translates `Y` from `0px` to `6px` and back, `1.8s ease-in-out infinite`.

**Scroll animation:**
The entire `motion.div` hero content wrapper has `useScroll` attached to the section ref. `opacity` maps `scrollYProgress` [0, 0.5] → [1, 0]. Background layers do NOT fade — only the content column.

---

### Section 2: Trusted By / Social Proof Strip

**Purpose:** Immediately after the hero, anchor trust. This section exists for 8 seconds of reading time — it either validates the hero claim or it doesn't. No fluff.

**Layout:**
Slim horizontal band. `py-12` padding. `max-w-6xl mx-auto px-6`. On desktop: a single row with a left label and logos/stats filling the rest. On mobile: the label on its own line, then the items in a 2-column grid.

Layout: `flex items-center gap-12 flex-wrap` on desktop. Label on the far left: "TRUSTED ACROSS AFRICA" in overline style (gold, caps, small). After the label, a `w-px h-8 bg-white/20` vertical divider. Then the stat/logo items.

**Background:**
`bg-[#0D1235]` — slightly lighter than the hero navy, but still dark. The section sits inside the dark zone before the rhythm shifts. `border-y border-white/8` provides subtle separation.

**Overlay:** None.

**Content:**
5 items in the trust strip. Since actual partner logos may not exist at launch, design for two modes:
- Mode A (no logos): 4 stat items + 1 quote item
  - "500+ Vendors" — "across Ghana & Nigeria"
  - "GHS 2M+" — "processed in transactions"
  - "4.9 / 5" — "average vendor rating"
  - "< 5 min" — "average store setup time"
  - Final item: `"ThorAI gave me a real business" — Abena K., Accra` in italics, `text-white/60`
- Mode B (with logos): 5 partner/press logo SVGs at `opacity-50`, on hover `opacity-80` with a transition

Each stat item: number in `Syne 700 text-white text-xl`, label in `Inter 400 text-white/50 text-xs mt-0.5`.

**Typography:**
Strip label: Inter 600, `0.7rem`, `tracking-widest`, gold, uppercase.
Stat numbers: Syne 700, `1.25rem`, white.
Stat labels: Inter 400, `0.75rem`, `white/50`.

**Animations:**
`whileInView` on the whole strip: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`, `duration: 0.8`. Each stat item staggers `delay: index * 0.08`.

---

### Section 3: Core Mission

**Purpose:** Make the visitor feel that ThorAI understands the real problem. This is the emotional anchoring section — not features, not how it works, just the WHY. Buyers and vendors both need to read this and feel seen.

**Layout:**
Two-column layout on desktop. `grid grid-cols-2 gap-20 items-center`. `max-w-6xl mx-auto px-6 py-28`. Left column: copy. Right column: visual. On mobile: single column, visual stacks below copy.

Left column content stack:
1. Overline: "OUR MISSION"
2. H2 headline (2–3 lines)
3. Body paragraph 1
4. Body paragraph 2
5. A "trust pair" stat element (two horizontally placed stats with a vertical divider between them)

Right column: A visual composition described below.

**Background:**
`bg-[#F4F5FB]` — a very slightly blue-tinted white. Not pure white. Just enough to differentiate from the pure white features section. On mobile this is `bg-white`.

**Overlay:** None.

**Content:**

Overline: "OUR MISSION" (gold, Inter 600, 0.75rem, tracking-widest, with left gold line)

H2 headline:
```
African commerce deserves
the trust it was built on.
```
Color: Deep navy. Syne 700. `clamp(2rem, 3vw, 2.75rem)`. `-0.015em` letter spacing.

Body paragraph 1 (`mt-6`):
"Online shopping in West Africa has a trust problem. Buyers have been burned by scams. Vendors struggle to be believed. ThorAI was built to fix both — not by accident, but by design."
Color: `navy/65`. Inter 400. `1.05rem`. Line-height 1.75.

Body paragraph 2 (`mt-4`):
"Every store on our platform carries a Verified Vendor Badge. Every transaction is monitored. Every buyer has recourse. This is not just an e-commerce builder. It's infrastructure for trust."
Color: `navy/65`. Same as above.

Trust pair stats (`mt-10 pt-8 border-t border-navy/10`):
- Layout: `flex gap-10`
- Stat 1: "2,000+" heading in Syne 700 gold `text-3xl`, label "vendor-buyer interactions protected" in Inter 400 `navy/55 text-sm`
- Vertical divider: `w-px h-12 bg-navy/15 self-center`
- Stat 2: "Zero" heading in Syne 700 gold `text-3xl`, label "reported fraud on verified stores" in Inter 400 `navy/55 text-sm`

Right column visual:
A composed illustration using only CSS and SVG — no stock photography. The composition:
- Background of the right column: a soft `bg-gradient-to-br from-[navy]/5 to-[gold]/5` rounded-2xl, `p-8 aspect-square` (square crop on desktop, 4:3 on mobile)
- Inside: a split composition. Left half shows a "vendor" abstraction: a small storefront SVG icon in gold, below it 3 product card rectangles stacked (simplified, just shapes), a "VERIFIED" badge overlay (gold border, checkmark)
- Right half: a "buyer" abstraction: a mobile phone outline SVG, inside it a simplified cart UI (just rectangles suggesting a shopping layout), below the phone a shield icon in gold with a checkmark
- A vertical dashed line (navy/20) separates the two halves with a small lock icon centered on the line
- Above the composition: "VENDOR" label (overline style, left-aligned) and "BUYER" label (right-aligned) separated by the split
- The whole composition has a subtle `box-shadow: inset 0 0 60px rgba(gold-color, 0.06)`

**Typography:** As described in content above.

**Animations:**
Left column: `whileInView`, `initial={{ opacity: 0, x: -40 }}`, `animate={{ opacity: 1, x: 0 }}`, `duration: 0.7`, `delay: 0`.
Right column: `whileInView`, `initial={{ opacity: 0, x: 40 }}`, `animate={{ opacity: 1, x: 0 }}`, `duration: 0.7`, `delay: 0.15`.
Trust pair stats: each stat `whileInView`, stagger `delay: 0.1`.

---

### Section 4: Features

**Purpose:** Show the 6 concrete capabilities. Every feature card must feel like a product — specific, valuable, not abstract. The goal is that a vendor reads all 6 and thinks "I need all of these."

**Layout:**
`bg-white`. `py-28`. `max-w-6xl mx-auto px-6`.

Header block (`text-center mb-16`):
- Overline: "FEATURES"
- H2: "Everything you need to\nsell with confidence."
- Subtext below H2: "One platform. Six tools that work together from day one." — Inter 400, `navy/60`, `text-base`, `mt-4 max-w-md mx-auto`

Card grid: `grid grid-cols-3 gap-6` on desktop, `grid-cols-2 gap-4` on tablet, `grid-cols-1 gap-4` on mobile.

Each card:
- Dimensions: flexible height, `p-8`
- Border: `border border-navy/8 rounded-2xl`
- Background: `bg-white` — clean white on white, differentiated only by border and shadow
- Shadow: `shadow-sm hover:shadow-lg transition-shadow duration-300`
- Icon container: `w-12 h-12 rounded-xl bg-[gold]/10 flex items-center justify-center mb-6` — low-opacity gold tint background, full-opacity gold lucide icon inside
- Title: Syne 600, `1.1rem`, `navy`, `mb-3`, no tracking
- Description: Inter 400, `navy/60`, `0.9rem`, line-height 1.65, `max-w-[48ch]`
- Bottom: a subtle gold underline accent — `mt-6 w-8 h-0.5 bg-gold` (just a 32px wide, 2px tall gold bar at card bottom)

The 6 feature cards:

1. **"Fully Customized Website"**
   - Icon: `Store` (lucide)
   - Title: "Fully Customized Website"
   - Description: "Your brand, your rules. Choose your colors, upload your logo, set your layout. No code. No designer. Your store looks exactly how you imagined it."

2. **"Personal AI Marketing Assistant"**
   - Icon: `BrainCircuit` (lucide)
   - Title: "AI Marketing Assistant"
   - Description: "Your 24/7 growth partner. Get AI-generated product descriptions, promotion ideas, and customer messaging — all tailored to your business and your buyers."

3. **"Easy Payments"**
   - Icon: `CreditCard` (lucide)
   - Title: "Easy Payments"
   - Description: "Get paid, hassle-free. Accept Paystack, MTN Mobile Money, and more. Funds land in your account directly. No middlemen. No delays."

4. **"Receipt Generation & Notifications"**
   - Icon: `Receipt` (lucide)
   - Title: "Receipts & Notifications"
   - Description: "Automated, professional. Every order generates a receipt and triggers customer notifications instantly. Your buyers always know what's happening."

5. **"Customer Tracking"**
   - Icon: `Users` (lucide)
   - Title: "Easy Customer Tracking"
   - Description: "Know your customers. See who bought what, when, and how often. Understand your top buyers and re-engage them when it matters."

6. **"Verified Vendor Badge"**
   - Icon: `ShieldCheck` (lucide)
   - Title: "Verified Vendor Badge"
   - Description: "Trust you can see. After identity verification, your store displays the ThorAI Verified badge — a signal that buyers across Africa recognize and trust."
   - This card gets a subtle special treatment: `border-gold/30 bg-[gold]/3` — the slightest gold tint on the border and background. Not garish. Just distinguished.

**Animations:**
Section header: `whileInView`, fade-up, `delay: 0`.
Card grid: each card `whileInView`, `initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`, `delay: index * 0.08`, `duration: 0.55`.
Card hover: `whileHover={{ y: -6 }}` + CSS shadow transition + gold glow on the icon container (`box-shadow: 0 0 16px rgba(gold, 0.2)` on hover).

---

### Section 5: What We Ensure (Security)

**Purpose:** Address the #1 objection: "Is this safe?" Both for vendors (will I get paid, will my data be secure) and buyers (is the vendor real, can I trust the platform). This section must feel like a statement of commitment, not a list of checkboxes.

**Layout:**
Full-bleed dark section. `bg-[#080C24]` — one shade darker than the hero navy, the darkest section on the page. `py-32`. Max-content: `max-w-6xl mx-auto px-6`.

Header block (`text-center mb-20`):
- Overline: "SECURITY & TRUST"
- H2: "We protect everyone\nin the transaction."
- Subtext: "Fraud prevention, identity verification, and buyer guarantees — built into every store from day one."

Main content: Two-column structure inside a large card. `grid grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/8`.

Left column — "For Vendors":
- Background: `bg-white/4` (glass card treatment — `backdrop-blur-sm`)
- `p-12`
- Small overline at top: "FOR VENDORS" in gold, `0.7rem`, tracking-widest
- H3: "Your store, protected." — Syne 600, white, `1.4rem`
- Below H3: 4 trust points, each as an `<li>` equivalent row:
  - Icon (16px lucide, gold) + Text
  - Row 1: `ShieldCheck` — "Identity verification before your store goes live"
  - Row 2: `Lock` — "End-to-end encrypted payment processing"
  - Row 3: `BadgeCheck` — "Verified Vendor Badge shown to all buyers"
  - Row 4: `AlertCircle` — "Dispute resolution support included"
  - Each row: `flex items-start gap-3 mb-5`. Icon in `text-gold mt-0.5`. Text in Inter 400, `white/75`, `0.95rem`, line-height 1.6.
- Bottom of column: A decorative element — a stylized shield SVG outline, `opacity-5`, `position: absolute bottom-6 right-6 w-32` — watermark effect.

Right column — "For Buyers":
- Background: `bg-[navy-midtone]/60` — slightly different tint than left
- Same `p-12`
- Overline: "FOR BUYERS" in gold
- H3: "Shop with certainty." — Syne 600, white
- 4 trust points:
  - `UserCheck` — "Only verified vendors can sell on ThorAI"
  - `CreditCard` — "Secure payment gateway — your card data is never stored"
  - `MessageSquare` — "Direct vendor contact before and after purchase"
  - `RefreshCw` — "Clear return and dispute process for every order"
- Same styling as vendor column.

Below the two-column card, a centered "animated trust indicator" strip:
- `mt-16 flex gap-16 justify-center flex-wrap`
- 3 animated counter elements:
  - Counter 1: `0` counts up to `99.8` with a `%` suffix — label: "Uptime SLA"
  - Counter 2: `0` counts up to `256` with a `-bit` suffix — label: "Encryption standard"
  - Counter 3: `0` counts up to `24` with a `/7` suffix — label: "Fraud monitoring"
- Each counter: number in Syne 800 gold `text-4xl`, label in Inter 400 white/50 `text-sm mt-2`
- Counter animation: `useInView` triggers a `useEffect` that increments from 0 to target over 1.5s with an `easeOut` curve
- Below each counter: a thin horizontal gold line, `w-12 h-px bg-gold mx-auto mt-3`

**SVG pattern layer:** The African geometric pattern at `3% opacity white` is present here as in the hero.

**Typography:**
H2: white, Syne 700, `clamp(2rem, 3vw, 2.75rem)`.
Column H3: white, Syne 600, `1.4rem`.
Trust point text: `white/75`, Inter 400, `0.95rem`.

**Animations:**
Section header: `whileInView` fade-up.
Left column card: `whileInView`, `initial={{ opacity: 0, x: -32 }}`, `animate={{ opacity: 1, x: 0 }}`, `duration: 0.7`.
Right column card: `whileInView`, `initial={{ opacity: 0, x: 32 }}`, `animate={{ opacity: 1, x: 0 }}`, `duration: 0.7`, `delay: 0.1`.
Counter strip: triggers on `whileInView` — the `useInView` hook fires the counter animation.
Each trust point row: staggers `delay: index * 0.07` inside its column's animation.

---

### Section 6: How It Works

**Purpose:** Remove the fear of technical complexity. The 3-step flow must feel achievable in one sitting. The visual should make the process look effortless, not overwhelming.

**Layout:**
`bg-[#F0F2FA]` — the same blue-tinted off-white as the Core Mission section. `py-28`. `max-w-5xl mx-auto px-6`.

Header block (`text-center mb-20`):
- Overline: "HOW IT WORKS"
- H2: "Your store, live in\nunder 5 minutes."
- Subtext: "Three steps. No technical knowledge required. We handle everything else."

Steps layout: `grid grid-cols-3 gap-0 relative` on desktop. On mobile: `grid-cols-1 gap-12`.

Between steps on desktop: connector lines (horizontal dashed lines with arrow endpoints) rendered as absolutely positioned `<div>` elements, `border-t-2 border-dashed border-[gold]/30`, positioned at the vertical center of the step number circles. Each line has a `scaleX` scroll animation.

Each step:
- Layout: `flex flex-col items-center text-center px-6`
- Step number: A large circle, `w-16 h-16 rounded-full border-2 border-gold bg-white shadow-md flex items-center justify-center`. Inside: the number in Syne 800 gold `text-2xl`. On hover: `bg-gold` background, number becomes `text-navy`.
- Below circle: `mt-8`
- Step title: Syne 700, navy, `1.25rem`, `mb-3`
- Step description: Inter 400, `navy/60`, `0.95rem`, line-height 1.7, `max-w-56`
- Step icon (below text, `mt-6`): A small lucide icon in `navy/30`, 20px

Step content:

Step 1 — "Register":
- Icon: `UserPlus`
- Title: "Register your business"
- Description: "Tell our AI assistant about you and your business. Takes 2 minutes. No paperwork."

Step 2 — "Set Up Your Store":
- Icon: `Store`
- Title: "Get your store"
- Description: "ThorAI builds your branded store automatically. Customize it to match your vision."

Step 3 — "Start Selling":
- Icon: `TrendingUp`
- Title: "Start selling"
- Description: "Share your store link. Accept payments. Track orders. Your AI assistant does the rest."

Below the 3 steps, a centered CTA: "GET STARTED NOW" → `/register`. Gold button style. `mt-16`.

**Animations:**
Header: `whileInView` fade-up.
Step 1: `whileInView`, `initial={{ opacity: 0, y: 32 }}`, `delay: 0`.
Step 2: same, `delay: 0.15`.
Step 3: same, `delay: 0.3`.
Connector line 1: `scaleX` driven by scroll, `transformOrigin: left`, triggers when step 2 enters viewport.
Connector line 2: same, triggers when step 3 enters viewport.
Step number circle: `whileHover={{ scale: 1.08, backgroundColor: gold, color: navy }}`, `transition: { duration: 0.2 }`.

---

### Section 7: Testimonials

**Purpose:** Social proof with faces, names, and specific outcomes. Not vague "great platform!" quotes. Each testimonial references a specific benefit.

**Layout:**
`bg-white`. `py-28`. `max-w-6xl mx-auto px-6`.

Header block (`text-center mb-16`):
- Overline: "TESTIMONIALS"
- H2: "Vendors who trusted\nthe process."
- No subtext — let the testimonials speak.

Card grid: `grid grid-cols-3 gap-6` on desktop, `grid-cols-1 gap-6` on mobile.

Each testimonial card:
- `p-8 rounded-2xl border border-navy/8 bg-white shadow-sm`
- Top: 5 star icons (`Star` lucide, gold, 14px, `fill-gold`) in a row — `flex gap-1 mb-6`
- Quote: Inter 400 italic, `navy/80`, `1rem`, line-height 1.75, `mb-8`. Maximum 3 sentences. Wrapped in `"..."` typographic quotes.
- Divider: `border-t border-navy/8 pt-6`
- Author row: `flex items-center gap-4`
  - Avatar: `w-12 h-12 rounded-full bg-[gold]/15` placeholder (or actual image if available). If placeholder: first initial in Syne 700 gold, centered.
  - Name: Inter 600, navy, `0.95rem`
  - Below name: business name in Inter 400, `navy/50`, `0.85rem`
  - Business type badge (far right, `ml-auto`): a small pill `px-3 py-1 rounded-full bg-[gold]/10 text-[gold-dark] text-xs font-semibold` — e.g., "Fashion", "Beauty", "Electronics"

The 3 testimonial cards:

Card 1:
- Quote: "I'd been selling on Instagram for 2 years and couldn't get people to trust me. The ThorAI Verified badge changed everything. My first week with a store, I made more than the previous month."
- Name: Abena Kusi
- Business: Abena's Boutique, Accra
- Badge: "Fashion"

Card 2:
- Quote: "Setting it up felt like chatting with a friend. I answered a few questions and my store was live before I finished my tea. The payment integration alone is worth everything."
- Name: Chukwuemeka Obi
- Business: EM Gadgets, Lagos
- Badge: "Electronics"

Card 3:
- Quote: "My customers now get automatic receipts and updates. They trust the process more, and I spend less time answering 'has my order shipped?' — the platform handles it."
- Name: Fatima Al-Hassan
- Business: Fatima Cosmetics, Kumasi
- Badge: "Beauty"

**Animations:**
Header: `whileInView` fade-up.
Card 1: `whileInView`, `delay: 0`.
Card 2: `whileInView`, `delay: 0.12`.
Card 3: `whileInView`, `delay: 0.24`.
Card hover: `whileHover={{ scale: 1.02 }}`, subtle.

---

### Section 8: FAQ (on Landing Page `/`)

**Purpose:** Pre-empt objections. Handle the top 6 questions so the vendor doesn't have to find the answer elsewhere and lose momentum.

**Layout:**
`bg-white`. `py-28`. `max-w-3xl mx-auto px-6`.

Header block (`text-center mb-14`):
- Overline: "FAQ"
- H2: "Questions we get\nall the time."

Accordion list: `flex flex-col gap-2`. Each accordion item:
- Wrapper: `border border-navy/10 rounded-xl overflow-hidden`
- Trigger row: `flex items-center justify-between px-6 py-5 cursor-pointer bg-white hover:bg-[navy]/3 transition-colors duration-200`
  - Question text: Inter 600, navy, `1rem`
  - Icon: `ChevronDown` lucide, 18px, `navy/50`. Rotates `0deg → 180deg` when open, `transition: transform 0.3s ease`
- Answer panel: Framer Motion `AnimatePresence` + `motion.div` with `initial={{ height: 0, opacity: 0 }}` → `animate={{ height: "auto", opacity: 1 }}`, `transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }`. Inner `p-6 pt-0 text-[navy]/65 text-sm leading-relaxed`.

The 6 FAQ items:

1. Q: "Is ThorAI free to use?"
   A: "Getting started is completely free. You can register, set up your store, and publish it at no cost. We offer premium plans for vendors who want advanced analytics, custom domains, and priority support."

2. Q: "Do I need to know how to code or build websites?"
   A: "Not at all. Our AI assistant guides you through setup conversationally — like a chat. You answer simple questions and ThorAI builds your store automatically. No technical knowledge required."

3. Q: "How do I receive payments?"
   A: "Payments go through Paystack and MTN Mobile Money — two of the most trusted payment processors in West Africa. Funds are deposited directly to your account. ThorAI never holds your money."

4. Q: "What is the Verified Vendor Badge?"
   A: "After you complete identity verification (a quick process), your store displays the ThorAI Verified badge. This tells buyers that your business is real, verified, and trustworthy — which increases your conversion rate significantly."

5. Q: "Can buyers trust that their purchases are safe?"
   A: "Yes. All transactions on ThorAI are processed through encrypted, PCI-compliant payment gateways. Buyer data is never shared or sold. Every verified store is monitored for fraudulent activity."

6. Q: "How long does store setup take?"
   A: "Most vendors complete setup in under 5 minutes. The conversational setup process is designed to be fast and stress-free. Your store is live the moment you finish."

**Animations:**
Header: `whileInView` fade-up.
Each accordion item: `whileInView`, `initial={{ opacity: 0, y: 16 }}`, `delay: index * 0.06`, `duration: 0.45`.
Answer expand: `AnimatePresence` + `motion.div` height animation as described.

---

### Section 9: CTA Panel

**Purpose:** Catch everyone who scrolled to the bottom without clicking. This is the final conversion surface. It must feel like a closing argument, not a repeating banner.

**Layout:**
Full-width dark panel. `bg-[#0A0F2C]`. `py-32`. Full-bleed (no max-width container for the background — content inside is `max-w-4xl mx-auto px-6 text-center`).

The SVG geometric pattern layer at `3% opacity` is present.

A large radial gradient glow behind the content: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(gold, 0.10) 0%, transparent 70%)`. Absolutely positioned, `pointer-events-none`.

Content stack:
1. Overline: "GET STARTED TODAY"
2. H2: "Your store is\nwaiting for you."
3. Subtext: "Join 500+ vendors across Africa who chose to build their business the right way."
4. CTA group: same structure as hero CTAs
   - Primary: "LAUNCH MY STORE FREE" → `/register`
   - Secondary: "TALK TO US" → `/contact` (or a WhatsApp link)
5. Below CTAs: a single row of 3 small trust marks in `white/40 text-xs flex gap-6 justify-center mt-8`:
   - `ShieldCheck` icon + "No credit card required"
   - `Zap` icon + "Live in under 5 minutes"
   - `BadgeCheck` icon + "Free forever plan included"

**Animations:**
All content: `whileInView`, staggered fade-up. H2 gets `delay: 0.1`.
The radial glow: `whileInView`, `initial={{ scale: 0.6, opacity: 0 }}`, `animate={{ scale: 1, opacity: 1 }}`, `duration: 1.2`, `ease: "easeOut"`.

---

### Section 10: Footer

**Purpose:** Navigation, legal, social links, and the brand's mission statement as the final word.

**Layout:**
`bg-[#06091E]` — deepest navy, below the CTA panel. `pt-20 pb-12`. `max-w-6xl mx-auto px-6`.

Top section: `grid grid-cols-4 gap-12` on desktop, `grid-cols-2 gap-8` on tablet, `grid-cols-1 gap-8` on mobile.

Column 1 — Brand:
- ThorAI logotype (text logo: "Thor" in Syne 800 white + "AI" in Syne 800 gold)
- Mission tagline below: "Putting African businesses online with confidence." — Inter 400, `white/50`, `0.875rem`, line-height 1.6, `mt-3 max-w-52`
- Social icons row below (`mt-6 flex gap-3`): Twitter/X, Instagram, LinkedIn, WhatsApp — lucide icons, `white/40 hover:white/90`, 18px, transition

Column 2 — Platform:
- Heading: "PLATFORM" — overline style but smaller, `white/40`
- Links: "Start for free", "Features", "How it works", "Pricing", "FAQ" — Inter 400, `white/60 hover:white`, `0.9rem`, `mb-3`

Column 3 — Company:
- Heading: "COMPANY"
- Links: "About ThorAI", "Blog", "Careers", "Press", "Contact"

Column 4 — Trust & Legal:
- Heading: "TRUST"
- Links: "Privacy Policy", "Terms of Service", "Vendor Verification", "Buyer Protection", "Security"

Bottom bar (`mt-16 pt-8 border-t border-white/8 flex items-center justify-between flex-wrap gap-4`):
- Left: "© 2026 ThorAI. All rights reserved." — `white/35`, Inter 400, `0.8rem`
- Right: "Built for Africa. 🌍" — Same style. (This is the one place an emoji is appropriate and intentional — it is brand copy, not UI decoration.)

---

## Page 2: Auth Page (`/auth`)

### Auth Layout

**Purpose:** Sign in or sign up with maximum elegance and minimum friction. No distractions. Brand presence without noise.

**Layout:**
Two-panel layout on desktop. `min-h-screen flex`.

Left panel (40% width on desktop, hidden on mobile):
- Background: `bg-[#0A0F2C]` with the SVG dot grid at 8% opacity
- The floating geometric shapes (5 of the 6 from the hero, same sizes, same animations but slower — 15s, 18s, 12s cycles)
- Centered vertically and horizontally:
  - ThorAI logotype (large, Syne 800, "Thor" white "AI" gold, `text-3xl`)
  - Below: a single line quote: "Your business. Verified. Trusted." — Inter 400 italic, `white/50`, `text-sm`, `mt-4`
  - Below: the 3 trust micro-stats (same as hero stat strip): 500+ vendors, Zero reported fraud, 5 min setup — arranged vertically with divider lines, smaller sizing
- At the very bottom of the left panel: "Join Africa's verified marketplace" — `white/25`, `text-xs`

Right panel (60% width on desktop, full width on mobile):
- Background: `bg-white`
- Content: `max-w-sm mx-auto flex flex-col justify-center min-h-screen px-8 py-16`

Right panel content:

Top: ThorAI logotype (small version, `text-xl`) — only visible on mobile (hidden on desktop since left panel shows it).

Tab switcher:
- Two buttons: "Sign In" and "Sign Up"
- Layout: `flex bg-navy/6 rounded-xl p-1 mb-8`
- Active tab: `bg-white rounded-lg shadow-sm text-navy font-semibold text-sm px-6 py-2.5 transition-all duration-200`
- Inactive tab: `text-navy/50 text-sm px-6 py-2.5 hover:text-navy/80 transition-colors`

**Sign Up form:**
- Fields in order:
  1. Full Name — `input` with floating label animation (`label` positioned absolute, moves up when input is focused/has value)
  2. Email address
  3. Password (with `Eye`/`EyeOff` lucide toggle for visibility)
- All inputs: `w-full border border-navy/15 rounded-xl px-4 py-3.5 text-navy placeholder-navy/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-[gold]/20 transition-all text-sm`
- Floating label: `absolute left-4 transition-all duration-200 pointer-events-none`. When input empty/unfocused: `top-3.5 text-navy/40 text-sm`. When focused/filled: `top-1 text-[gold] text-xs font-medium`.
- Password strength indicator below password field: 4-segment bar, segments fill gold from left to right based on password strength criteria. Each segment: `h-1 rounded-full bg-navy/10`. Filled: `bg-gold`. `transition-colors duration-300`.
- Submit button: full-width gold button, "CREATE ACCOUNT", same style as primary CTA. `mt-6`.
- OAuth divider: `mt-6 flex items-center gap-4`. `<hr className="flex-1 border-navy/10">` + "or continue with" in `navy/40 text-xs` + `<hr>`.
- OAuth buttons: `grid grid-cols-2 gap-3 mt-4`
  - Google: `border border-navy/12 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-navy/3 transition-colors text-navy text-sm font-medium`. Google "G" SVG logo (colored, 18px).
  - Apple: Same style but Apple icon (lucide doesn't have Apple — use inline SVG of Apple logo, `fill-navy`, 16px).
- Terms note: `mt-4 text-center text-navy/40 text-xs`. "By creating an account you agree to our Terms of Service and Privacy Policy."

**Sign In form:**
- Fields: Email, Password (with visibility toggle)
- "Forgot password?" link: aligned right, below password field. `text-gold text-xs font-medium hover:underline`.
- Submit: "SIGN IN" gold full-width button.
- OAuth section: same as sign up.

**Animations:**
Tab switch: `AnimatePresence` with `mode="wait"`. Exiting form: `exit={{ opacity: 0, x: -10 }}`. Entering form: `initial={{ opacity: 0, x: 10 }}`, `animate={{ opacity: 1, x: 0 }}`, `duration: 0.2`.
Form fields: `whileInView` stagger `delay: index * 0.05` on mount.

---

## Page 3: Business Registration — Conversational Flow (`/register`)

### Registration Layout

**Purpose:** Make business setup feel like a conversation, not a bureaucratic form. The vendor should feel helped, not interrogated. By the end, they should feel excited.

**Overall page structure:**
`min-h-screen bg-[#0A0F2C]` — full dark navy background throughout. This contrasts sharply with the auth page white and signals: "You are entering the product."

Layout: `flex min-h-screen`.

Left sidebar (desktop only, 320px wide, `hidden lg:flex flex-col`):
- Background: `bg-white/3 border-r border-white/8`
- ThorAI logo at top (`p-8`)
- Below logo: the AI avatar/orb described below
- Below orb: step list (shows completed steps with checkmarks, current step highlighted)
- At bottom: "Need help?" link → WhatsApp number. `text-white/30 text-xs`.

Main area (`flex-1 flex flex-col`):
- Top bar: progress indicator
- Center: question card area
- Bottom: navigation controls

**Progress indicator (top of main area):**
- `px-8 py-6 flex items-center gap-4`
- Step counter: "Step 3 of 10" — Inter 400, `white/40`, `text-sm`
- Progress bar: `flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden`. Inner fill: `bg-gold transition-all duration-500` with `width` as percentage.
- On mobile: the step list is replaced by this top bar only.

**AI Avatar / Orb:**

The orb is the emotional centerpiece of the left sidebar on desktop, and appears as a smaller version in the top-left of the main area on mobile.

Desktop orb specs:
- `w-24 h-24 mx-auto mt-8 mb-6 relative`
- Outer ring: `absolute inset-0 rounded-full border border-gold/20 animate-[spin_12s_linear_infinite]` — very slow rotating ring
- Middle ring: `absolute inset-2 rounded-full border border-gold/15 animate-[spin_8s_linear_infinite_reverse]` — counter-rotating
- Inner filled sphere: `absolute inset-4 rounded-full bg-gradient-to-br from-[navy-mid] to-[navy-dark]` with `box-shadow: 0 0 30px rgba(gold, 0.25), inset 0 0 20px rgba(gold, 0.08)`
- Inside the sphere: a small "T" lettermark in Syne 700 gold, `text-sm`, centered
- Breathing animation: `scale: 1 → 1.04 → 1`, `duration: 2s`, `repeat: Infinity`, `ease: easeInOut`

The orb "speaks" — when a question is displayed, a small animated equalizer-style pulse appears below the orb (3 bars of varying heights that animate up-down, suggesting the AI is talking). `flex gap-0.5 justify-center items-end h-4`. Each bar: `w-1 bg-gold rounded-full`. Heights animate on `keyframes` at different phases.

**Left sidebar step list:**
Each step as a row: `flex items-center gap-3 px-6 py-2.5`.
- Completed: `CheckCircle` lucide, 16px, gold. Step name in Inter 400, `white/50`, `text-sm`, line-through.
- Current: Filled circle with step number in Syne 700 gold. Step name in Inter 600, white, `text-sm`.
- Upcoming: Empty circle outline `white/20`. Step name in Inter 400, `white/25`, `text-sm`.

**Question card area (center of main area):**

`flex-1 flex items-center justify-center px-8 py-12`.

The "stage" — a centered area `max-w-xl w-full`.

Above the question: a small line showing who is "speaking":
`flex items-center gap-2 mb-6`. Small orb (mobile-sized version, 32px), then "ThorAI" in Inter 500 white `text-sm`, then a gold dot as active indicator.

Question card: `AnimatePresence mode="wait"`. Each question wrapped in `motion.div`:
- `initial={{ opacity: 0, x: 32, scale: 0.97 }}`
- `animate={{ opacity: 1, x: 0, scale: 1 }}`
- `exit={{ opacity: 0, x: -32, scale: 0.97 }}`
- `transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}`

Question text (inside card): Syne 600, white, `clamp(1.4rem, 2.5vw, 1.9rem)`, `mb-8`. This is large — it fills the space. The question IS the content.

Answer input area: varies by question type (described per question below).

**Navigation buttons (bottom of main area):**
`px-8 py-6 flex items-center justify-between border-t border-white/8`.
- Left: "← Back" button (if not first step). `text-white/40 hover:text-white/70 text-sm flex items-center gap-2 transition-colors`. `ChevronLeft` icon.
- Right: "Continue →" or "Next" button. Gold outlined (NOT filled — the filled gold is for final submission). `border border-gold text-gold px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gold hover:text-navy transition-all duration-200`.

**The 10 questions:**

**Question 1: "What's your name?"**
- Sub-prompt (below question, `white/50 text-base mb-8`): "Let's start simple. What should we call you?"
- Input: A single large text input. `w-full bg-white/6 border border-white/15 focus:border-gold rounded-2xl px-6 py-4 text-white text-lg placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all`. Placeholder: "Your full name..."
- Continue button: enabled when `value.trim().length > 1`.

**Question 2: "What's your business called?"**
- Sub-prompt: "This becomes your store name, so make it count."
- Same input style. Placeholder: "e.g. Abena's Fashion Hub"
- Below input (after 2+ chars typed): a preview line appears with animation — `motion.div`, `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`. Shows: "Your store will be at: `thorai.com/[slug]`" in `white/40 text-sm`. The slug is auto-generated from the business name (lowercase, hyphenated) and shown live.

**Question 3: "What do you sell?"**
- Sub-prompt: "Pick the category that fits best."
- Answer: Category picker grid. `grid grid-cols-2 gap-3 sm:grid-cols-3`.
- 9 categories as selectable cards:
  - Fashion & Clothing (`Shirt` icon)
  - Beauty & Cosmetics (`Sparkles` icon)
  - Electronics (`Cpu` icon)
  - Food & Groceries (`ShoppingBasket` icon)
  - Hair & Wigs (`Scissors` icon)
  - Home & Living (`Home` icon)
  - Health & Wellness (`Heart` icon)
  - Art & Crafts (`Palette` icon)
  - Other (`Package` icon)
- Each card: `border border-white/15 rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:border-gold/50 hover:bg-white/5`.
- Selected state: `border-gold bg-[gold]/10`. Icon color switches from `white/50` to `gold`. Label switches from `white/60` to `white`.
- Icon: lucide, 24px.
- Label: Inter 500, `text-sm`.
- Multi-select allowed (vendor may sell in 2 categories). Max 2. Third click de-selects the oldest.

**Question 4: "Where are you based?"**
- Sub-prompt: "We'll set your default currency and payment methods based on your location."
- Two separate inputs in sequence: Country first, then City.
- Country: a large pill-button grid of 6 primary countries + "Other":
  - Ghana 🇬🇭, Nigeria 🇳🇬, Côte d'Ivoire 🇨🇮, Senegal 🇸🇳, Kenya 🇰🇪, South Africa 🇿🇦, Other
  - Pills: `border border-white/15 rounded-xl px-5 py-3 text-sm flex items-center gap-2 cursor-pointer hover:border-gold/50 transition-all`.
  - Selected: `border-gold bg-[gold]/10 text-white`.
  - Flag emoji is acceptable here as it is content, not UI decoration.
- After country selected: `AnimatePresence` reveals a city text input with `initial={{ opacity: 0, height: 0 }}` → `animate={{ opacity: 1, height: "auto" }}`. Placeholder: "Your city or town".

**Question 5: "Do you have a logo?"**
- Sub-prompt: "Upload your logo if you have one — or skip this and add it later. We'll use your brand name as text for now."
- Upload zone: `border-2 border-dashed border-white/20 hover:border-gold/50 rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300`. On hover: subtle `bg-white/3` background.
  - `Upload` lucide icon, 32px, `white/40`
  - "Drop your logo here or click to browse" — `white/40 text-sm`
  - "PNG, JPG or SVG — max 5MB" — `white/25 text-xs mt-1`
- On file select: preview replaces the upload zone. Image shown in a `w-32 h-32 rounded-xl object-contain bg-white/5` box. A remove button (`X`) top-right of the preview.
- Skip button: below the upload zone. `text-white/30 text-xs hover:text-white/50 underline cursor-pointer`. "Skip for now →"

**Question 6: "What's your WhatsApp number?"**
- Sub-prompt: "We'll send you order notifications here. You can change this later."
- A phone input with country code selector:
  - Left: a country code pill (auto-populated from Question 4 selection) — `bg-white/8 border border-white/15 rounded-l-2xl px-4 py-4 text-white text-sm`. Shows flag + code, e.g. "🇬🇭 +233".
  - Right: phone number input, same height, `rounded-r-2xl`, border on right and top and bottom only.
  - Combined they form one visually unified input.
- Below: `text-white/30 text-xs mt-3 flex items-center gap-2`. `Lock` icon 12px. "Your number is never shared publicly."

**Question 7: "Pick your store colors"**
- Sub-prompt: "Choose a palette that feels like your brand. You can always change it later."
- 4 preset palette options displayed as swatches + name:
  - Palette 1 "Midnight Gold" — navy `#0A0F2C` + gold `#F4A820`: The ThorAI default. A small circle of each color side by side.
  - Palette 2 "Forest" — deep green `#0F2E1A` + warm gold `#D4A843`
  - Palette 3 "Rose" — deep rose `#2A0F1A` + blush `#E8A0A0`
  - Palette 4 "Slate" — charcoal `#1A1A2E` + electric blue `#4A90E2`
- Each palette card: `border border-white/15 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-white/40 transition-all`.
- Left: two stacked color circles (primary + accent), each `w-8 h-8 rounded-full`.
- Right: palette name in Inter 600 white `text-sm`, palette descriptor in Inter 400 `white/40 text-xs`.
- Selected: `border-gold bg-white/5`.
- Custom option at bottom: a small `+ Customise` text link that expands two color pickers (just hex input fields for now — the full picker is in the admin dashboard).

**Question 8: "What payment methods do you accept?"**
- Sub-prompt: "Select all that apply. You can add more from your dashboard."
- 4 options as pill toggles in a `flex flex-wrap gap-3`:
  - "Paystack" (card icon)
  - "MTN Mobile Money" (smartphone icon)
  - "Vodafone Cash" (smartphone icon)
  - "AirtelTigo Money" (smartphone icon)
  - "Bank Transfer" (bank icon)
- Each pill: `border border-white/15 rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white hover:border-white/40 transition-all`.
- Selected: `border-gold bg-[gold]/10 text-white`.
- Note at bottom: `text-white/30 text-xs mt-4`. "Paystack requires a quick setup step after registration."

**Question 9: Review Screen**
- This is NOT a question — it is an animated summary.
- Top: The AI orb animates to a larger size temporarily (`scale: 1.2`, then back to `1` over 0.6s) — a "reaction" to the data being ready.
- Overline above heading: "ALMOST THERE" in gold
- Heading: "Here's what we're building for you." — Syne 600 white `text-2xl`
- Summary card: `mt-8 bg-white/5 border border-white/12 rounded-2xl p-8`
  - Each collected piece of data as a row: label (Inter 500, `white/40`, `text-xs`, uppercase, `tracking-wider`) + value (Inter 600, white, `text-base`). `flex justify-between items-center py-3 border-b border-white/8` (last row no border)
  - Rows: "Name", "Business", "Category", "Location", "Logo" (shows thumbnail or "Using text logo"), "WhatsApp", "Color Palette" (shows mini swatches), "Payment methods" (comma-separated list)
- Edit link at top-right of summary card: `text-gold text-xs font-medium hover:underline flex items-center gap-1`. `Pencil` icon 12px. "Edit answers"
- Below the card: the primary "Launch My Store" button (full gold, full width, `py-4`, Syne 700, uppercase tracking-widest, gold glow shadow)
- Sub-note below button: `text-white/30 text-xs text-center mt-4`. "By submitting, you agree to our Terms of Service."

**Question 10: Building Screen + Success**
- Full-page takeover within the same layout shell (sidebar hidden during this step).
- Building phase (`isBuilding = true`, 0–3s):
  - Center: The AI orb, enlarged to `w-32 h-32`.
  - Below orb: A custom circular progress ring. SVG circle with `strokeDasharray` set to circumference, `strokeDashoffset` animates from circumference to 0 over 3s with `ease: linear`. Ring color: gold. Background ring: `white/15`.
  - Below ring: animated text sequence using `AnimatePresence`. Shows 3 messages in sequence (1s each):
    - "Setting up your store..." 
    - "Configuring your payment methods..."
    - "Almost ready..."
  - Each message: `initial={{ opacity: 0, y: 8 }}` → `animate={{ opacity: 1, y: 0 }}` → `exit={{ opacity: 0, y: -8 }}`. Syne 500 white `text-lg text-center`.

- Success phase (`isComplete = true`, after 3s):
  - `AnimatePresence` transitions out the building view and transitions in the success view.
  - Large `CheckCircle2` lucide icon, animated: `initial={{ scale: 0 }}` → `animate={{ scale: 1 }}`, `transition={{ type: "spring", stiffness: 200, damping: 15 }}`. Icon color: gold. Size: 64px. `mx-auto mb-8`.
  - Below: Syne 700 white `text-3xl text-center`: "Your store is live."
  - Below: Inter 400 `white/60 text-base text-center mt-3 max-w-sm mx-auto`: "Visit your store, share the link, and start selling. Your first order might be closer than you think."
  - Below (`mt-10 flex flex-col gap-3 max-w-xs mx-auto`):
    - Button 1: "VIEW MY STORE →" — gold filled, full width
    - Button 2: "GO TO DASHBOARD" — outlined gold, full width
  - The generated store URL shown below buttons: `text-white/30 text-xs text-center mt-4`. `Link` icon 12px. "`thorai.com/your-store-slug`"
  - Confetti: a lightweight confetti burst using 20 small `motion.div` squares (4px × 4px), each gold or white, absolutely positioned at the center of the screen, each with a random `x` and `y` initial velocity set via `animate={{ x: randomX, y: randomY, opacity: 0 }}`, `transition={{ duration: 0.8, ease: "easeOut" }}`. They originate from the checkmark's position and scatter outward. This is achievable with inline Framer Motion, no external library.

---

## Page 4: FAQ Page (`/faq`)

### FAQ Layout

**Purpose:** Comprehensive, organized, searchable. Reduce support burden. Build confidence for both vendors and buyers before they register.

**Page structure:**
`bg-white min-h-screen`.

**Hero strip (not full hero — a slim section):**
`bg-[#0A0F2C] py-20 px-6`. `max-w-4xl mx-auto text-center`.
- Overline: "SUPPORT"
- H1: "Frequently Asked Questions" — Syne 700 white `clamp(2rem, 3.5vw, 3rem)`
- Subtext: "Everything you need to know about ThorAI, vendor setup, payments, and buyer safety." — Inter 400 `white/60 text-base mt-4 max-w-xl mx-auto`
- Search bar (`mt-10 max-w-lg mx-auto`):
  - `relative`
  - `Search` lucide icon `absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5`
  - `<input>` (conceptually — the actual component uses design system input): `w-full bg-white/8 border border-white/15 focus:border-gold rounded-2xl pl-12 pr-6 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold/20 text-base transition-all`
  - Placeholder: "Search questions..."
  - On type: filters the FAQ list in real-time (client-side, `useState` filter)
  - Keyboard behavior: `Enter` key focuses first result.

**Main content area:**
`max-w-6xl mx-auto px-6 py-20`. `flex gap-12`.

Left sidebar — categories (desktop only, `w-56 flex-shrink-0 hidden lg:block`):
- `sticky top-24` — sticks to the top of the viewport as user scrolls
- Heading: "CATEGORIES" — overline style, `navy/40`
- Category pills as a vertical list (`mt-4 flex flex-col gap-2`):
  - "All Questions" (default active)
  - "For Vendors" (20 questions)
  - "For Buyers" (8 questions)
  - "Payments" (6 questions)
  - "Technical" (6 questions)
- Each pill: `px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200`.
  - Default: `text-navy/60 hover:bg-navy/5 hover:text-navy`
  - Active: `bg-gold text-navy font-semibold`
- Question count badge: `ml-auto text-xs opacity-60` in a `flex justify-between` row.

Right content area (`flex-1 min-w-0`):
- Active category heading: `text-navy font-semibold text-sm mb-6 flex items-center gap-2`. `Filter` icon 14px gold. "Showing: For Vendors (20 questions)"
- If search active: "Showing X results for 'query'" — same style with `Search` icon.
- Accordion list: `flex flex-col gap-2`.

**FAQ categories and questions:**

FOR VENDORS (6 on the page — full list at `/faq`):
1. "How do I register my business on ThorAI?"
2. "Is ThorAI free to use?"
3. "How long does store setup take?"
4. "What is the Verified Vendor Badge and how do I get it?"
5. "Can I use my own domain name?"
6. "How do I manage my products and inventory?"
7. "What happens if I get a dispute from a buyer?"
8. "Can I sell multiple product categories?"
9. "How do I customise my store design?"
10. "What analytics and reports do I get?"

FOR BUYERS (4):
1. "How do I know if a vendor is legitimate?"
2. "Is it safe to pay on ThorAI stores?"
3. "What do I do if my order doesn't arrive?"
4. "Can I get a refund?"
5. "How do I contact a vendor directly?"

PAYMENTS (4):
1. "What payment methods are supported?"
2. "How quickly are funds released to vendors?"
3. "Are there transaction fees?"
4. "What currencies are supported?"

TECHNICAL (4):
1. "What devices does ThorAI work on?"
2. "Do I need to install any software?"
3. "How do I share my store link?"
4. "Can I export my customer data?"

**Accordion item styling (FAQ page):**
Same general pattern as landing page FAQ but with slight differences:
- Trigger: `flex items-start justify-between px-6 py-5 cursor-pointer hover:bg-[#F8F9FD] transition-colors rounded-xl` (rounded on hover state, `rounded-b-none` when open)
- When open: `bg-[#F8F9FD] rounded-t-xl`. The answer panel: `bg-[#F8F9FD] px-6 pb-6 rounded-b-xl text-navy/65 text-sm leading-relaxed`
- The `border` wraps the entire item (both trigger and answer): `border border-navy/8 rounded-xl overflow-hidden`
- A gold left border accent appears on the open item: `border-l-2 border-l-gold` added to the wrapper when open.

**Mobile layout:**
On mobile, the left sidebar becomes a horizontally scrollable pill row at the top of the content area: `flex gap-2 overflow-x-auto pb-3 mb-8 -mx-4 px-4 scrollbar-hide`. Same pill styling.

**Animations:**
Hero strip: standard `whileInView` fade-up on heading + subtext.
FAQ items: `whileInView` on each item, `initial={{ opacity: 0, y: 12 }}`, stagger `delay: index * 0.04`.
Accordion expand: `AnimatePresence` + `motion.div` height animation, same as landing page FAQ.
Category filter change: `AnimatePresence mode="wait"` wraps the question list. On category change, old list `exit={{ opacity: 0 }}` and new list `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`, `duration: 0.2`.
Search filter: No animation on result list (too fast for animation to look good) — just `opacity` transition `0.15s` on the full list.

---

## Component Architecture

```
src/app/
  page.tsx                                    — server component, composes all landing page sections
  auth/
    page.tsx                                  — server component shell (metadata only)
    _components/
      AuthCard.tsx                            — 'use client' (tab state, form state, AnimatePresence)
  register/
    page.tsx                                  — server component shell (metadata only)
    _components/
      RegisterFlow.tsx                        — 'use client' (all question state, orb, progress, AnimatePresence)
      ConversationalQuestion.tsx              — 'use client' (AnimatePresence wrapper for each step)
      AvatarOrb.tsx                           — 'use client' (framer-motion breathing animation, equalizer bars)
      StepSidebar.tsx                         — 'use client' (reads current step from context/props)
      BuildingScreen.tsx                      — 'use client' (SVG ring progress, message sequence)
      SuccessScreen.tsx                       — 'use client' (confetti, checkmark spring animation)
  faq/
    page.tsx                                  — server component, passes full FAQ data as props
    _components/
      FAQSearch.tsx                           — 'use client' (search input state, filter logic)
      FAQAccordion.tsx                        — 'use client' (AnimatePresence for expand, open state)
      CategoryFilter.tsx                      — 'use client' (active category state)
  _components/
    HeroSection.tsx                           — 'use client' (useScroll for parallax/fade, floating SVG animations)
    TrustStripSection.tsx                     — server component (pure data display, no interactivity)
    CoreMissionSection.tsx                    — server component (whileInView is fine on server via framer-motion SSR)
    FeaturesSection.tsx                       — server component
    SecuritySection.tsx                       — 'use client' (animated counters use useInView + useState)
    HowItWorksSection.tsx                     — server component (scroll-driven connector lines can be client-side)
    TestimonialsSection.tsx                   — server component
    LandingFAQSection.tsx                     — 'use client' (accordion open state)
    CTAPanelSection.tsx                       — server component
    FooterSection.tsx                         — server component
    HeroFloatingShapes.tsx                    — 'use client' (CSS keyframe animations, could be server with className but motion values need client)
    CounterAnimation.tsx                      — 'use client' (useInView + useEffect for counter increment — this IS a true mount side-effect, acceptable use of useEffect)
    ProgressRing.tsx                          — 'use client' (SVG strokeDashoffset animation, framer-motion useMotionValue)
```

**Notes on server vs client decisions:**

- `TrustStripSection`, `CoreMissionSection`, `FeaturesSection`, `HowItWorksSection`, `TestimonialsSection`, `CTAPanelSection`, `FooterSection` — all server. Framer Motion `whileInView` works in server components because the `motion.div` serializes correctly. These sections have no `useState` or browser APIs.
- `HeroSection` — client required for `useScroll` (requires browser scroll events).
- `SecuritySection` — client required for `CounterAnimation` (uses `useInView` + `useEffect` for the counter tick, which is a legitimate mount/visibility side-effect, not an event-driven side-effect).
- `LandingFAQSection` — client for `useState(openIndex)` accordion state.
- `AuthCard` — client for form state, tab switching, password visibility toggle.
- `RegisterFlow` — client for the entire multi-step state machine. This is the most complex client component. It owns: `currentStep`, `answers`, `isBuilding`, `isComplete`. All sub-components receive these as props.
- `FAQSearch`, `FAQAccordion`, `CategoryFilter` — client for their respective interaction states.
- `CounterAnimation` — client, `useEffect` is acceptable here per project rules because the counter increment is a true side-effect of the element entering the viewport (not a user event).

---

## Key Constraints Reminder

- All colors: Use the established navy/gold/white palette via CSS custom properties or Tailwind theme tokens. Never hardcode hex values in JSX className strings. Never use unrelated Tailwind color utilities like `text-yellow-400` or `bg-blue-900`.
- Gradient text: Use the `.gold-text` CSS class approach — never `bg-clip-text text-transparent` inline on block elements.
- Background images: Reference via environment variable paths. Never import from `public/` or use external URLs directly in JSX.
- Icons: `lucide-react` only. No heroicons, no react-icons, no custom SVG icon components except the ThorAI orb and the Apple OAuth button (which require inline SVG because lucide doesn't have those specific marks).
- No native `<select>`: The country code selector in Question 6 and any dropdown must use the `@tor/ui` Select component or a custom pill-button group — never a `<HTMLSelectElement>`.
- `useEffect` prohibition: The `RegisterFlow` step progression must be handled in `onClick` handlers on the Continue/Back buttons, not in a `useEffect` watching `currentStep`. The building → success transition should be triggered by a `setTimeout` initiated inside the form submit handler, not a `useEffect` watching an `isBuilding` flag.
- The `AnimatePresence` `mode="wait"` on question cards ensures exit animation completes before next question enters. This must be implemented correctly — the key on the `motion.div` must change with each step to trigger mount/unmount correctly. Use `key={currentStep}`.
- Framer Motion carousel or auto-advance: If a carousel is added to testimonials, the `useEffect` for `setInterval` is acceptable per project rules (side-effect on mount, not event-driven).
- Form validation: All form fields in the conversational flow must validate on the Continue button click handler, not in a `useEffect` watching the field value. Show error states inline below the field via conditional rendering driven by component state set in the click handler.
```
