# Feature: Payment Evidence Upload

## User Story
As an admin, I want to upload proof of payment (screenshot or PDF) when manually marking an order as paid, so there is a verifiable record of the manual transaction. As a customer, I want to see the payment evidence and download my receipt from my order page at any time, so I have permanent proof of my payment.

## Benefit
Provides transparency and accountability for manual payment processing — admins attach proof (mobile money screenshot, bank transfer slip, etc.) when marking orders paid, and customers get permanent access to both the evidence and their PDF receipt directly on their order page.

## Architecture Impact

| Layer | Touches? | Notes |
|-------|----------|-------|
| Shared pages (`packages/pages/`) | Yes | Modify `OrderStatusUpdate.tsx` (admin upload UI) + `orders/[id]/page.tsx` (customer view) |
| Shared UI components (`packages/ui/`) | No | Existing components sufficient |
| Shared lib / server actions (`packages/lib/`) | Yes | Update `markOrderPaidManually()`, `receipt.ts`, `email.ts` |
| Store config (`packages/store/`) | No | |
| Database schema (new migration) | Yes | Two new nullable columns on `orders` |
| Store-specific files (`apps/*/src/app/`) | No | |
| Terraform / infra | No | Reuse existing `products` bucket with folder prefix |
| CI workflows | No | |
| Email templates | Yes | Add receipt download link to `sendPaymentReceiptEmail` |
| Paystack / payments | No | |

## Key Decisions
- Storage: Reuse existing `products` Supabase bucket. Paths: `orders/{orderId}/manual-payment-proof.{ext}` (evidence) and `orders/{orderId}/receipt.pdf` (generated receipt). UUIDs make URLs unguessable; access is gated by `orders` table RLS.
- Two new nullable columns on `orders`: `payment_proof_url TEXT` and `receipt_url TEXT`. Null for Paystack-paid orders and orders pre-dating this feature.
- PDF receipt is now generated, uploaded to storage, and the URL saved to `orders.receipt_url` during `markOrderPaidManually`. Email includes an inline download link.
- Evidence upload in `OrderStatusUpdate.tsx`: clicking "Mark as Paid" reveals an inline upload form (required). Admin selects file → uploads client-side (browser Supabase client, same pattern as product media) → calls `markOrderPaidManually(orderId, proofUrl)`.
- Customer `orders/[id]/page.tsx`: shows a "Payment Documents" section when either URL is present — "View Payment Proof" link and "Download Receipt" button.
- No new env vars needed.

## Workflow

Each step is tagged:
- 🔵 SEQUENTIAL — must wait for the previous step
- 🟡 PARALLEL — can run at the same time as other PARALLEL steps in the same group

---

### Step 1 — Database migration 🔵 SEQUENTIAL
**What:** Add `payment_proof_url TEXT` and `receipt_url TEXT` columns to the `orders` table. Both nullable (existing orders stay valid).
**Files:** `supabase/migrations/20260330100000_payment_evidence_columns.sql`
**Rules:** Shared migration — affects all stores. No breaking changes to existing rows.
**Done when:** Migration file exists and is valid SQL (`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ...`).

---

### Step 2a — Update receipt.ts to generate + store PDF 🟡 PARALLEL (Group A)
**What:** In `markOrderPaidManually` (inside `packages/lib/actions/orders.ts`), after generating the PDF buffer via `generateReceiptPDF`, upload it to `orders/{orderId}/receipt.pdf` in the `products` bucket using `supabaseAdmin.storage`, get the public URL, and return it so it can be saved to the order and passed to the email function.

Actually: extract a helper `uploadReceiptPDF(orderId, buffer)` at the bottom of `orders.ts` (or inline it in `markOrderPaidManually`) — do NOT modify `receipt.ts` itself, keep it as a pure PDF generator. The upload logic lives in `orders.ts`.

**Files:** `packages/lib/actions/orders.ts`
**Rules:** Server-only; use `supabaseAdmin` (already imported). Storage upload pattern: `supabaseAdmin.storage.from('products').upload('orders/{id}/receipt.pdf', buffer, { contentType: 'application/pdf', upsert: true })`, then `supabaseAdmin.storage.from('products').getPublicUrl('orders/{id}/receipt.pdf').data.publicUrl`.
**Done when:** `markOrderPaidManually` uploads the PDF and returns/saves the `receipt_url`.

