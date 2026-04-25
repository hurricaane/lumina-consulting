# Review Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/avis` page where clients can leave a star-rated testimonial, submitted via email (Resend), with stars displayed in the Temoignages carousel once manually added to Prismic.

**Architecture:** Five sequential tasks — first push the Prismic model change (types regenerate), then update the Temoignages component to show stars and a persistent CTA, then build the email template, API endpoint, and review page. The contact page pattern is reused throughout.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, Tailwind CSS v4, motion-v, Resend + @vue-email, Zod v4, Prismic Slice Machine

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/slices/Temoignages/model.json` | Add `rating` Number field to items group |
| Modify | `app/slices/Temoignages/index.vue` | Star display in carousel + CTA + empty state |
| Create | `emails/ReviewEmail.vue` | Branded email template for review submissions |
| Create | `server/api/review.post.ts` | Zod validation + Resend delivery |
| Create | `app/pages/avis.vue` | Two-column review form page |

---

## Task 1: Add `rating` field to Temoignages Prismic model

**Files:**
- Modify: `app/slices/Temoignages/model.json`

> ⚠️ This task MUST be completed and pushed to Prismic before Task 2 — the TypeScript types won't include `rating` until after the push regenerates `prismicio-types.d.ts`.

- [ ] **Step 1: Add the rating field inside the `items` group**

Open `app/slices/Temoignages/model.json`. Inside `variations[0].primary.items.config.fields`, add `rating` after `context`:

```json
{
  "id": "temoignages",
  "type": "SharedSlice",
  "name": "Temoignages",
  "description": "Testimonials section",
  "variations": [
    {
      "id": "default",
      "name": "Default",
      "docURL": "...",
      "version": "initial",
      "description": "Default",
      "imageUrl": "",
      "primary": {
        "label": {
          "type": "Text",
          "config": {
            "label": "Label",
            "placeholder": "Ce qu'ils en disent"
          }
        },
        "items": {
          "type": "Group",
          "config": {
            "label": "Testimonials",
            "repeat": true,
            "fields": {
              "quote": {
                "type": "StructuredText",
                "config": {
                  "label": "Quote",
                  "placeholder": "",
                  "allowTargetBlank": false,
                  "multi": "paragraph,strong,em"
                }
              },
              "name": {
                "type": "Text",
                "config": {
                  "label": "Name",
                  "placeholder": "Christiane & Stéphane"
                }
              },
              "context": {
                "type": "Text",
                "config": {
                  "label": "Context (optional)",
                  "placeholder": "Mariage · Site événementiel"
                }
              },
              "rating": {
                "type": "Number",
                "config": {
                  "label": "Rating (1–5)",
                  "placeholder": "5"
                }
              }
            }
          }
        }
      },
      "items": {}
    }
  ]
}
```

- [ ] **Step 2: Push to Prismic via Slice Machine**

Start the dev server (which also starts Slice Machine): `pnpm dev`

Open Slice Machine at `http://localhost:9999`. Find the **Temoignages** slice, click **Push to Prismic**. Wait for the push to succeed.

- [ ] **Step 3: Verify types regenerated**

After the push, `prismicio-types.d.ts` should auto-update. Check that `TemoignagesSliceDefaultPrimaryItemsItem` now contains a `rating` field:

```bash
grep -A5 "Rating field" prismicio-types.d.ts
```

Expected output includes something like:
```
* Rating (1–5) field in *Temoignages
```

---

## Task 2: Update Temoignages slice component

**Files:**
- Modify: `app/slices/Temoignages/index.vue`

**Changes:**
1. Remove `v-if="items.length"` from `<section>` — always renders
2. Add star display above attribution in carousel
3. Add "Laisser un avis →" CTA after dots (populated) and as centered CTA (empty)
4. Add empty state content

- [ ] **Step 1: Replace `app/slices/Temoignages/index.vue` with the updated component**

