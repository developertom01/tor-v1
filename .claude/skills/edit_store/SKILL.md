---
name: edit_store
description: Update an existing store's configuration — theme colors, landing page, contact info, categories, metadata, or Terraform config. Compares current values with requested changes and only modifies what's needed.
---

# Edit Store

You are editing an existing store in the tor monorepo. The user wants to change something about a store that's already been onboarded. Your job is to understand what they want changed, compare it to what's currently there, and make surgical updates — nothing more.

## Conversation Loop: Understand Before You Edit

**DO NOT edit any files until you know exactly what the user wants changed and have confirmed the plan.**

1. **Identify the store.** Check `$ARGUMENTS` for a store slug. If not provided, list the existing stores (check `apps/` directories) and ask which one.
2. **Read current state.** Once you know the store, read its key config files:
   - `apps/{slug}/src/store.config.ts` — name, tagline, domain, theme, categories, contact, hero
   - `apps/{slug}/src/app/globals.css` — brand colors, gradients, CSS utilities
   - `apps/{slug}/src/app/layout.tsx` — metadata, SEO
   - `apps/{slug}/src/app/page.tsx` — landing page content
   - `terraform/stores/{slug}/prod/terragrunt.hcl` — domain, from_email
   - `terraform/stores/{slug}/dev/terragrunt.hcl` — dev domain
   - `init/{slug}.yaml` — provisioning config
3. **Ask what they want to change.** If the user already said (e.g., "change the brand color to blue"), skip to step 4. If it's vague ("update the store"), ask: "What do you want to change? For example: brand colors, landing page copy, contact info, categories, domain, SEO metadata?"
4. **Show the diff.** Before editing, present a clear before/after comparison:
   ```
   Brand color 500: #ec4899 (pink) → #3b82f6 (blue)
   Hero gradient: linear-gradient(135deg, #831843...) → linear-gradient(135deg, #1e3a5f...)
   ```
   For landing page copy changes, quote the specific lines changing.
5. **Ask for confirmation.** "These are the changes I'll make. Go ahead?"
6. **Only after confirmation, make the edits.**

If the user's request is ambiguous or could affect multiple files, always clarify scope first.

### Logo and favicon changes

If the user wants to update the logo or favicon:

1. Ask for the path to the logo/icon file:
   > "Please give me the path to your logo file (PNG, JPG, SVG, WebP, etc.). I'll generate all favicon sizes from it automatically."
2. Wait for the user to provide the path.
3. Validate the path exists before making any changes. If missing:
   > "I couldn't find `{path}`. Please add the file and let me know when it's ready."
4. Once validated, process the logo using local tools:

**Step 1 — Remove background and vectorize (for raster logos)**

```python
# Install if needed: pip3 install rembg onnxruntime
from rembg import remove
from PIL import Image
import io

with open('{logo_path}', 'rb') as f:
    result = remove(f.read())
img = Image.open(io.BytesIO(result)).convert('RGBA')
img = img.crop(img.getbbox())  # trim transparent border
img.save('/tmp/{slug}_logo_nobg.png')
```

Then vectorize with potrace (install via `brew install potrace`):
```bash
# Convert to high-contrast grayscale BMP for potrace
python3 -c "
from PIL import Image
import numpy as np
img = Image.open('/tmp/{slug}_logo_nobg.png').convert('RGBA')
img = img.resize((img.width*3, img.height*3), Image.LANCZOS)
alpha = np.array(img)[:,:,3]
gray = Image.fromarray(np.array(img.convert('L')))
white_bg = Image.new('L', gray.size, 255)
white_bg.paste(gray, mask=Image.fromarray(alpha))
white_bg.save('/tmp/{slug}_trace.bmp')
"
potrace /tmp/{slug}_trace.bmp -s -o /tmp/{slug}_logo.svg --blacklevel 0.6 --alphamax 1.0 --opttolerance 0.2
```

After vectorizing, colorize the SVG to match brand colors (replace `fill="#000000"` with brand-appropriate color) and save to `apps/{slug}/public/logo.svg`.

**Step 2 — Generate favicons from the final SVG**

```bash
# Render at required sizes using rsvg-convert (install via brew install librsvg)
rsvg-convert -w 180 -h 180 apps/{slug}/public/logo.svg -o /tmp/{slug}-180.png
rsvg-convert -w 48 -h 48   apps/{slug}/public/logo.svg -o /tmp/{slug}-48.png
rsvg-convert -w 32 -h 32   apps/{slug}/public/logo.svg -o /tmp/{slug}-32.png
rsvg-convert -w 16 -h 16   apps/{slug}/public/logo.svg -o /tmp/{slug}-16.png
```

