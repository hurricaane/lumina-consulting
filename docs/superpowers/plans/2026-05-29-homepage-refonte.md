# Homepage Refonte Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot luminaconsulting.fr from a generalist site to one targeting e-commerce brand founders, with 3 new Prismic slices, redesigned Expertise layout, updated content, and navigation.

**Architecture:** Reuse existing Hero, Expertise, Methodologie slices (content-only changes in Prismic). Create 3 new Prismic slices (Problemes, PourquoiLumina, CtaFinal) with model.json + Vue component each. Update the page custom type SliceZone, slice registry, homepage active sections, contact page copy, and provide all Prismic content ready to paste.

**Tech Stack:** Nuxt 4, Vue 3, TailwindCSS v4, Prismic CMS, motion-v, Lucide icons via Nuxt UI

**Spec:** `docs/superpowers/specs/2026-05-29-homepage-refonte-design.md`

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `app/slices/Problemes/model.json` | Prismic model: label, heading, items (icon, title, description) |
| `app/slices/Problemes/index.vue` | Vertical list layout with ghost numbers |
| `app/slices/PourquoiLumina/model.json` | Prismic model: label, heading, items (icon, title, description) |
| `app/slices/PourquoiLumina/index.vue` | Asymmetric 2-col layout, sticky heading left |
| `app/slices/CtaFinal/model.json` | Prismic model: heading, text, cta_link |
| `app/slices/CtaFinal/index.vue` | Centered CTA block with accent line |

### Modified files
| File | What changes |
|---|---|
| `app/slices/Expertise/model.json` | Add icon options: gem, zap, shield_check, handshake |
| `app/slices/Expertise/index.vue` | Layout from 3-col bordered to 2x2 glassmorphed cards, extended icon map |
| `app/slices/index.ts` | Register 3 new slices |
| `customtypes/page/index.json` | Add 3 new slices to SliceZone choices |
| `app/pages/index.vue` | Update useActiveSections |
| `app/pages/contact.vue` | Update SEO meta + hardcoded copy |

### Unchanged (preserved for reactivation)
| File | Note |
|---|---|
| `app/slices/Realisations/*` | Import kept in slices/index.ts |
| `app/slices/Temoignages/*` | Import kept in slices/index.ts |

---

## Task 1: Create Problemes slice model

**Files:**
- Create: `app/slices/Problemes/model.json`

- [ ] **Step 1: Create the Prismic model file**

```json
{
  "id": "problemes",
  "type": "SharedSlice",
  "name": "Problemes",
  "description": "Pain points section — vertical list layout",
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
            "placeholder": "Le constat"
          }
        },
        "heading": {
          "type": "StructuredText",
          "config": {
            "label": "Heading",
            "placeholder": "",
            "allowTargetBlank": false,
            "single": "heading2"
          }
        },
        "items": {
          "type": "Group",
          "config": {
            "label": "Items",
            "repeat": true,
            "fields": {
              "icon": {
                "type": "Select",
                "config": {
                  "label": "Icon",
                  "placeholder": "",
                  "options": [
                    "eye_off",
                    "clock",
                    "shield_off"
                  ]
                }
              },
              "title": {
                "type": "Text",
                "config": {
                  "label": "Title",
                  "placeholder": ""
                }
              },
              "description": {
                "type": "StructuredText",
                "config": {
                  "label": "Description",
                  "placeholder": "",
                  "allowTargetBlank": false,
                  "multi": "paragraph"
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

- [ ] **Step 2: Commit**

```bash
git add app/slices/Problemes/model.json
git commit -m "feat: add Problemes slice Prismic model"
```

---

## Task 2: Create Problemes slice component

**Files:**
- Create: `app/slices/Problemes/index.vue`

- [ ] **Step 1: Create the Vue component**

Layout: vertical list, each row = ghost number left + icon/title/description right. Hairline separators. No gradient background.

```vue
<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.ProblemesSlice>());

