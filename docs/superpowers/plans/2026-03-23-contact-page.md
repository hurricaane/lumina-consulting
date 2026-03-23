# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/contact` page with a Cal.com booking CTA (primary) and a Resend-powered contact form (secondary).

**Architecture:** Static Vue page with no Prismic dependency. The form submits to a Nuxt server route that validates input, renders a Vue Email template, and sends via Resend. The Cal.com CTA is a plain external link — no embed.

**Tech Stack:** Nuxt 4, Vue 3, Resend SDK, `@vue-email/render`, `@vue-email/components`, `@vitejs/plugin-vue` (Nitro), motion-v, Zod, Tailwind CSS v4

---

## Prerequisites (complete before touching code)

1. **Resend API key** — get from Resend dashboard → API Keys. Add `RESEND_API_KEY=re_xxx` to `.env` locally and to Vercel environment variables (Settings → Environment Variables).
2. **Domain verification** — in Resend dashboard go to Authentication → Domains → add `luminaconsulting.fr` and add the required DNS records. **Do this before running Task 2 tests** — without it, Resend accepts the API call and returns `200` but the email is never delivered.
3. **Sender address** — `contact@luminaconsulting.fr` must belong to the verified domain. Resend verifies at the domain level, so once the domain is verified this address works.

---

## File Map

| Action | Path                         | Responsibility                                          |
| ------ | ---------------------------- | ------------------------------------------------------- |
| Modify | `shared/lib/env.ts`          | Add `RESEND_API_KEY` to Zod schema                      |
| Modify | `nuxt.config.ts`             | Add `nitro.rollupConfig` with `@vitejs/plugin-vue`      |
| Create | `server/api/contact.post.ts` | Validate body → render email → send via Resend          |
| Create | `app/pages/contact.vue`      | Full contact page UI (call block + separator + form)    |
| Exists | `emails/ContactEmail.vue`    | Vue Email template — already created, no changes needed |

---

## Task 1: Install packages + wire env

**Files:**

- Modify: `shared/lib/env.ts`
- Modify: `nuxt.config.ts`
- Modify: `.env` (local only — not committed)

- [ ] **Step 1: Install the four new packages**

```bash
pnpm add resend @vue-email/render @vue-email/components @vitejs/plugin-vue
```

Expected: packages installed, `package.json` updated with four new entries.

- [ ] **Step 2: Add `RESEND_API_KEY` to the Zod env schema**

Open `shared/lib/env.ts`. Current content:

```ts
const EnvSchema = z.object({
  NODE_ENV: z.string(),
});
```

Replace with:

```ts
const EnvSchema = z.object({
  NODE_ENV: z.string(),
  RESEND_API_KEY: z.string().min(1),
});
```

- [ ] **Step 3: Add `.env` entry locally**

Add to `.env` (never commit this file):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

Get the real key from the Resend dashboard (project → API Keys).

- [ ] **Step 4: Add Nitro vue plugin to `nuxt.config.ts`**

At the top of `nuxt.config.ts`, add the import after the existing `tailwindcss` import:

```ts
import vue from "@vitejs/plugin-vue";
```

Inside `defineNuxtConfig({...})`, add a new top-level key after `vite`:

```ts
nitro: {
  rollupConfig: {
    plugins: [vue()],
  },
},
```

The full `nuxt.config.ts` after the change:

```ts
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

// @ts-expect-error Don't know why this fires
import { apiEndpoint, repositoryName } from "./slicemachine.config.json";
import "./shared/lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2026-01-02",
  devtools: { enabled: true },

  app: {
    head: {
      title: "Lumina Consulting",
      titleTemplate: "%s",
      htmlAttrs: { lang: "fr" },
      meta: [{ charset: "utf-8" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    rollupConfig: {
      plugins: [vue()],
    },
  },

  modules: [
    "motion-v/nuxt",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/prismic",
    "@nuxtjs/seo",
    "@nuxt/ui",
  ],

  prismic: {
    endpoint: apiEndpoint || repositoryName,
    preview: "/api/preview",
    clientConfig: {
      routes: [
        { type: "page", uid: "home", path: "/" },
        { type: "page", path: "/:uid" },
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  colorMode: {
    preference: "light",
    fallback: "light",
  },

  site: {
    name: "Lumina Consulting",
    url: "https://luminaconsulting.fr",
  },
});
```