### Step 2b — Update email.ts to accept receiptUrl 🟡 PARALLEL (Group A)
**What:** Add optional `receiptUrl?: string | null` field to `OrderForEmail` interface (or whatever type `sendPaymentReceiptEmail` accepts). In `sendPaymentReceiptEmail`, if `receiptUrl` is present, add a download button in the HTML body above the footer.
**Files:** `packages/lib/email.ts`
**Rules:** No hardcoded colors — use inline styles with `brandColor` variable (already used in this file). Do not change the function signature in a breaking way — make the new param part of the order object or add it as an optional second arg.
**Done when:** `sendPaymentReceiptEmail` renders a "Download Receipt" button when `receiptUrl` is provided.

---

### Step 3 — Wire up markOrderPaidManually 🔵 SEQUENTIAL
**What:** Update `markOrderPaidManually(id, paymentProofUrl?: string)` in `packages/lib/actions/orders.ts`:
1. Accept optional `paymentProofUrl` parameter.
2. Generate PDF buffer via `generateReceiptPDF(fullOrder)` (import already exists via `sendPaymentReceiptEmail` chain — add direct import of `generateReceiptPDF` from `../receipt`).
3. Upload PDF to storage → get `receiptUrl` (from Step 2a helper).
4. In the single `.update()` call, include `payment_proof_url: paymentProofUrl ?? null` and `receipt_url: receiptUrl`.
5. Pass `receiptUrl` to `sendPaymentReceiptEmail` (per Step 2b's updated signature).
**Files:** `packages/lib/actions/orders.ts`
**Rules:** Keep PDF generation/upload in a try/catch so email failure doesn't block order status update. The `.update()` for status must still happen even if PDF upload fails (log the error, continue with null receipt_url).
**Done when:** `markOrderPaidManually` saves both URLs to the order row and sends the email with the download link.

---

### Step 4a — Admin upload UI in OrderStatusUpdate.tsx 🟡 PARALLEL (Group B)
**What:** Modify `packages/pages/admin/orders/[id]/OrderStatusUpdate.tsx`. When `currentStatus === 'pending'` and the admin clicks "Mark as Paid", instead of immediately calling `markOrderPaidManually`, show an inline upload form:
- A file input (accept: `image/*,application/pdf`, max 10MB client-side validation).
- A small preview: if image show a thumbnail, if PDF show a file icon + filename.
- A "Confirm Payment" button (disabled until a file is selected and uploaded).
- A "Cancel" link to go back without marking paid.
Upload flow: on file select, immediately upload to `orders/{orderId}/manual-payment-proof.{ext}` using the browser Supabase client (`createBrowserClient` — import from `@tor/lib/supabase/client`). Show a spinner during upload. On success, enable "Confirm Payment" button. On click, call `markOrderPaidManually(orderId, proofUrl)`.

New states needed: `showProofUpload` (boolean), `proofFile` (File | null), `proofUploading` (boolean), `proofUrl` (string).

**Files:** `packages/pages/admin/orders/[id]/OrderStatusUpdate.tsx`
**Rules:** `'use client'` already on this file. No hardcoded colors — use `bg-brand-600` etc. No native `<select>`. No `useEffect` — all logic in event handlers. Import browser Supabase client from `@tor/lib/supabase/client`. Add `Upload` and `FileText` icons from `lucide-react`.
**Done when:** Admin can upload a file, see a preview, and confirm payment; the page refreshes showing the order as paid.

### Step 4b — Customer order page: show payment documents 🟡 PARALLEL (Group B)
**What:** Modify `packages/pages/orders/[id]/page.tsx`. After the existing "Shipping Details" section, add a "Payment Documents" section that renders only when `order.payment_proof_url` or `order.receipt_url` is present. Show:
- "View Payment Proof" — an `<a href={order.payment_proof_url} target="_blank">` styled as a secondary button, only if `payment_proof_url` is set.
- "Download Receipt" — an `<a href={order.receipt_url} download>` styled as a primary button, only if `receipt_url` is set.
This section should only appear for paid/processing/shipped/delivered orders.
**Files:** `packages/pages/orders/[id]/page.tsx`
**Rules:** Server component — no `'use client'`. No hardcoded colors. Add `Download`, `FileText` icons from `lucide-react` (already imported in this file).
**Done when:** A paid order with both URLs shows the Payment Documents section with working links.

---

## Validation
- [ ] `task build` passes with no errors
- [ ] `task lint` passes
- [ ] Admin can upload an image/PDF when marking an order as paid manually
- [ ] `payment_proof_url` and `receipt_url` are saved to the order row in the DB
- [ ] Customer order page shows "Payment Documents" section with both links for manually-paid orders
- [ ] Paystack-paid orders show receipt download link (receipt_url set during `verifyPaystackPayment`)
- [ ] Receipt email includes a "Download Receipt" button with the correct URL
- [ ] No hardcoded colors in any new JSX
- [ ] No store-specific logic in shared packages