```vue
<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

const props = defineProps(getSliceComponentProps<Content.TemoignagesSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];

const items = computed(() => props.slice.primary.items ?? []);
const total = computed(() => items.value.length);
const current = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

function goTo(index: number) {
  if (index === current.value)
    return;
  current.value = index;
  resetTimer();
}

function resetTimer() {
  if (timer)
    clearInterval(timer);
  if (total.value > 1) {
    timer = setInterval(() => {
      current.value = (current.value + 1) % total.value;
    }, 7000);
  }
}

onMounted(() => resetTimer());
onUnmounted(() => {
  if (timer)
    clearInterval(timer);
});
</script>

<template>
  <section
    id="temoignages"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_25%,var(--color-lumina-50)_75%,var(--color-background)_100%)]"
  >
    <UContainer>
      <motion.div
        class="max-w-2xl mx-auto text-center"
        :initial="{ opacity: 0, y: 22 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
        :in-view-options="{ once: true }"
      >
        <!-- Label -->
        <span
          v-if="isFilled.keyText(slice.primary.label)"
          class="section-label"
        >
          {{ slice.primary.label }}
        </span>

        <!-- ── Populated state ── -->
        <template v-if="items.length">
          <!-- Quote area -->
          <div class="relative mt-10">
            <!-- Ghost guillemet -->
            <span
              aria-hidden="true"
              class="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 font-display italic text-lumina-300/20 leading-none"
              style="font-size: clamp(7rem, 18vw, 12rem); top: -2.5rem; line-height: 1;"
            >«</span>

            <!-- Carousel -->
            <Transition name="temoignage" mode="out-in">
              <div :key="current" class="relative">
                <!-- Quote text -->
                <PrismicRichText
                  v-if="isFilled.richText(items[current].quote)"
                  :field="items[current].quote"
                  :components="{
                    paragraph: {
                      class: 'font-display italic text-[clamp(1.125rem,2.2vw,1.5rem)] leading-[1.8] tracking-[-0.01em] text-lumina-deep/70 m-0 [&+p]:mt-4',
                    },
                  }"
                />

                <!-- Attribution -->
                <div class="mt-8 flex flex-col items-center gap-1.5">
                  <div class="w-6 h-px bg-lumina-300/50" />

                  <!-- Stars -->
                  <div
                    v-if="items[current].rating"
                    class="flex items-center justify-center gap-0.5 mt-1"
                  >
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="text-[0.8125rem]"
                      :class="i <= (items[current].rating ?? 0) ? 'text-lumina-300' : 'text-lumina-200'"
                    >★</span>
                  </div>

                  <span
                    v-if="isFilled.keyText(items[current].name)"
                    class="text-[0.875rem] font-medium text-lumina-deep tracking-[0.04em] mt-1"
                  >
                    {{ items[current].name }}
                  </span>
                  <span
                    v-if="isFilled.keyText(items[current].context)"
                    class="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-lumina-deep/30"
                  >
                    {{ items[current].context }}
                  </span>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Navigation dots -->
          <div v-if="total > 1" class="flex items-center justify-center gap-2 mt-10">
            <button
              v-for="(_, index) in items"
              :key="index"
              class="size-1.5 rounded-full transition-all duration-300 cursor-pointer"
              :class="index === current
                ? 'bg-lumina-400 scale-125'
                : 'bg-lumina-200 hover:bg-lumina-300'"
              :aria-label="`Avis ${index + 1}`"
              @click="goTo(index)"
            />
          </div>

          <!-- CTA — subtle, below dots -->
          <div class="mt-8">
            <NuxtLink
              to="/avis"
              class="inline-flex items-center gap-1.5 text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-lumina-deep/25 hover:text-lumina-deep/50 transition-colors duration-300 group cursor-pointer"
            >
              <span>Laisser un avis</span>
              <span class="group-hover:translate-x-0.5 transition-transform duration-300 ease-out">→</span>
            </NuxtLink>
          </div>
        </template>

        <!-- ── Empty state ── -->
        <template v-else>
          <p class="font-display italic text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.8] text-lumina-deep/50 mt-10 mb-8">
            Vos clients parlent mieux de vous que vous-même.
          </p>
          <NuxtLink
            to="/avis"
            class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/40 hover:text-primary transition-colors duration-300 group cursor-pointer"
          >
            <span>Laisser un avis</span>
            <span class="group-hover:translate-x-0.5 transition-transform duration-300 ease-out">→</span>
          </NuxtLink>
        </template>
      </motion.div>
    </UContainer>
  </section>
</template>

<style scoped>
.temoignage-enter-active,
.temoignage-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}
.temoignage-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.temoignage-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
```

- [ ] **Step 2: Verify in the browser**

