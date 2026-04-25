# Review Page Design — Lumina Consulting

**Date:** 2026-04-25
**Status:** Approved

---

## Overview

A dedicated public page (`/avis`) allowing past clients to submit a testimonial and star rating. Submissions are emailed to the studio owner via Resend for manual review before being added to Prismic and displayed in the Temoignages carousel.

---

## Architecture & Data Flow

### New files
- `app/pages/avis.vue` — review form page
- `server/api/review.post.ts` — API endpoint (Zod validation + Resend)

### Modified files
- `app/slices/Temoignages/index.vue` — always visible, add CTA + star display
- `app/slices/Temoignages/model.json` — add `rating` Number field (1–5, optional)

### Flow
1. Client visits homepage → Temoignages section (always visible) → clicks "Laisser un avis →"
2. Navigates to `/avis` → fills out form
3. Submits → `POST /api/review` → Resend email to `contact@luminaconsulting.fr`
4. Studio owner copies review into Prismic → appears in carousel

No new dependencies (Resend and Zod already in use).

---

## Temoignages Section Changes

### Always visible
Remove `v-if="items.length"` gate. Section always renders.

### Empty state
When no testimonials exist, show:
- Editorial label (existing `section-label`)
- Centered italic invitation line: *"Vos clients parlent mieux de vous que vous-même."*
- "Laisser un avis →" CTA button

### Populated state
Full carousel renders as now, with "Laisser un avis →" link below the navigation dots — small, unobtrusive.

### Star display in carousel
- Add optional `rating` field (Number, 1–5) to Temoignages model
- Render 5 stars above the attribution line: filled = `text-lumina-300`, empty = `text-lumina-200`
- If `rating` is absent, no stars rendered (no breaking change to existing entries)

---

## Review Page `/avis`

### Layout
Two-column layout mirroring `/contact`:
- Left: dark `bg-lumina-deep` editorial panel
- Right: white form panel

### Left panel
- Back link: ← Accueil (top-left)
- Radial glow + grain texture (same as `/contact`)
- Eyebrow: "Témoignage client"
- Heading italic: *"Votre avis compte."*
- Description: brief copy (~2 sentences) — takes 2 minutes, helps future clients, published after validation
- Attribute pills: "2 minutes", "Anonymisable", "Publié après validation"

### Right panel — form fields (in order)

| Field | Type | Required | Notes |
|---|---|---|---|
| Nom complet | text | Yes | |
| Adresse email | email | Yes | Note: "Non publié · uniquement pour vous remercier" |
| Projet | text | No | Placeholder: "ex : Mariage de Christiane & Stéphane" |
| Votre note | star rating | Yes | 5 stars, custom component, hover + click interaction |
| Votre témoignage | textarea | Yes | Placeholder: "Décrivez votre expérience…" |

### Star rating component
- 5 stars rendered as interactive elements
- Hover: stars fill progressively up to hovered index (scale + color)
- Click: locks selection
- Selected/filled: `text-lumina-300` / `bg-lumina-300`
- Empty: `text-lumina-200`
- Required — submit blocked until a star is selected

### Submit button
Same ghost-border style as `/contact`. States: idle → loading (spinner) → success / error.

### Success state
Replaces form with centered italic message: *"Merci infiniment. Votre avis a bien été reçu."*

### Error state
Inline message below form: *"Une erreur est survenue. Réessayez ou écrivez-moi directement."*

---

## API Endpoint — `POST /api/review`

### Request body (Zod schema)
```ts
z.object({
  nom:        z.string().min(1),
  email:      z.email(),
  projet:     z.string().optional(),
  note:       z.number().int().min(1).max(5),
  temoignage: z.string().min(10),
})
```

Invalid requests → 400.

### Email via Resend
- **To:** `contact@luminaconsulting.fr`
- **Subject:** `⭐ Nouvel avis — [nom] ([note]/5)`
- **Reply-to:** client's email
- **Body:** all fields formatted, plus a "Prismic-ready" block with exact copy-paste values for name, context, rating, and quote

---

## SEO
```ts
useSeoMeta({
  title: "Laisser un avis — Lumina Consulting",
  description: "Partagez votre expérience avec Lumina Consulting.",
})
```

No nav link — page is reached via the Temoignages CTA only.