const ICON_MAP: Record<string, string> = {
  eye_off: "i-lucide-eye-off",
  clock: "i-lucide-clock",
  shield_off: "i-lucide-shield-off",
};

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    id="problemes"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)]"
  >
    <UContainer>
      <!-- Header -->
      <motion.div
        class="mb-16 md:mb-20 max-w-2xl"
        :initial="{ opacity: 0, y: 22 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
        :in-view-options="{ once: true }"
      >
        <span v-if="isFilled.keyText(slice.primary.label)" class="section-label">
          {{ slice.primary.label }}
        </span>
        <PrismicRichText
          v-if="isFilled.richText(slice.primary.heading)"
          :field="slice.primary.heading"
          :components="{
            heading2: {
              class:
                'font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.035em] leading-[1.1] text-lumina-deep mt-3 m-0',
            },
          }"
        />
      </motion.div>

      <!-- Items list -->
      <div v-if="isFilled.group(slice.primary.items)">
        <div class="h-px bg-lumina-100" />
        <motion.div
          v-for="(item, index) in slice.primary.items"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 py-10 md:py-14 border-b border-lumina-100"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: index * 0.1, ease }"
          :in-view-options="{ once: true }"
        >
          <!-- Ghost number -->
          <span
            aria-hidden="true"
            class="font-display text-[clamp(3rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em] text-lumina-200 tabular-nums select-none md:w-24 shrink-0"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </span>

          <!-- Content -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div
                v-if="isFilled.select(item.icon)"
                class="flex items-center justify-center size-9 rounded-xl bg-lumina-50 text-lumina-500 shrink-0"
              >
                <UIcon :name="ICON_MAP[item.icon ?? ''] ?? 'i-lucide-star'" class="size-4" />
              </div>
              <h3
                v-if="isFilled.keyText(item.title)"
                class="font-display text-xl font-medium tracking-[-0.02em] leading-snug text-lumina-deep"
              >
                {{ item.title }}
              </h3>
            </div>
            <PrismicRichText
              v-if="isFilled.richText(item.description)"
              :field="item.description"
              :components="{
                paragraph: {
                  class: 'text-[0.9375rem] leading-[1.8] text-[oklch(0.50_0.025_240)] m-0 max-w-[55ch]',
                },
              }"
            />
          </div>
        </motion.div>
      </div>
    </UContainer>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add app/slices/Problemes/index.vue
git commit -m "feat: add Problemes slice component — vertical list layout"
```

---

## Task 3: Redesign Expertise slice — glassmorphed 2x2 cards

**Files:**
- Modify: `app/slices/Expertise/model.json` (lines 51-59, icon options)
- Modify: `app/slices/Expertise/index.vue` (full template rewrite)

- [ ] **Step 1: Add new icon options to model.json**

In `app/slices/Expertise/model.json`, replace the icon options array (keeping old ones for backward compat):

```json
"options": [
  "pen_tool",
  "terminal",
  "rocket",
  "bar_chart",
  "users",
  "lightbulb",
  "target",
  "gem",
  "zap",
  "shield_check",
  "handshake"
]
```

- [ ] **Step 2: Rewrite Expertise component with 2x2 glassmorphed cards**

Replace the entire content of `app/slices/Expertise/index.vue`:

```vue
<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.ExpertiseSlice>());