```python
# Assemble favicon.ico
from PIL import Image
import io, struct

def make_ico(size_paths, out_path):
    images = [(s, Image.open(p).convert('RGBA')) for s, p in size_paths]
    num_images = len(images)
    header = struct.pack('<HHH', 0, 1, num_images)
    png_datas = []
    for size, img in images:
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        png_datas.append(buf.getvalue())
    offset = 6 + 16 * num_images
    dir_entries = b''
    for i, (size, img) in enumerate(images):
        entry = struct.pack('<BBBBHHII', size, size, 0, 0, 1, 32, len(png_datas[i]), offset)
        dir_entries += entry
        offset += len(png_datas[i])
    with open(out_path, 'wb') as f:
        f.write(header + dir_entries + b''.join(png_datas))

APP = 'apps/{slug}/src/app'
make_ico([(16,'/tmp/{slug}-16.png'),(32,'/tmp/{slug}-32.png'),(48,'/tmp/{slug}-48.png')], f'{APP}/favicon.ico')
Image.open('/tmp/{slug}-32.png').save(f'{APP}/icon.png')
Image.open('/tmp/{slug}-180.png').save(f'{APP}/apple-touch-icon.png')
```

5. Update `store.config.ts` with `logo: '/logo.svg'`
6. Always preview the rendered SVG at nav size before finalizing: `rsvg-convert -w 300 -h 80 --keep-aspect-ratio logo.svg -o /tmp/preview.png`

## Change Propagation Map

When a value changes, you often need to update multiple files. Use this map:

