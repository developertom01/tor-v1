# Production Deployment Checklist

Step-by-step guide to deploy Hair Luk Gud GH to production.

---

## 1. Supabase — Create Production Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. Choose org, name it (e.g. `hairlookgood-prod`), set a strong DB password, pick region closest to Ghana (e.g. EU West or closest available)
3. Wait for project to provision
4. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role key** → `SUPABASE_SECRET_KEY`

### Push migrations

```bash
npx supabase link --project-ref <your-project-ref>
npm run db:push
```

### Configure Auth

1. **Settings → Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: add `https://yourdomain.com/auth/callback`
2. **Settings → Authentication → Providers → Google**:
   - Enable Google provider
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Authorized redirect URI: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
   - Paste Client ID and Client Secret into Supabase

### Configure Storage

1. Go to **Storage** → create bucket named `products` (public)
2. Add RLS policy: allow public read (`SELECT`) for all, allow authenticated insert/delete for admin

---

## 2. Paystack — Production Keys

1. Log in to [dashboard.paystack.com](https://dashboard.paystack.com)
2. Toggle to **Live Mode** (not Test)
3. Go to **Settings → API Keys & Webhooks**:
   - Copy **Public Key** → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - Copy **Secret Key** → `PAYSTACK_SECRET_KEY`
4. Set **Webhook URL**: `https://yourdomain.com/api/paystack-webhook`
5. Ensure webhook events include: `charge.success`

---

## 3. Resend — Email Service

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → create key → `RESEND_API_KEY`
3. Go to **Domains** → add your domain (e.g. `hairlookgood.com`)
4. Add the DNS records Resend provides (SPF, DKIM, DMARC)
5. Once verified, set `FROM_EMAIL` to e.g. `Hair Luk Gud GH <orders@hairlookgood.com>`

---

## 4. Vercel — Deploy

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import the GitHub repo
3. Set **Framework Preset**: Next.js
4. Add all environment variables (see section below)
5. Deploy

### Environment Variables

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Where to get it | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API | Yes |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API | No |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack → Settings → API Keys | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack → Settings → API Keys | No |
| `NEXT_PUBLIC_SITE_URL` | `https://www.hairluksgudgh.com` | Yes |
| `NEXT_PUBLIC_BASE_URL` | Same as SITE_URL | Yes |
| `RESEND_API_KEY` | Resend → API Keys | No |
| `FROM_EMAIL` | e.g. `Hair Luk Gud GH <orders@hairluksgudgh.com>` | No |
| `LOG_LEVEL` | `info` (optional, default is `info`) | No |

---

## 5. Domain — Connect

1. In Vercel → Project → Settings → Domains → add `hairlookgood.com` (or your domain)
2. Vercel will give you DNS records — add them at your registrar:
   - **A record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com` (for `www`)
3. SSL is automatic via Vercel
4. Update these after domain is live:
   - `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_URL` in Vercel env vars
   - Supabase Auth → Site URL and Redirect URLs
   - Paystack → Webhook URL
   - Google OAuth → Authorized redirect URIs and JavaScript origins

---

## 6. Post-Deploy Verification

- [ ] Visit homepage — products load, images display
- [ ] Sign in with Google — redirects correctly, profile created
- [ ] Add to cart → checkout → Paystack popup opens (use test card if still in test mode)
- [ ] Complete a payment — order confirmation email arrives with item images
- [ ] Admin panel loads at `/admin` — dashboard shows stats
- [ ] Admin can create/edit products with image uploads to Supabase Storage
- [ ] Paystack webhook works — check Paystack dashboard for delivery status
- [ ] Cancel an order from admin — cancellation email arrives with items
- [ ] Check mobile responsiveness on admin and storefront

---

## 7. Optional: Seed Production Data

If starting fresh, add products through the admin panel. If you want seed data:

```bash
# Only if you want to copy seed data to production (careful!)
npx supabase db reset --linked
```

> **Warning**: `db reset --linked` drops and recreates the remote database. Only use on a fresh project with no real data.

---

## Notes

- **Never commit `.env.local`** — it contains secrets
- **Paystack test vs live**: switch keys when ready for real transactions
- **Supabase free tier**: 500MB database, 1GB storage, 50K auth users — sufficient for launch
- **Resend free tier**: 100 emails/day — upgrade when order volume grows
- **Vercel free tier**: sufficient for launch, upgrade if you need analytics or team features