const ICON_MAP: Record<string, string> = {
  pen_tool: "i-lucide-pen-tool",
  terminal: "i-lucide-terminal",
  rocket: "i-lucide-rocket",
  bar_chart: "i-lucide-bar-chart-2",
  users: "i-lucide-users",
  lightbulb: "i-lucide-lightbulb",
  target: "i-lucide-target",
  gem: "i-lucide-gem",
  zap: "i-lucide-zap",
  shield_check: "i-lucide-shield-check",
  handshake: "i-lucide-handshake",
};

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    id="expertises"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_25%,var(--color-lumina-50)_75%,var(--color-background)_100%)]"
  >
    <UContainer>
      <!-- Header -->
      <motion.div
        class="grid grid-cols-1 md:grid-cols-[5fr_3fr] items-end gap-8 md:gap-20 mb-16 md:mb-20"
        :initial="{ opacity: 0, y: 22 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
        :in-view-options="{ once: true }"
      >
        <div>
          <span v-if="isFilled.keyText(slice.primary.label)" class="section-label">
            {{ slice.primary.label }}
          </span>
          <PrismicRichText
            v-if="isFilled.richText(slice.primary.heading)"
            :field="slice.primary.heading"
            :components="{
              heading2: {
                class:
                  'font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.035em] leading-[1.1] text-lumina-deep mt-3 m-0',
              },
            }"
          />
        </div>

        <div v-if="isFilled.richText(slice.primary.description)" class="md:pb-1">
          <PrismicRichText
            :field="slice.primary.description"
            :components="{
              paragraph: {
                class: 'text-[0.9375rem] leading-[1.75] text-[oklch(0.50_0.025_240)] m-0',
              },
            }"
          />
        </div>
      </motion.div>

      <!-- 2x2 Cards grid -->
      <div v-if="isFilled.group(slice.primary.items)" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          v-for="(item, index) in slice.primary.items"
          :key="index"
          class="group flex flex-col gap-5 p-8 md:p-10 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-300"
          :initial="{ opacity: 0, y: 28 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.65, delay: index * 0.1, ease }"
          :in-view-options="{ once: true }"
        >
          <!-- Icon -->
          <div
            v-if="isFilled.select(item.icon)"
            class="flex items-center justify-center size-12 rounded-xl bg-lumina-50 text-lumina-500 group-hover:bg-lumina-100 group-hover:text-lumina-600 transition-colors duration-300"
          >
            <UIcon :name="ICON_MAP[item.icon ?? ''] ?? 'i-lucide-star'" class="size-5" />
          </div>

          <!-- Title -->
          <h3
            v-if="isFilled.keyText(item.title)"
            class="font-display text-xl font-medium tracking-[-0.02em] leading-snug text-lumina-deep"
          >
            {{ item.title }}
          </h3>

          <!-- Description -->
          <PrismicRichText
            v-if="isFilled.richText(item.description)"
            :field="item.description"
            :components="{
              paragraph: {
                class: 'text-sm leading-[1.8] text-[oklch(0.50_0.025_240)] m-0',
              },
            }"
          />
        </motion.div>
      </div>
    </UContainer>
  </section>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add app/slices/Expertise/model.json app/slices/Expertise/index.vue
