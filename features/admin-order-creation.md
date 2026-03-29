# Feature: Admin Order Creation

## User Story
As an admin, I want to create orders on behalf of customers (existing or new) from the dashboard, so that social media sales are managed centrally alongside inventory and regular orders. As a customer, I expect to receive an order notification email and be able to view my order after signing in or creating an account.

## Benefit
Enables admins to handle sales from social media channels (WhatsApp, Instagram, etc.) without a separate system — orders, inventory, and customer records stay in one place. Customers created by the admin can complete their own account registration and track their orders.

## Architecture Impact

| Layer | Touches? | Notes |
|-------|----------|-------|
| Shared pages (`packages/pages/`) | YES | New `/admin/orders/new/` page + `CreateOrderClient.tsx`; "Create Order" button on admin orders list |
| Shared UI components (`packages/ui/`) | NO | |
| Shared lib / server actions (`packages/lib/`) | YES | `createAdminOrder`, `searchCustomersForOrder`, `resendVerificationEmail` actions; fix `signUp` for stub users; fix `signInWithEmail` to return unverified state; new email function |
| Store config (`packages/store/`) | NO | |
| Database schema (new migration) | YES | `admin_created boolean DEFAULT false` on both `orders` and `profiles` |
| Store-specific files (`apps/*/src/app/`) | NO | |
| Terraform / infra | NO | |
| CI workflows | NO | |
| Email templates | YES | New `sendAdminCreatedOrderEmail` with "Set Up Your Account" CTA |
| Paystack / payments | NO | Reuses existing `markOrderPaidManually` + `requestOrderPayment` |

## Key Decisions