- [ ] **Step 5: Verify the app still starts**

```bash
pnpm nuxt:dev
```

Expected: dev server starts without errors. The build will fail if `RESEND_API_KEY` is missing from `.env`, so confirm the key is set.

- [ ] **Step 6: Commit**

```bash
git add shared/lib/env.ts nuxt.config.ts package.json pnpm-lock.yaml
git commit -m "feat: install resend + vue-email, wire RESEND_API_KEY env var, add nitro vue plugin"
```

---

## Task 2: Server route

**Files:**

- Create: `server/api/contact.post.ts`

The route reads `{ nom, email, message }` from the request body, validates them, renders `emails/ContactEmail.vue` to HTML using `@vue-email/render`, then sends via Resend.

- [ ] **Step 1: Create the server route file**

Create `server/api/contact.post.ts` with the following content:

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
    reply_to: email,
    subject: `Nouveau message — ${nom}`,
    html,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Erreur lors de l'envoi." });
  }

  return { success: true };
});
```

- [ ] **Step 2: Manually test the route**

With dev server running, use curl to hit the endpoint:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test User","email":"test@example.com","message":"Bonjour, ceci est un test."}'
```

Expected: `{"success":true}`. Then check the Resend dashboard (Emails tab) to confirm the email was actually delivered — if the domain is not yet verified, the API returns 200 but silently drops the message.

Test validation — missing name:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nom":"","email":"test@example.com","message":"Test"}'
```

Expected: HTTP 422 with `{"message":"Champs requis manquants."}`.

Test validation — bad email:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"notanemail","message":"Test"}'
```

Expected: HTTP 422 with `{"message":"Adresse email invalide."}`.

- [ ] **Step 3: Commit**

```bash
git add server/api/contact.post.ts
git commit -m "feat: add contact form server route (Resend + Vue Email)"
```

---

## Task 3: Contact page

**Files:**

- Create: `app/pages/contact.vue`

The page follows the same shell as `mentions-legales.vue`: `<section>` → `<UContainer>` → `max-w-[680px]` centered column, motion-v staggered animations. Two blocks: Cal.com (primary) + form (secondary), separated by an "ou" divider.

- [ ] **Step 1: Create `app/pages/contact.vue`**