| What changed | Files to update |
|---|---|
| **Brand colors** | `store.config.ts` (theme.brand), `globals.css` (@theme inline + .hero-gradient + .gold-gradient) |
| **Store name / display name** | `store.config.ts` (name), `layout.tsx` (metadata), `page.tsx` (copy referencing store name), `CLAUDE.md`, `init/{slug}.yaml`, terragrunt locals (display_name) |
| **Domain** | `store.config.ts` (domain), `init/{slug}.yaml`, `terraform/stores/{slug}/dev/terragrunt.hcl` (locals), `terraform/stores/{slug}/prod/terragrunt.hcl` (locals), `.env.example` |
| **Contact info** | `store.config.ts` (contact) only |
| **Categories** | `store.config.ts` (categories array), `supabase/seeds/{slug}.json` (remap every product's `category` field to match the new slugs — the seed script deletes and re-inserts all products on every run, so stale slugs will orphan products from their category), `page.tsx` (if categories are referenced in landing page copy) |
| **Hero / landing page copy** | `store.config.ts` (hero), `page.tsx` (landing page content) |
| **Landing page design** | `page.tsx` only |
| **Navbar** | `apps/{slug}/src/app/_components/Navbar.tsx` — each store has its own Navbar. Never modify `packages/ui/Navbar.tsx` for store-specific styling. |
| **Footer** | `apps/{slug}/src/app/_components/Footer.tsx` — each store has its own Footer. Never modify `packages/ui/Footer.tsx` for store-specific styling. |
| **Logo** | `store.config.ts` (`logo` field), `apps/{slug}/public/logo.svg` (the image file itself), update logo reference in store-specific `Navbar.tsx` and `Footer.tsx` if they render it directly |
| **Favicon** | `apps/{slug}/src/app/favicon.ico`, `icon.png`, `apple-touch-icon.png` in the same directory |
| **SEO metadata** | `layout.tsx` only |
| **Tagline** | `store.config.ts` (tagline) |
| **Testimonials** | `store.config.ts` (testimonials), `page.tsx` (if testimonials are inline rather than from config) |
| **From email** | `init/{slug}.yaml`, terragrunt locals (from_email) |
| **Seed products** | `supabase/seeds/{slug}.json` only |

## Rules

### Same rules as the main codebase

- **Never hardcode colors** in JSX. `brand-*` and `gold-*` Tailwind tokens only. Hex values only in `store.config.ts`, `globals.css` `@theme inline`, and CSS utility classes.
- **Never modify shared packages** (`packages/lib`, `packages/ui`, `packages/pages`, `packages/store`).
- **Never modify other stores'** files.
- **Never modify shared migrations** (`supabase/migrations/`).
- **Never modify shared Terraform modules** or shared infra (`terraform/modules/`, `terraform/shared/`).
- **Avoid `useEffect` for event-driven logic.** Handle mouse events, clicks, keyboard, focus/blur directly in event handler props. `useEffect` is only for true side-effects: data fetching on mount, syncing with an external system, or cleanup.
- **Never use native `<select>`.** Always use the custom `Select` component from `@tor/ui`. If the component lacks a needed feature (e.g. search, images in options), extend the shared component — don't use a native element or one-off solution.

### Edit-specific rules

- **Minimal changes.** Only touch files affected by the change. If the user wants a new tagline, update `store.config.ts` and nothing else.
- **Preserve what works.** Don't "improve" or refactor code that isn't part of the change request. If the landing page works fine and they just want a color change, don't rewrite the landing page.
- **Keep colors in sync.** If brand colors change, both `store.config.ts` and `globals.css` must be updated together. The hex values in `@theme inline` must match `store.config.ts`.

### Landing page changes

#### When to edit directly (no pipeline needed)

For contained changes, just edit the files. Do not spawn the UI pipeline:

- Changing copy (headline, tagline, CTA text, testimonials)
- Tweaking a single section (adjusting overlay opacity, reordering items, swapping an icon)
- Adding one new element to an existing section
- Fixing a layout bug

#### When to use the full UI pipeline (plan → build → QA loop)

Use the full pipeline when the user asks for any of these:
- A full landing page rebuild / redesign
- A completely new section being added
- A visual direction change (different hero layout, new section order, new visual rhythm)
- "Make it look different / better / more premium"

**Ask the user before starting the pipeline:**
> "This sounds like a full redesign. I'll run the full UI planning and build pipeline — it will plan the new design, build it, and QA it automatically. This takes longer than a direct edit. Want to proceed?"

Only proceed after they confirm.

#### Full UI pipeline

**Step 1 — Upload images**

Spawn **9 `find-upload-image` agents in a single message in parallel** — 3 images × 3 envs (local, dev, prod):

| Agent | description | filename | storage_path | env |
|-------|-------------|----------|-------------|-----|
| 1 | "{store vibe} image 1" | `{slug}-hero-1.jpg` | `assets/{slug}-hero-1.jpg` | `local` |
| 2 | "{store vibe} image 2" | `{slug}-hero-2.jpg` | `assets/{slug}-hero-2.jpg` | `local` |
| 3 | "{store vibe} image 3" | `{slug}-hero-3.jpg` | `assets/{slug}-hero-3.jpg` | `local` |
| 4 | "{store vibe} image 1" | `{slug}-hero-1.jpg` | `assets/{slug}-hero-1.jpg` | `dev` |
| 5 | "{store vibe} image 2" | `{slug}-hero-2.jpg` | `assets/{slug}-hero-2.jpg` | `dev` |
| 6 | "{store vibe} image 3" | `{slug}-hero-3.jpg` | `assets/{slug}-hero-3.jpg` | `dev` |
| 7 | "{store vibe} image 1" | `{slug}-hero-1.jpg` | `assets/{slug}-hero-1.jpg` | `prod` |
| 8 | "{store vibe} image 2" | `{slug}-hero-2.jpg` | `assets/{slug}-hero-2.jpg` | `prod` |
| 9 | "{store vibe} image 3" | `{slug}-hero-3.jpg` | `assets/{slug}-hero-3.jpg` | `prod` |

Wait for all agents. Collect the 3 confirmed `storage_path` values. If any env failed (missing config, bucket not ready), note it with a ⚠️ and proceed.

Reference images via env var — never commit to `public/`:
```ts
const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
```

**Step 2 — Plan the UI**

Spawn a single **`ui_ux_agent`** with the store's full config and confirmed image paths. Wait for it to return `agent_work/{slug}.ui_plan.md`. Do not proceed until the plan exists.

**Step 3 — Build + QA loop (max 10 iterations)**

Iteration 1:
1. Spawn `ui_builder`: `slug={slug} plan=agent_work/{slug}.ui_plan.md`
2. Wait. Then spawn `ui_qa`: `slug={slug} plan=agent_work/{slug}.ui_plan.md`
3. Wait for the QA report.

Iterations 2–10:
1. If `Status: PASS` → done.
2. If `Status: ISSUES FOUND` → capture the full report, spawn `ui_builder` again: `slug={slug} plan=agent_work/{slug}.ui_plan.md qa_report={full report text}`. The builder fixes only flagged issues. Re-run `ui_qa`.
3. After 10 iterations still failing → report remaining issues to the user and stop.

## Uploading images to Supabase Storage

Use `doppler run` to inject credentials — never pull secrets locally or hardcode them.

```bash
# Upload to dev
doppler run --project {slug} --config dev -- node -e "
const https = require('https'), fs = require('fs');
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;
// ... upload logic using https module
"

# Upload to prod
doppler run --project {slug} --config prod -- node /tmp/upload-script.js
```

Write the upload script to `/tmp/upload-{slug}.js` so it can be reused for multiple envs. Always create the bucket first (POST `/storage/v1/bucket` with `public: true`) before uploading objects.

## Reference Files

Read these to understand exact formats before editing:

- **StoreConfig type**: `packages/store/index.ts`
- **Example store config**: `apps/hairlukgud/src/store.config.ts`
- **Example globals.css**: `apps/hairlukgud/src/app/globals.css`
- **Example layout.tsx**: `apps/aseesthreads/src/app/layout.tsx` (imports from local `_components/`)
- **Example Navbar**: `apps/aseesthreads/src/app/_components/Navbar.tsx` (store-specific, dark brand nav)
- **Example Footer**: `apps/aseesthreads/src/app/_components/Footer.tsx` (store-specific, brand-colored footer)
- **Example page.tsx**: `apps/aseesthreads/src/app/page.tsx` (best reference — server component composing client sections with image/parallax/overlay pattern)
- **Example hero**: `apps/aseesthreads/src/app/_components/HeroSection.tsx` (parallax + image carousel)
- **Example image section**: `apps/aseesthreads/src/app/_components/ValuesSection.tsx` (background image + overlay + backdrop-blur cards)
- **Example CTA**: `apps/aseesthreads/src/app/_components/CtaSection.tsx` (parallax scale + image background)
- **Example terragrunt**: `terraform/stores/hairfordays/prod/terragrunt.hcl`
- **Example init yaml**: `init/hairlukgud.yaml`
