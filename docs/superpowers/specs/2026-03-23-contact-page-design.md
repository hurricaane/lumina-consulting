# Contact Page — Design Spec

**Date:** 2026-03-23
**Project:** Lumina Consulting (`luminaconsulting.fr`)
**Status:** Approved

---

## Overview

A static Vue page at `/contact` with two conversion paths: Cal.com call booking (primary) and a minimal contact form via Resend + Vue Email (secondary). Call-first layout — the booking CTA dominates visually, the form is a quiet alternative below.

---

## Architecture

- **Page:** `app/pages/contact.vue` — static Vue page, no Prismic
- **Server route:** `server/api/contact.post.ts` — Nuxt server route, validates input, renders email with Vue Email, sends via Resend
- **Email template:** `emails/ContactEmail.vue` — Vue Email component
- **Packages to install:**
  - `resend` — Resend Node.js SDK
  - `@vue-email/render` — renders Vue email components to HTML
  - `@vue-email/components` — email-safe UI primitives (Html, Body, Text, Section, etc.)
  - `@vitejs/plugin-vue` — required for Nitro to process `.vue` files server-side
- **Env var:** `RESEND_API_KEY` — declared in `shared/lib/env.ts` (Zod), accessed via `import env from '~/shared/lib/env'` then `env.RESEND_API_KEY`

---

## Config changes

### `shared/lib/env.ts`

Add `RESEND_API_KEY` to the Zod schema so the build fails loudly if the key is missing:

```ts
const EnvSchema = z.object({
  NODE_ENV: z.string(),
  RESEND_API_KEY: z.string().min(1),
});
```

### `nuxt.config.ts`

One addition — allow Nitro to process `.vue` email templates server-side:

```ts
import vue from '@vitejs/plugin-vue'

// inside defineNuxtConfig:
nitro: {
  rollupConfig: {
    plugins: [vue()],
  },
},
```

---

## Layout (single column, max-w-[680px] centered)

### Top

- `← Accueil` back link (same pattern as legal pages)

### Cal.com block (primary)

- `section-label`: "Appel découverte · 30 min"
- `h1` Lora italic: "Parlons de votre projet."
- Short description (~2 lines): free, no commitment, 30 min call
- `btn-lumina` button: "Réserver un appel →"
  ```html
  <a href="https://cal.com/lumina-consulting-5ayxhb/30min" target="_blank" rel="noopener noreferrer">
    Réserver un appel →
  </a>
  ```
- Subtle note below button: "Gratuit · Sans engagement · Visio ou téléphone"

### Separator

Thin `border-lumina-100` line + centred "ou" label (DM Sans, uppercase, tracked)

### Form block (secondary)

- `section-label`: "Écrire directement"
- Fields: Nom complet (text), Adresse email (email), Votre message (textarea, 4 rows)
- Submit button: secondary/outline style, label "Envoyer le message"

### Form states

| State   | Behaviour                                                                                     |
| ------- | --------------------------------------------------------------------------------------------- |
| Idle    | Form visible, button enabled                                                                  |
| Loading | Button disabled, text "Envoi en cours…"                                                       |
| Success | Form replaced by Lora italic centred: "Message reçu. Je reviens vers vous sous 48h."          |
| Error   | Inline message below button: "Une erreur est survenue. Réessayez ou écrivez-moi directement." |

### Animations

`motion-v` with `:animate` (not `whileInView` — content is above the fold), staggered reveals between Cal.com block and form block.

---

## Email Template — `emails/ContactEmail.vue`

A Vue Email component using `@vue-email/components` primitives (no `E` prefix — `Html`, `Body`, `Container`, etc.). Receives props: `nom`, `email`, `message`. Fully styled inline to match the Lumina brand — no manual HTML string interpolation, no escaping concerns.

**Visual structure:**

1. 3px baby blue (`#89c8ef`) accent bar at top
2. Dark header (`#1a1d2e`) with "Lumina Consulting" in white spaced uppercase Georgia
3. White card: eyebrow label, sender name in Georgia italic (large), HR, De/Email rows, message block with left blue border
4. Light footer with `luminaconsulting.fr` link

**Brand colours used (email-safe hex):**

- `#1a1d2e` — lumina-deep
- `#89c8ef` — lumina-300 (baby blue)
- `#f2f7fd` — lumina-50 (background tint)
- `#e5effa` — lumina-100 (borders)
- `#7a8aaa` — muted text

---

## Server Route — `server/api/contact.post.ts`

```ts
import { render } from "@vue-email/render";
import { Resend } from "resend";

import ContactEmail from "~/emails/ContactEmail.vue";
import env from "~/shared/lib/env";

export default defineEventHandler(async (event) => {
  const { nom, email, message } = await readBody(event);

  // Validation
  if (!nom?.trim() || !message?.trim()) {
    throw createError({ statusCode: 422, message: "Champs requis manquants." });
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 422, message: "Adresse email invalide." });
  }

  // Render email template
  const html = await render(ContactEmail, { nom, email, message });

  // Send via Resend
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Lumina Consulting <contact@luminaconsulting.fr>",
    to: ["dossouyannick.pro@gmail.com"],
    reply_to: email, // replies go to the form submitter
    subject: `Nouveau message — ${nom}`,
    html,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Erreur lors de l'envoi." });
  }

  return { success: true };
});
```

### Responses

- `200 { success: true }` — email sent
- `422` — validation failed
- `500` — Resend error

---

## SEO

```ts
useSeoMeta({
  title: "Contact — Lumina Consulting",
  description: "Réservez un appel découverte de 30 minutes ou envoyez un message directement à Lumina Consulting.",
});
```

---

## Prerequisites

1. `pnpm add resend @vue-email/render @vue-email/components @vitejs/plugin-vue`
2. `RESEND_API_KEY` added to `.env` locally and Vercel environment variables
3. Domain `luminaconsulting.fr` verified in Resend dashboard (DNS records)
4. Sender address `contact@luminaconsulting.fr` confirmed in Resend

---

## Out of Scope (follow-up)

- Rate limiting on the server route (recommended before launch)
- reCAPTCHA / spam protection
- File attachments
- Email reply-to threading / conversation history