git commit -m "feat: redesign Expertise slice — 2x2 glassmorphed cards layout"
```

---

## Task 4: Create PourquoiLumina slice model

**Files:**
- Create: `app/slices/PourquoiLumina/model.json`

- [ ] **Step 1: Create the Prismic model file**

```json
{
  "id": "pourquoi_lumina",
  "type": "SharedSlice",
  "name": "PourquoiLumina",
  "description": "Why Lumina — asymmetric 2-col with sticky heading",
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
            "placeholder": "Pourquoi Lumina"
          }
        },
        "heading": {
          "type": "StructuredText",
          "config": {
            "label": "Heading",
            "placeholder": "",
            "allowTargetBlank": false,
            "single": "heading2"
          }
        },
        "items": {
          "type": "Group",
          "config": {
            "label": "Items",
            "repeat": true,
            "fields": {
              "icon": {
                "type": "Select",
                "config": {
                  "label": "Icon",
                  "placeholder": "",
                  "options": [
                    "user_check",
                    "activity",
                    "flask_conical",
                    "trending_up"
                  ]
                }
              },
              "title": {
                "type": "Text",
                "config": {
                  "label": "Title",
                  "placeholder": ""
                }
              },
              "description": {
                "type": "StructuredText",
                "config": {
                  "label": "Description",
                  "placeholder": "",
                  "allowTargetBlank": false,
                  "multi": "paragraph"
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

- [ ] **Step 2: Commit**

```bash
git add app/slices/PourquoiLumina/model.json
git commit -m "feat: add PourquoiLumina slice Prismic model"
```

---

## Task 5: Create PourquoiLumina slice component

**Files:**
- Create: `app/slices/PourquoiLumina/index.vue`

- [ ] **Step 1: Create the Vue component**

Layout: asymmetric 2-col grid. Left = sticky heading. Right = stacked items with hairlines.

```vue
<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.PourquoiLuminaSlice>());

const ICON_MAP: Record<string, string> = {
  user_check: "i-lucide-user-check",
  activity: "i-lucide-activity",
  flask_conical: "i-lucide-flask-conical",
  trending_up: "i-lucide-trending-up",
};

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    id="pourquoi-lumina"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)]"
  >
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20">
        <!-- Left: sticky heading -->
        <motion.div
          class="md:sticky md:top-24 md:self-start"
          :initial="{ opacity: 0, y: 22 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, ease }"
          :in-view-options="{ once: true }"
        >
          <span v-if="isFilled.keyText(slice.primary.label)" class="section-label">
            {{ slice.primary.label }}
          </span>
          <PrismicRichText
            v-if="isFilled.richText(slice.primary.heading)"
            :field="slice.primary.heading"
            :components="{
              heading2: {
                class:
                  'font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium tracking-[-0.035em] leading-[1.1] text-lumina-deep mt-3 m-0 italic',
              },
            }"
          />
        </motion.div>

        <!-- Right: stacked items -->
        <div v-if="isFilled.group(slice.primary.items)">
          <div class="h-px bg-lumina-100" />
          <motion.div
            v-for="(item, index) in slice.primary.items"
            :key="index"
            class="py-8 md:py-10 border-b border-lumina-100"
            :initial="{ opacity: 0, y: 18 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: index * 0.08, ease }"
            :in-view-options="{ once: true }"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                v-if="isFilled.select(item.icon)"
                class="flex items-center justify-center size-9 rounded-xl bg-lumina-50 text-lumina-500 shrink-0"
              >
                <UIcon :name="ICON_MAP[item.icon ?? ''] ?? 'i-lucide-star'" class="size-4" />
              </div>
              <h3
                v-if="isFilled.keyText(item.title)"
                class="font-display text-lg font-medium tracking-[-0.02em] leading-snug text-lumina-deep"
              >
                {{ item.title }}
              </h3>
            </div>
            <PrismicRichText
              v-if="isFilled.richText(item.description)"
              :field="item.description"
              :components="{
                paragraph: {
                  class: 'text-[0.9375rem] leading-[1.8] text-[oklch(0.50_0.025_240)] m-0',
                },
              }"
            />
          </motion.div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add app/slices/PourquoiLumina/index.vue
git commit -m "feat: add PourquoiLumina slice component — asymmetric 2-col sticky layout"
```

---

## Task 6: Create CtaFinal slice (model + component)

**Files:**
- Create: `app/slices/CtaFinal/model.json`
- Create: `app/slices/CtaFinal/index.vue`

- [ ] **Step 1: Create the Prismic model file**

```json
{
  "id": "cta_final",
  "type": "SharedSlice",
  "name": "CtaFinal",
  "description": "Full-width closing CTA block",
  "variations": [
    {
      "id": "default",
      "name": "Default",
      "docURL": "...",
      "version": "initial",
      "description": "Default",
      "imageUrl": "",
      "primary": {
        "heading": {
          "type": "StructuredText",
          "config": {
            "label": "Heading",
            "placeholder": "",
            "allowTargetBlank": false,
            "single": "heading2"
          }
        },
        "text": {
          "type": "StructuredText",
          "config": {
            "label": "Text",
            "placeholder": "",
            "allowTargetBlank": false,
            "multi": "paragraph"
          }
        },
        "cta_link": {
          "type": "Link",
          "config": {
            "label": "CTA Link",
            "allowText": true,
            "allowTargetBlank": false,
            "select": null
          }
        }
      },
      "items": {}
    }
  ]
}
```

- [ ] **Step 2: Create the Vue component**

Centered, minimal. Gradient background. Accent line, display heading, subtext, dark rounded button. Matches Atelier closing CTA style.

```vue
<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.CtaFinalSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_30%,var(--color-lumina-50)_70%,var(--color-background)_100%)]"
  >
    <UContainer>
      <motion.div
        class="max-w-xl mx-auto text-center"
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
        :in-view-options="{ once: true }"
      >
        <!-- Accent line -->
        <motion.div
          :initial="{ scaleX: 0 }"
          :while-in-view="{ scaleX: 1 }"
          :transition="{ duration: 0.6, ease }"
          :in-view-options="{ once: true }"
          class="w-10 h-px bg-lumina-300/50 mx-auto mb-10 origin-left"
        />

        <!-- Heading -->
        <PrismicRichText
          v-if="isFilled.richText(slice.primary.heading)"
          :field="slice.primary.heading"
          :components="{
            heading2: {
              class:
                'font-display italic text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.03em] leading-[1.2] text-lumina-deep m-0',
            },
          }"
        />

        <!-- Subtext -->
        <PrismicRichText
          v-if="isFilled.richText(slice.primary.text)"
          :field="slice.primary.text"
          :components="{
            paragraph: {
              class: 'text-[0.9375rem] leading-[1.75] text-lumina-deep/60 mt-5 m-0',
            },
          }"
        />

        <!-- CTA button -->
        <motion.div
          v-if="isFilled.link(slice.primary.cta_link)"
          :initial="{ opacity: 0, y: 8 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.25, ease }"
          :in-view-options="{ once: true }"
          class="mt-10"
        >
          <PrismicLink
            :field="slice.primary.cta_link"
            class="group inline-flex items-center gap-3 px-7 py-3.5 bg-lumina-deep text-white text-[0.875rem] font-semibold tracking-[0.04em] rounded-full transition-all duration-300 hover:shadow-[0_8px_40px_oklch(0.25_0.04_240_/_0.22)] cursor-pointer"
          >
            <span>{{ slice.primary.cta_link.text || 'Discutons de votre projet' }}</span>
            <span class="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </PrismicLink>
        </motion.div>
      </motion.div>
    </UContainer>
  </section>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add app/slices/CtaFinal/model.json app/slices/CtaFinal/index.vue
git commit -m "feat: add CtaFinal slice — centered closing CTA block"
```

---

## Task 7: Register new slices and update page custom type

**Files:**
- Modify: `app/slices/index.ts` (add 3 imports)
- Modify: `customtypes/page/index.json` (add 3 slice choices)

- [ ] **Step 1: Add new slices to the registry**

In `app/slices/index.ts`, add three new entries to the `defineSliceZoneComponents` object. The file has a "DO NOT EDIT" comment from Slice Machine but we need to add entries for slices we created manually. Add after the existing entries:

```ts
// Code generated by Slice Machine. DO NOT EDIT.

import { defineSliceZoneComponents } from "@prismicio/vue";
import { defineAsyncComponent } from "vue";

export const components = defineSliceZoneComponents({
  atelier: defineAsyncComponent(() => import("./Atelier/index.vue")),
  temoignages: defineAsyncComponent(() => import("./Temoignages/index.vue")),
  expertise: defineAsyncComponent(() => import("./Expertise/index.vue")),
  methodologie: defineAsyncComponent(() => import("./Methodologie/index.vue")),
  realisations: defineAsyncComponent(() => import("./Realisations/index.vue")),
  rich_text: defineAsyncComponent(() => import("./Hero/index.vue")),
  problemes: defineAsyncComponent(() => import("./Problemes/index.vue")),
  pourquoi_lumina: defineAsyncComponent(() => import("./PourquoiLumina/index.vue")),
  cta_final: defineAsyncComponent(() => import("./CtaFinal/index.vue")),
});
```

- [ ] **Step 2: Add new slices to the page custom type SliceZone**

In `customtypes/page/index.json`, add three new entries in the `choices` object:

```json
{
  "id": "page",
  "label": "Page",
  "format": "page",
  "repeatable": true,
  "status": true,
  "json": {
    "Main": {
      "uid": {
        "type": "UID",
        "config": {
          "label": "UID",
          "placeholder": ""
        }
      },
      "slices": {
        "type": "Slices",
        "fieldset": "Slice Zone",
        "config": {
          "choices": {
            "realisations": {
              "type": "SharedSlice"
            },
            "methodologie": {
              "type": "SharedSlice"
            },
            "expertise": {
              "type": "SharedSlice"
            },
            "rich_text": {
              "type": "SharedSlice"
            },
            "atelier": {
              "type": "SharedSlice"
            },
            "temoignages": {
              "type": "SharedSlice"
            },
            "problemes": {
              "type": "SharedSlice"
            },
            "pourquoi_lumina": {
              "type": "SharedSlice"
            },
            "cta_final": {
              "type": "SharedSlice"
            }
          }
        }
      }
    },
    "SEO & Metadata": {
      "meta_title": {
        "type": "Text",
        "config": {
          "label": "Meta Title",
          "placeholder": ""
        }
      },
      "meta_description": {
        "type": "Text",
        "config": {
          "label": "Meta Description",
          "placeholder": ""
        }
      },
      "meta_image": {
        "type": "Image",
        "config": {
          "label": "Meta Image",
          "constraint": {
            "width": 2400,
            "height": 1260
          },
          "thumbnails": []
        }
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/slices/index.ts customtypes/page/index.json
git commit -m "feat: register new slices in SliceZone and page custom type"
```

---

## Task 8: Update homepage active sections

**Files:**
- Modify: `app/pages/index.vue` (line 6)

- [ ] **Step 1: Update useActiveSections call**

Change line 6 of `app/pages/index.vue` from:

```ts
useActiveSections(["expertises", "methodologie", "realisations", "temoignages"], "footer-sentinel");
```

to:

```ts
useActiveSections(["problemes", "expertises", "methodologie", "pourquoi-lumina"], "footer-sentinel");
```

- [ ] **Step 2: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: update active sections for new homepage structure"
```

---

## Task 9: Update contact page copy

**Files:**
- Modify: `app/pages/contact.vue` (lines 7-8, 113-114, 123-124)

- [ ] **Step 1: Update SEO meta**

Change lines 7-8 from:

```ts
  title: "Contact — Lumina Consulting",
  description: "Prenez rendez-vous pour un appel découverte de 30 minutes, ou envoyez un message directement. Premier contact gratuit et sans engagement.",
```

to:

```ts
  title: "Contact — Lumina Consulting · Sites e-commerce sur mesure",
  description: "Réservez un appel découverte de 30 minutes pour discuter de votre site e-commerce. Gratuit et sans engagement.",
```

- [ ] **Step 2: Update headline**

Change line 113-114 from:

```html
              Parlons de<br>votre projet.
```

to:

```html
              Parlons de votre<br>site e-commerce.
```

- [ ] **Step 3: Update description**

Change line 123-124 from:

```
              Partagez votre vision, vos enjeux, vos doutes. En 30 minutes, nous posons ensemble les premières bases de votre projet.
```

to:

```
              Partagez votre vision, vos enjeux, vos ambitions. En 30 minutes, nous posons ensemble les bases de votre futur site.
```

- [ ] **Step 4: Commit**

```bash
git add app/pages/contact.vue
git commit -m "feat: update contact page copy for e-commerce positioning"
```

---

## Task 10: Verify build and visual check

**Files:** None (verification only)

- [ ] **Step 1: Run the dev server**

```bash
npx nuxi dev
```

Expected: No build errors. The app should compile and start.

- [ ] **Step 2: Check type generation**

If Prismic types need regenerating for the new slices:

```bash
npx prismic-ts-codegen
```

This generates TypeScript types for `Content.ProblemesSlice`, `Content.PourquoiLuminaSlice`, `Content.CtaFinalSlice`.

- [ ] **Step 3: Visual check in browser**

Open `http://localhost:3000` and verify:
- Homepage loads without errors
- New sections appear when Prismic content is added
- Expertise shows 2x2 glassmorphed cards
- No console errors
- Navigation links work (scroll to sections)
- Contact page shows updated copy
- Responsive: check mobile layout for all sections

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: post-verification adjustments"
```

---

## Prismic Content Checklist (manual — not code)

After all code tasks are complete, update content in Prismic dashboard:

- [ ] **Page Home — Hero slice**: badge, title lines, text, CTAs (see spec Section 1)
- [ ] **Page Home — Add Problemes slice**: label, heading, 3 items (see spec Section 2)
- [ ] **Page Home — Expertise slice**: new label, heading, description, 4 items (see spec Section 3)
- [ ] **Page Home — Methodologie slice**: new label, heading, 4 items (see spec Section 4)
- [ ] **Page Home — Add PourquoiLumina slice**: label, heading, 4 items (see spec Section 5)
- [ ] **Page Home — Remove Temoignages slice** from page content
- [ ] **Page Home — Remove Realisations slice** from page content
- [ ] **Page Home — Add CtaFinal slice**: heading, text, cta_link (see spec Section 7)
- [ ] **Page Home — SEO tab**: meta_title + meta_description (see spec SEO section)
- [ ] **Settings — Navigation**: update links (Le constat → #problemes, Nos résultats → #expertises, Notre approche → #methodologie, Pourquoi Lumina → #pourquoi-lumina)
- [ ] **Settings — Navigation CTA**: label "Discutons", link /contact
- [ ] **Settings — Footer text**: new heading + paragraph (see spec Footer section)
- [ ] **Publish** the Home page and Settings documents