With `pnpm dev` running, visit `http://localhost:3000`. Scroll to the Temoignages section. Verify:
- Section is visible even if no items are in the slice (empty state with italic text + CTA link)
- If items exist: carousel renders, stars appear above name if `rating` is set in Prismic, "Laisser un avis →" link appears below dots
- Clicking "Laisser un avis →" navigates to `/avis` (which returns 404 until Task 5 is done — that's expected)

---

## Task 3: Create ReviewEmail.vue

**Files:**
- Create: `emails/ReviewEmail.vue`

- [ ] **Step 1: Create the email template**

```vue
<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@vue-email/components";

defineProps<{
  nom: string;
  email: string;
  projet?: string;
  note: number;
  temoignage: string;
}>();

// lumina-deep  oklch(0.18 0.04 240) ≈ #1a1d2e
// lumina-300   oklch(0.84 0.09 230) ≈ #89c8ef
// lumina-50    oklch(0.975 0.015 230) ≈ #f2f7fd
// lumina-100   oklch(0.945 0.035 230) ≈ #e5effa
// muted text   oklch(0.55 0.03 240) ≈ #7a8aaa
</script>

<template>
  <Html lang="fr" dir="ltr">
    <Head />

    <Preview>Nouvel avis {{ note }}/5 de {{ nom }} via luminaconsulting.fr</Preview>

    <Body style="background-color: #f2f7fd; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
      <!-- Top accent bar -->
      <Section style="background-color: #89c8ef; height: 3px; padding: 0; margin: 0;" />

      <!-- Header -->
      <Section style="background-color: #1a1d2e; padding: 28px 48px;">
        <Text style="color: #ffffff; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 13px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; margin: 0; padding: 0;">
          Lumina Consulting
        </Text>
      </Section>

      <!-- Main card -->
      <Container style="max-width: 560px; margin: 0 auto;">
        <Section style="background-color: #ffffff; padding: 48px 48px 40px 48px;">
          <!-- Eyebrow -->
          <Text style="color: #89c8ef; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; margin: 0 0 20px 0; padding: 0;">
            Nouvel avis client
          </Text>

          <!-- Reviewer name -->
          <Text style="color: #1a1d2e; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 30px; font-style: italic; font-weight: 400; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 12px 0; padding: 0;">
            {{ nom }}
          </Text>

          <!-- Stars -->
          <Text style="color: #89c8ef; font-size: 20px; margin: 0 0 36px 0; padding: 0; letter-spacing: 2px;">
            {{ "★".repeat(note) }}{{ "☆".repeat(5 - note) }}
            <span style="color: #7a8aaa; font-size: 13px; letter-spacing: 0; margin-left: 8px;">{{ note }}/5</span>
          </Text>

          <Hr style="border: none; border-top: 1px solid #e5effa; margin: 0 0 32px 0;" />

          <!-- Email row -->
          <Section style="margin: 0 0 20px 0; padding: 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 5px 0; padding: 0;">
              Email
            </Text>
            <Link
              :href="`mailto:${email}`"
              style="color: #89c8ef; font-size: 15px; text-decoration: none; line-height: 1.5;"
            >
              {{ email }}
            </Link>
          </Section>

          <!-- Projet row (optional) -->
          <Section v-if="projet" style="margin: 0 0 36px 0; padding: 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 5px 0; padding: 0;">
              Projet
            </Text>
            <Text style="color: #1a1d2e; font-size: 15px; line-height: 1.5; margin: 0; padding: 0;">
              {{ projet }}
            </Text>
          </Section>

          <!-- Témoignage block -->
          <Section style="background-color: #f2f7fd; border-left: 3px solid #89c8ef; padding: 22px 24px; margin: 0 0 36px 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 14px 0; padding: 0;">
              Témoignage
            </Text>
            <Text style="color: #1a1d2e; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.8; margin: 0; padding: 0; white-space: pre-wrap;">
              {{ temoignage }}
            </Text>
          </Section>

          <!-- Prismic-ready block -->
          <Section style="background-color: #1a1d2e; padding: 20px 24px; margin: 0;">
            <Text style="color: #89c8ef; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 12px 0; padding: 0;">
              Prêt à copier dans Prismic
            </Text>
            <Text style="color: #ffffff; font-size: 13px; line-height: 1.9; margin: 0; padding: 0; font-family: monospace;">
              Nom : {{ nom }}<br>
              Contexte : {{ projet || "(laisser vide)" }}<br>
              Note : {{ note }}<br>
              Témoignage : {{ temoignage }}
            </Text>
          </Section>
        </Section>

        <!-- Footer -->
        <Section style="padding: 24px 48px 40px 48px;">
          <Hr style="border: none; border-top: 1px solid #e5effa; margin: 0 0 24px 0;" />
          <Text style="color: #7a8aaa; font-size: 12px; text-align: center; margin: 0; padding: 0; line-height: 1.6;">
            <Link href="https://luminaconsulting.fr" style="color: #89c8ef; text-decoration: none;">
              luminaconsulting.fr
            </Link>
            &nbsp;·&nbsp; © 2026 Lumina Consulting
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
```

---

## Task 4: Create review API endpoint

**Files:**
- Create: `server/api/review.post.ts`

- [ ] **Step 1: Create the API route**

```ts
import { render } from "@vue-email/render";
import { Resend } from "resend";
import { z } from "zod";

import ReviewEmail from "../../emails/ReviewEmail.vue";
import env from "../../shared/lib/env";

const ReviewSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  projet: z.string().optional(),
  note: z.number().int().min(1).max(5),
  temoignage: z.string().min(10),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = ReviewSchema.safeParse(body);
  if (!result.success) {
    throw createError({ statusCode: 400, message: "Données invalides." });
  }

  const { nom, email, projet, note, temoignage } = result.data;

  const html = await render(ReviewEmail, { nom, email, projet, note, temoignage });

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Lumina Consulting <contact@luminaconsulting.fr>",
    to: ["contact@luminaconsulting.fr"],
    replyTo: email,
    subject: `${"⭐".repeat(note)} Nouvel avis — ${nom} (${note}/5)`,
    html,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Erreur lors de l'envoi." });
  }

  return { success: true };
});
```

- [ ] **Step 2: Verify the endpoint responds correctly**

With `pnpm dev` running, test a valid request:

```bash
curl -X POST http://localhost:3000/api/review \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test Client","email":"test@example.com","note":5,"temoignage":"Excellent travail, vraiment impressionnant."}'
```

Expected: `{"success":true}`

Test an invalid request (missing `note`):

```bash
curl -X POST http://localhost:3000/api/review \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@example.com","temoignage":"Court"}'
```

Expected: HTTP 400 with `{"message":"Données invalides."}`

---

## Task 5: Create review page `/avis`

**Files:**
- Create: `app/pages/avis.vue`

- [ ] **Step 1: Create the page**

```vue
<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

useSeoMeta({
  title: "Laisser un avis — Lumina Consulting",
  description: "Partagez votre expérience avec Lumina Consulting.",
});

const ease: Easing = [0.16, 1, 0.3, 1];
const easeOut: Easing = [0.0, 0.0, 0.2, 1];

const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "200px 200px",
};

const attrs = ["2 minutes", "Anonymisable", "Publié après validation"];

const form = reactive({
  nom: "",
  email: "",
  projet: "",
  note: 0,
  temoignage: "",
});

const hovered = ref<number | null>(null);
const starError = ref(false);
const status = ref<"idle" | "loading" | "success" | "error">("idle");

async function submit() {
  if (form.note === 0) {
    starError.value = true;
    return;
  }
  starError.value = false;
  status.value = "loading";
  try {
    await $fetch("/api/review", {
      method: "POST",
      body: {
        nom: form.nom,
        email: form.email,
        projet: form.projet || undefined,
        note: form.note,
        temoignage: form.temoignage,
      },
    });
    status.value = "success";
  }
  catch {
    status.value = "error";
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-5rem)] flex flex-col py-[clamp(3rem,5vw,5rem)]">
    <UContainer class="flex-1 flex flex-col">
      <!-- Back link -->
      <motion.div
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.45, ease }"
        class="mb-10"
      >
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/35 hover:text-primary transition-colors duration-300 group cursor-pointer"
        >
          <span class="group-hover:-translate-x-0.5 transition-transform duration-300 ease-out">←</span>
          <span>Accueil</span>
        </NuxtLink>
      </motion.div>

      <!-- Two-column grid -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
        <!-- LEFT PANEL — dark editorial -->
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.05, ease: easeOut }"
          class="relative bg-lumina-deep overflow-hidden flex flex-col justify-between p-10 sm:p-12 lg:p-14 min-h-[480px] lg:min-h-0"
        >
          <!-- Radial glow -->
          <motion.div
            :animate="{ opacity: [0.10, 0.17, 0.10] }"
            :transition="{ duration: 5, repeat: Infinity, ease: 'easeInOut' }"
            class="pointer-events-none absolute -top-20 -right-20 w-[28rem] h-[28rem] rounded-full"
            style="background: radial-gradient(circle, oklch(0.84 0.09 230) 0%, transparent 70%);"
          />

          <!-- Grain texture -->
          <div
            class="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
            :style="grainStyle"
          />

          <!-- Ghost watermark -->
          <motion.div
            :animate="{ y: [0, -10, 0] }"
            :transition="{ duration: 9, repeat: Infinity, ease: 'easeInOut' }"
            class="pointer-events-none absolute right-6 bottom-4 font-display italic text-white select-none leading-none"
            style="font-size: clamp(8rem, 18vw, 14rem); opacity: 0.04; letter-spacing: -0.04em;"
          >
            ★
          </motion.div>

          <!-- Top content -->
          <div class="relative z-10">
            <motion.div
              :initial="{ opacity: 0, x: -8 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.5, delay: 0.2, ease }"
              class="flex items-center gap-3 mb-6"
            >
              <div class="w-5 h-px bg-lumina-300/50" />
              <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-300/70">
                Témoignage client
              </span>
            </motion.div>

            <motion.h1
              :initial="{ opacity: 0, y: 16 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.65, delay: 0.3, ease }"
              class="font-display italic text-white leading-[1.05] tracking-[-0.03em] mb-8"
              style="font-size: clamp(2rem, 4.5vw, 3rem);"
            >
              Votre avis<br>compte.
            </motion.h1>

            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.55, delay: 0.44, ease }"
              class="text-[0.9375rem] leading-[1.8] text-white/45 max-w-[340px]"
            >
              En deux minutes, partagez votre expérience. Votre témoignage aide les futurs clients à se décider — et il me touche profondément.
            </motion.p>
          </div>

          <!-- Bottom content -->
          <div class="relative z-10">
            <div class="flex flex-wrap gap-2 mb-8">
              <motion.span
                v-for="(attr, i) in attrs"
                :key="attr"
                :initial="{ opacity: 0, y: 6 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.56 + i * 0.07, ease }"
                class="px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.08em] text-white/40 border border-white/[0.08] rounded-full"
              >
                {{ attr }}
              </motion.span>
            </div>
          </div>
        </motion.div>

        <!-- RIGHT PANEL — form -->
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.12, ease: easeOut }"
          class="bg-white border border-lumina-100 lg:border-l-0 flex flex-col p-10 sm:p-12 lg:p-14"
        >
          <!-- Section label -->
          <motion.div
            :initial="{ opacity: 0, x: 8 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.45, delay: 0.28, ease }"
            class="flex items-center gap-3 mb-10"
          >
            <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-deep/30">
              Votre témoignage
            </span>
            <div class="flex-1 h-px bg-lumina-100" />
          </motion.div>

          <!-- Success state -->
          <motion.div
            v-if="status === 'success'"
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease }"
            class="flex-1 flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              :initial="{ scaleX: 0 }"
              :animate="{ scaleX: 1 }"
              :transition="{ duration: 0.5, delay: 0.2, ease }"
              class="w-10 h-px bg-lumina-300 mb-8 mx-auto origin-left"
            />
            <p
              class="font-display italic text-lumina-deep/70 leading-[1.6]"
              style="font-size: clamp(1.25rem, 2.5vw, 1.5rem);"
            >
              Merci infiniment.<br>Votre avis a bien été reçu.
            </p>
            <motion.div
              :initial="{ scaleX: 0 }"
              :animate="{ scaleX: 1 }"
              :transition="{ duration: 0.5, delay: 0.35, ease }"
              class="w-10 h-px bg-lumina-300 mt-8 mx-auto origin-right"
            />
          </motion.div>

          <!-- Form -->
          <form
            v-else
            class="flex-1 flex flex-col"
            @submit.prevent="submit"
          >
            <div class="flex-1 space-y-8">
              <!-- Nom -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.38, ease }"
                class="relative"
              >
                <input
                  id="nom"
                  v-model="form.nom"
                  type="text"
                  required
                  autocomplete="name"
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="nom"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Nom complet
                </label>
              </motion.div>

              <!-- Email -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.5, ease }"
                class="relative"
              >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="email"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Adresse email
                </label>
                <p class="mt-1.5 text-[0.625rem] text-lumina-deep/25 tracking-[0.06em]">
                  Non publié · uniquement pour vous remercier
                </p>
              </motion.div>

              <!-- Projet -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.56, ease }"
                class="relative"
              >
                <input
                  id="projet"
                  v-model="form.projet"
                  type="text"
                  placeholder=" "
                  autocomplete="off"
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="projet"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Projet <span class="normal-case font-normal tracking-normal text-lumina-deep/20">(optionnel)</span>
                </label>
                <p class="mt-1.5 text-[0.625rem] text-lumina-deep/25 tracking-[0.06em]">
                  ex : Mariage de Christiane &amp; Stéphane
                </p>
              </motion.div>

              <!-- Note — star rating -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.62, ease }"
              >
                <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 mb-3">
                  Votre note
                </p>
                <div class="flex items-center gap-1">
                  <button
                    v-for="i in 5"
                    :key="i"
                    type="button"
                    class="text-[1.75rem] leading-none transition-all duration-150 hover:scale-110 cursor-pointer focus:outline-none"
                    :class="i <= (hovered ?? form.note) ? 'text-lumina-300' : 'text-lumina-200'"
                    :aria-label="`${i} étoile${i > 1 ? 's' : ''}`"
                    @mouseenter="hovered = i"
                    @mouseleave="hovered = null"
                    @click="form.note = i; starError = false"
                  >★</button>
                </div>
                <p v-if="starError" class="mt-2 text-[0.75rem] text-red-400/80">
                  Veuillez sélectionner une note.
                </p>
              </motion.div>

              <!-- Témoignage -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.68, ease }"
                class="relative"
              >
                <textarea
                  id="temoignage"
                  v-model="form.temoignage"
                  rows="4"
                  required
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent resize-none"
                />
                <label
                  for="temoignage"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Votre témoignage
                </label>
              </motion.div>
            </div>

            <!-- Error -->
            <motion.p
              v-if="status === 'error'"
              :initial="{ opacity: 0, y: -4 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.3, ease }"
              class="mt-6 text-[0.8125rem] text-red-400/80"
            >
              Une erreur est survenue. Réessayez ou écrivez-moi directement.
            </motion.p>

            <!-- Submit -->
            <motion.div
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ duration: 0.4, delay: 0.8, ease }"
              class="mt-10 flex items-center justify-between gap-6"
            >
              <button
                type="submit"
                :disabled="status === 'loading'"
                class="group inline-flex items-center gap-3 px-7 py-3.5 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase border border-lumina-deep/15 text-lumina-deep/50 hover:border-lumina-deep/30 hover:text-lumina-deep/80 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>{{ status === 'loading' ? 'Envoi en cours…' : 'Envoyer' }}</span>
                <span
                  v-if="status !== 'loading'"
                  class="transition-transform duration-300 group-hover:translate-x-0.5"
                >→</span>
                <span v-else class="w-3.5 h-3.5 border border-lumina-deep/30 border-t-lumina-deep/70 rounded-full animate-spin" />
              </button>
              <span class="text-[0.6875rem] text-lumina-deep/20 tracking-[0.06em]">
                Publié après validation
              </span>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </UContainer>
  </div>
</template>
```

- [ ] **Step 2: Verify the full flow in the browser**

With `pnpm dev` running:

1. Visit `http://localhost:3000/avis` — page loads with two-column layout
2. Left panel: dark background, breathing glow, italic ★ watermark, "Votre avis compte." heading, three attribute pills
3. Right panel: all 5 fields render, labels float on focus/fill
4. Click a star — it fills, adjacent lower stars fill, higher ones empty. Hover previews the fill.
5. Try to submit without selecting a star — see "Veuillez sélectionner une note." error
6. Fill all required fields + select a star, submit — see loading spinner, then success state with "Merci infiniment."
7. Check your inbox at `contact@luminaconsulting.fr` — email arrives with stars, all fields, and the Prismic-ready block
8. Check "Laisser un avis →" link in the Temoignages section on homepage — navigates to `/avis`

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
pnpm nuxt typecheck
```

Expected: no errors.