1. **Stub auth user on new customer** — `supabaseAdmin.auth.admin.createUser()` creates the user with `email_confirm: true`, profile flagged `admin_created = true`. No `hashed_password`, no `user_credentials` entry. Customer cannot sign in until they complete registration.
2. **Order `user_id` is always set** — stub user is created first so `user_id` is never null for admin-created orders. No changes needed to `getMyOrders` / `getMyOrder`.
3. **Customer completes registration via password reset flow** — `createAdminOrder` generates a `password_reset_tokens` entry and includes the link in the notification email. Alternatively, customer can sign up normally (Step 2e handles this case).
4. **`signUp` detects stub** — if `existingProfile.admin_created = true` and `hashed_password IS NULL`, allow completing registration (set password, insert credentials, send verification email, clear `admin_created`) instead of returning "account already exists".
5. **`signInWithEmail` returns structured unverified state** — returns `{ error, unverified: true, tokenExpired: boolean, email }` so `AuthClient` can show a "Resend verification email" button with correct messaging.
6. **Customer search queries `profiles`** — `searchCustomersForOrder` queries `profiles` by `store_id` (finds account holders who haven't ordered yet too), enriched with last-order phone + address via a join.

## Workflow

Each step is tagged:
- 🔵 SEQUENTIAL — must wait for the previous step
- 🟡 PARALLEL — can run at the same time as other PARALLEL steps in the same group

---

### Step 1 — Database migration 🔵 SEQUENTIAL
**What:** Add `admin_created boolean NOT NULL DEFAULT false` to both `orders` and `profiles` tables.
**Files:** `supabase/migrations/20260329200000_admin_order_creation.sql`
**Rules:** Migration affects both stores. No RLS changes needed — admin actions use `supabaseAdmin` (bypasses RLS); customer order queries go through existing server actions.
**Done when:** Migration file exists with both ALTER TABLE statements.

---

### Step 2a — `createAdminOrder` server action 🟡 PARALLEL (Group A)
**What:** New admin-only server action in `packages/lib/actions/orders.ts`.
- Verify caller is admin via `isAdmin()` — throw if not.
- **New customer path:** call `supabaseAdmin.auth.admin.createUser({ email, email_confirm: true })`, then update the auto-created profile: `admin_created = true`. Generate a `password_reset_tokens` entry for the reset link.
- **Existing customer path:** look up `user_id` from `profiles` by `email + store_id`.
- Insert order with `user_id`, `admin_created = true`, `status = 'pending'`, all customer detail fields.
- Insert `order_items` (same shape as `createOrder`).
- Call `logStatusChange(orderId, 'pending')`.
- Send `sendAdminCreatedOrderEmail` non-blocking (pass `resetLink` for new customers, omit for existing).
- Return `{ orderId }`.

**Files:** `packages/lib/actions/orders.ts`
**Rules:** Write in packages only. Use `supabaseAdmin` for user creation + profile update. Use `getStoreId()` for store isolation. No hardcoded store names — store name comes from email config.
**Done when:** Action exported, typed, admin-gated, creates stub user + order + items, triggers email.

---

### Step 2b — `searchCustomersForOrder` server action 🟡 PARALLEL (Group A)
**What:** New admin-only server action in `packages/lib/actions/orders.ts`.
- Verify caller is admin.
- Query `profiles` WHERE `store_id = getStoreId()` AND (`full_name ILIKE %q%` OR `email ILIKE %q%`). Limit 20.
- For each profile, left-join latest order to get `customer_phone`, `shipping_address`, `city`, `region` (so admin can pre-fill shipping step).
- Return array: `{ user_id, full_name, email, phone, shipping_address, city, region }`.

**Files:** `packages/lib/actions/orders.ts`
**Rules:** Use `supabaseAdmin`. Admin-only gate. `store_id` isolation.
**Done when:** Action exported, typed, returns profile + last-order address data.

---

### Step 2c — Fix `signInWithEmail`: structured unverified response 🟡 PARALLEL (Group A)
**What:** When `profile.email_verified = false`, check whether the user's verification token exists and is expired:
- Query `email_verification_tokens` by `user_id + store_id`, get `expires_at`.
- Return `{ error: 'Email not verified.', unverified: true, tokenExpired: boolean, email }`.
- Also add new exported action `resendVerificationEmail(email: string)`:
  - Look up profile by email + store_id.
  - Delete existing tokens for this user + store.
  - Insert new token with fresh `expires_at`.
  - Call `sendVerificationEmail(...)`.
  - Return `{ success: true }` or `{ error }`.

**Files:** `packages/lib/actions/auth.ts`
**Rules:** Use `supabaseAdmin` for token queries. Don't reveal whether account exists in the resend action (always return success if email not found).
**Done when:** `signInWithEmail` returns `unverified` + `tokenExpired` fields; `resendVerificationEmail` exported and functional.

---

### Step 2d — Fix `signUp`: handle admin-created stub 🟡 PARALLEL (Group A)
**What:** In the `signUp` action, when `existingProfile` is found on this store, check `existingProfile.admin_created === true && !existingProfile.hashed_password`. If true, allow completing registration:
- Hash the new password, update `profiles.hashed_password`, clear `admin_created = false`.
- Insert `user_credentials` with encrypted global password (same pattern as new user signup).
- Generate + insert `email_verification_tokens` entry.
- Send verification email.
- Redirect to `/auth/verify-email/sent`.
Otherwise (existing non-stub profile): keep existing "account already exists" error.
Also update the profile query in this block to select `admin_created, hashed_password`.

**Files:** `packages/lib/actions/auth.ts`
**Rules:** Reuse existing `encrypt`, `bcrypt.hash`, token generation patterns exactly. Don't create a new auth.users row (one already exists).
**Done when:** Stub user can complete registration via normal signup form; non-stub existing users still get the error.

---

### Step 2e — New email: `sendAdminCreatedOrderEmail` 🟡 PARALLEL (Group A)
**What:** New function in `packages/lib/email.ts` on the `EmailService` class.
- Subject: "Your order has been placed — [store name]"
- Body: "Hi [name], an order has been placed on your behalf." + `orderItemsTableHtml(items)` + total.
- If `setupLink` provided (new customer): CTA button "Set Up Your Account" → `setupLink`.
- If no `setupLink` (existing customer): CTA "View Your Order" → `/orders/[orderId]` (they can already sign in).
- Same footer + branding as other emails. No hardcoded colors — use `config.brandColor`.
Also export a top-level `sendAdminCreatedOrderEmail` wrapper (same pattern as `sendOrderConfirmationEmail`).

**Files:** `packages/lib/email.ts`
**Rules:** No hardcoded colors. Uses `config.brandColor` from `StoreEmailConfig`. Uses `orderItemsTableHtml()`.
**Done when:** Function exported, handles both new-customer (with setup link) and existing-customer variants.

---

### Step 2f — `AuthClient`: show resend verification UI 🟡 PARALLEL (Group A)
**What:** In `AuthClient.tsx`, update `onSignIn` to handle the structured `unverified` response:
- Detect `result?.unverified === true`.
- Instead of just setting `setError`, set a new `unverifiedState: { email, tokenExpired }`.
- Render below the sign-in form: an info banner with the appropriate message:
  - `tokenExpired`: "Your verification link has expired."
  - Otherwise: "Check your inbox for the verification email."
- "Resend verification email" button → calls `resendVerificationEmail(email)` → on success shows "Sent! Check your inbox."
- Needs new state: `unverifiedState`, `resendSent`, `resendLoading`.
- Import `resendVerificationEmail` from `@tor/lib/actions/auth`.

**Files:** `packages/pages/auth/AuthClient.tsx`
**Rules:** Client component. No hardcoded colors — use `brand-*` tokens. Keep existing form layout unchanged.
**Done when:** Sign-in with unverified account shows resend button; expired tokens show correct copy; resend sends email and confirms.

---

### Step 3 — Admin Create Order UI 🔵 SEQUENTIAL
**What:** Build the admin UI for creating orders.

**3a — `packages/pages/admin/orders/new/page.tsx`**
- Server component. Calls `isAdmin()` — redirect to `/admin` if false.
- Fetches product list for the form: `getProducts({ limit: 100 })` (admin needs to pick from products).
- Renders `<CreateOrderClient products={products} />`.

**3b — `packages/pages/admin/orders/new/CreateOrderClient.tsx`**
Multi-step client component with 4 steps:

**Step 1 — Customer**
- Search input with debounce → calls `searchCustomersForOrder(query)` → shows dropdown of matching profiles.
- Selecting a result pre-fills name, email, phone, address, city, region.
- "New customer" toggle: clears selection, shows manual name + email fields only (phone + address collected in Step 3).

**Step 2 — Products**
- Product list (from props, already fetched server-side).
- Each row: product name, variant selector (dropdown if variants exist), quantity input, "Add" button.
- Running list of added items below with remove button and computed line total.
- Calculated order total shown at bottom.

**Step 3 — Shipping**
- Fields: phone, shipping address, city, region.
- Pre-filled from selected customer's last order (passed from Step 1 selection).
- All editable.

**Step 4 — Review**
- Summary: customer name + email, items list, total, shipping address.
- "Create Order" button → calls `createAdminOrder(data)` → on success redirects to `/admin/orders/[id]`.
- Loading state during submission.

**3c — Add "Create Order" button to admin orders list page**
- Edit `packages/pages/admin/orders/page.tsx`.
- Add a `<Link href="/admin/orders/new">` button next to the "Orders" heading.

**Files:**
- `packages/pages/admin/orders/new/page.tsx` (new)
- `packages/pages/admin/orders/new/CreateOrderClient.tsx` (new)
- `packages/pages/admin/orders/page.tsx` (edit — add button)

**Rules:** Write in packages only. No hardcoded colors (`brand-*` tokens only). Config-driven store values. Server component for the page shell, `'use client'` for the form. No new API routes — use server actions directly.
**Done when:** Admin can navigate to `/admin/orders/new`, complete all 4 steps, submit, and land on the new order's detail page.

---

## Validation

- [x] `task build` passes with no errors
- [x] `task lint` — no new errors introduced (2 pre-existing errors in ProductGrid.tsx + ProductDetailClient.tsx unrelated to this feature)
- [ ] New customer: admin creates order → stub profile has `admin_created = true`, no `hashed_password`, no `user_credentials` row
- [ ] New customer: order `user_id` matches the stub user's ID
- [ ] New customer: order notification email sent with "Set Up Your Account" link
- [ ] Stub customer: password reset link works → sets password → can sign in → can see order at `/orders/[id]`
- [ ] Stub customer: normal signup with same email completes registration instead of erroring
- [ ] Existing customer: order created with their real `user_id`, they can see it immediately after signing in
- [ ] Sign-in with unverified email: "Resend" button appears
- [ ] Sign-in with expired token: "Your verification link has expired" copy shown
- [ ] Resend verification: new token created, old deleted, email sent
- [ ] Admin orders list has "Create Order" button
- [x] No hardcoded colors in any new JSX
- [x] No store-specific logic in shared packages