```vue
<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

useSeoMeta({
  title: "Contact — Lumina Consulting",
  description: "Réservez un appel découverte de 30 minutes ou envoyez un message directement à Lumina Consulting.",
});

const ease: Easing = [0.16, 1, 0.3, 1];

const form = reactive({ nom: "", email: "", message: "" });
const status = ref<"idle" | "loading" | "success" | "error">("idle");

async function submit() {
  status.value = "loading";
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: form,
    });
    status.value = "success";
  }
  catch {
    status.value = "error";
  }
}
</script>

<template>
  <section class="py-[clamp(4rem,8vw,7rem)]">
    <UContainer>
      <div class="max-w-[680px] mx-auto">
        <!-- ─── Back link ───────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.45, ease }"
          class="mb-12"
        >
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/35 hover:text-primary transition-colors duration-300 group"
          >
            <span class="group-hover:-translate-x-0.5 transition-transform duration-300 ease-out">←</span>
            <span>Accueil</span>
          </NuxtLink>
        </motion.div>

        <!-- ─── Cal.com block ───────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.65, delay: 0.07, ease }"
        >
          <span class="section-label">Appel découverte · 30 min</span>
          <h1 class="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep italic mt-3 mb-5">
            Parlons de votre projet.
          </h1>
          <p class="text-[0.9375rem] leading-[1.8] text-lumina-deep/60 mb-8 max-w-[520px]">
            Un échange de 30 minutes pour comprendre votre projet, vos enjeux et voir si nous pouvons avancer ensemble. Gratuit, sans engagement.
          </p>
          <a
            href="https://cal.com/lumina-consulting-5ayxhb/30min"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-lumina inline-flex items-center gap-2"
          >
            Réserver un appel →
          </a>
          <p class="mt-4 text-[0.75rem] tracking-[0.08em] text-lumina-deep/30 uppercase font-medium">
            Gratuit · Sans engagement · Visio ou téléphone
          </p>
        </motion.div>

        <!-- ─── Separator ───────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.22, ease }"
          class="my-14 flex items-center gap-4"
        >
          <div class="flex-1 border-t border-lumina-100" />
          <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-deep/25 font-sans">
            ou
          </span>
          <div class="flex-1 border-t border-lumina-100" />
        </motion.div>

        <!-- ─── Form block ──────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, y: 14 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.55, delay: 0.3, ease }"
        >
          <span class="section-label">Écrire directement</span>

          <!-- Success state -->
          <p
            v-if="status === 'success'"
            class="font-display text-[1.375rem] italic text-lumina-deep/70 leading-[1.5] text-center py-10"
          >
            Message reçu. Je reviens vers vous sous 48h.
          </p>

          <!-- Form -->
          <form
            v-else
            class="mt-6 space-y-5"
            @submit.prevent="submit"
          >
            <div>
              <label for="nom" class="block text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-deep/40 mb-2">
                Nom complet
              </label>
              <input
                id="nom"
                v-model="form.nom"
                type="text"
                required
                autocomplete="name"
                class="w-full px-4 py-3 text-[0.9375rem] text-lumina-deep bg-white border border-lumina-100 rounded-none focus:outline-none focus:border-lumina-300 transition-colors duration-200 placeholder:text-lumina-deep/20"
                placeholder="Marie Dupont"
              >
            </div>

            <div>
              <label for="email" class="block text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-deep/40 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 text-[0.9375rem] text-lumina-deep bg-white border border-lumina-100 rounded-none focus:outline-none focus:border-lumina-300 transition-colors duration-200 placeholder:text-lumina-deep/20"
                placeholder="marie@exemple.fr"
              >
            </div>

            <div>
              <label for="message" class="block text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-deep/40 mb-2">
                Votre message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                required
                class="w-full px-4 py-3 text-[0.9375rem] text-lumina-deep bg-white border border-lumina-100 rounded-none focus:outline-none focus:border-lumina-300 transition-colors duration-200 placeholder:text-lumina-deep/20 resize-none"
                placeholder="Décrivez brièvement votre projet…"
              />
            </div>

            <!-- Error message -->
            <p v-if="status === 'error'" class="text-[0.8125rem] text-red-500/80">
              Une erreur est survenue. Réessayez ou écrivez-moi directement.
            </p>

            <button
              type="submit"
              :disabled="status === 'loading'"
              class="w-full sm:w-auto px-7 py-3 text-[0.8125rem] font-semibold tracking-[0.1em] uppercase border border-lumina-deep/20 text-lumina-deep/60 hover:border-lumina-deep/40 hover:text-lumina-deep/80 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ status === 'loading' ? 'Envoi en cours…' : 'Envoyer le message' }}
            </button>
          </form>
        </motion.div>
      </div>
    </UContainer>
  </section>
</template>
```

- [ ] **Step 2: Verify the page renders correctly in the browser**

Navigate to `http://localhost:3000/contact`. Check:

- Back link renders and points to `/`
- h1 "Parlons de votre projet." is visible in Lora italic
- "Réserver un appel →" button is visible
- "ou" separator divides the two blocks
- Form with 3 fields + submit button is visible
- Animations stagger from top to bottom

- [ ] **Step 3: Verify form states in the browser**

**Loading state:** Submit the form and watch the button text change to "Envoi en cours…" briefly.

**Success state:** After a successful submission, the form should disappear and the italic confirmation message should appear.

**Error state:** Temporarily break the server route (e.g., set a wrong API key in `.env`) and resubmit — the error message should appear below the button.

- [ ] **Step 4: Verify Cal.com link**

Click "Réserver un appel →" — it should open `https://cal.com/lumina-consulting-5ayxhb/30min` in a new tab.

- [ ] **Step 5: Commit**

```bash
git add app/pages/contact.vue
git commit -m "feat: add contact page (Cal.com CTA + Resend form)"
```

---

## Out of Scope

- Rate limiting on the server route
- reCAPTCHA / spam protection
- File attachments
