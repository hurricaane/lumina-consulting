# Footer Component Design

**Date:** 2026-02-26
**Approach:** B — Full CMS control

## Overview

Implement a 3-column footer matching the Lumina Consulting brand design. Content is driven by Prismic CMS via the Settings custom type. The component uses Nuxt UI's `UFooter` with left/center/right slots.

## Prismic Model Changes

Add 3 new fields to the "Footer" tab in `customtypes/settings/index.json`:

### `footer_navigation`

- **Type:** Repeatable Link
- **Config:** `allowText: true`, `allowTargetBlank: true`
- **Purpose:** Middle "EXPLORER" column navigation links

### `footer_social_links`

- **Type:** Group (repeatable)
- **Fields:**
  - `icon` — Select (options: `email`, `linkedin`, `twitter`, `instagram`, `website`)
  - `link` — Link (allowTargetBlank: true)
- **Purpose:** Left column social media icon buttons

### `footer_cta`

- **Type:** Link
- **Config:** `allowText: true`, `allowTargetBlank: true`
- **Purpose:** Right column "Prenez rendez-vous" CTA link

### Existing fields (unchanged)

- `footer_primary_text` — RichTextField — left column description text
- `footer_secondary_text` — RichTextField — right column body text

After updating the model, regenerate `prismicio-types.d.ts` via Slice Machine.

## Component Structure — `app/components/Footer.vue`

Uses `UFooter` with three named slots:

### `#left` — Logo column

- Hardcoded logo: asterisk icon + "LUMINA" text (consistent with Header)
- `<PrismicRichText>` for `footer_primary_text`
- Row of `UButton` (variant="ghost") icons mapped from `footer_social_links`:
  - `email` → `i-lucide-mail`
  - `linkedin` → `i-lucide-linkedin`
  - `twitter` → `i-lucide-twitter`
  - `instagram` → `i-lucide-instagram`
  - `website` → `i-lucide-globe`

### `#center` — Explorer column

- "EXPLORER" label (hardcoded, uppercase small caps — brand copy)
- `footer_navigation` links rendered as a vertical list

### `#right` — CTA column

- "PRENDRE VOUS" label (hardcoded — brand copy)
- `<PrismicRichText>` for `footer_secondary_text`
- `UButton` (variant="link") for `footer_cta`

## Files to Change

1. `customtypes/settings/index.json` — add 3 new fields
2. `prismicio-types.d.ts` — regenerate (or manually update) for new field types
3. `app/components/Footer.vue` — full rewrite to implement 3-column layout
