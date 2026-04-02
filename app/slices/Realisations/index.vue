<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

const props = defineProps(getSliceComponentProps<Content.RealisationsSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];

const items = computed(() => props.slice.primary.items ?? []);

// Layout mode:
//   "pair"   — exactly 2 items: equal 2-col grid, no orphan
//   "solo"   — 1 item: full-width cinematic
//   "many"   — 3+ items: first is hero, rest fill a 2-col grid
const layout = computed(() => {
  if (items.value.length === 1)
    return "solo";
  if (items.value.length === 2)
    return "pair";
  return "many";
});
</script>

<template>
  <section
    id="realisations"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)]"
  >
    <UContainer>
      <!-- ─── Header ──────────────────────────────────────────────── -->
      <motion.div
        class="mb-14 md:mb-16"
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
                'font-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep mt-3 m-0 italic',
            },
          }"
        />
      </motion.div>

      <!-- ─── Cards ─────────────────────────────────────────────────── -->
      <div v-if="items.length">
        <!-- ── PAIR: 2 equal columns ── -->
        <div
          v-if="layout === 'pair'"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          <motion.div
            v-for="(item, index) in items"
            :key="index"
            class="group relative overflow-hidden rounded-2xl"
            :initial="{ opacity: 0, y: 36 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, delay: index * 0.12, ease }"
            :in-view-options="{ once: true }"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <PrismicImage
                v-if="isFilled.image(item.image)"
                :field="item.image"
                class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 bg-lumina-100" />

              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/95 via-lumina-deep/40 to-transparent" />

              <!-- Badge -->
              <div v-if="isFilled.keyText(item.badge)" class="absolute top-4 right-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-white/80">
                  <span class="size-1.5 rounded-full bg-lumina-300 shrink-0" />
                  {{ item.badge }}
                </span>
              </div>

              <!-- Text overlay -->
              <div class="absolute inset-x-0 bottom-0 p-7 md:p-8">
                <span
                  v-if="isFilled.keyText(item.category)"
                  class="block text-[0.625rem] font-semibold tracking-[0.2em] text-white/65 uppercase mb-2.5 group-hover:-translate-y-0.5 transition-transform duration-500"
                >
                  {{ item.category }}
                </span>
                <h3
                  v-if="isFilled.keyText(item.title)"
                  class="font-display italic text-[clamp(1.375rem,2.5vw,1.875rem)] font-medium tracking-[-0.03em] text-white leading-snug group-hover:-translate-y-0.5 transition-transform duration-500"
                >
                  {{ item.title }}
                </h3>
                <p
                  v-if="isFilled.keyText(item.description)"
                  class="text-[0.8125rem] text-white/70 mt-2 leading-relaxed group-hover:-translate-y-0.5 transition-transform duration-500 delay-[20ms]"
                >
                  {{ item.description }}
                </p>

                <!-- Hover CTA -->
                <div
                  class="mt-4 flex items-center gap-2 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out"
                >
                  <span class="w-4 h-px bg-lumina-300 shrink-0" />
                  <span class="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-300">
                    Voir le projet
                  </span>
                </div>
              </div>
            </div>

            <PrismicLink
              v-if="isFilled.link(item.link)"
              :field="item.link"
              class="absolute inset-0 cursor-pointer"
              :aria-label="item.title ?? 'Voir le projet'"
            />
          </motion.div>
        </div>

        <!-- ── SOLO: one full-width cinematic card ── -->
        <motion.div
          v-else-if="layout === 'solo'"
          class="group relative overflow-hidden rounded-2xl"
          :initial="{ opacity: 0, y: 36 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.75, ease }"
          :in-view-options="{ once: true }"
        >
          <div class="relative aspect-4/3 md:aspect-[16/7] overflow-hidden">
            <PrismicImage
              v-if="isFilled.image(items[0].image)"
              :field="items[0].image"
              class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div v-else class="absolute inset-0 bg-lumina-100" />
            <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/95 via-lumina-deep/40 to-transparent" />
            <div v-if="isFilled.keyText(items[0].badge)" class="absolute top-4 right-4">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-white/80">
                <span class="size-1.5 rounded-full bg-lumina-300 shrink-0" />
                {{ items[0].badge }}
              </span>
            </div>
            <div class="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <span
                v-if="isFilled.keyText(items[0].category)"
                class="block text-[0.625rem] font-semibold tracking-[0.2em] text-white/65 uppercase mb-2.5"
              >
                {{ items[0].category }}
              </span>
              <h3
                v-if="isFilled.keyText(items[0].title)"
                class="font-display italic text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-[-0.035em] text-white leading-snug"
              >
                {{ items[0].title }}
              </h3>
              <p v-if="isFilled.keyText(items[0].description)" class="text-[0.875rem] text-white/70 mt-2.5">
                {{ items[0].description }}
              </p>
              <div class="mt-5 flex items-center gap-2 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
                <span class="w-4 h-px bg-lumina-300 shrink-0" />
                <span class="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-300">Voir le projet</span>
              </div>
            </div>
          </div>
          <PrismicLink
            v-if="isFilled.link(items[0].link)"
            :field="items[0].link"
            class="absolute inset-0 cursor-pointer"
            :aria-label="items[0].title ?? 'Voir le projet'"
          />
        </motion.div>

        <!-- ── MANY: hero card + 2-col grid ── -->
        <div v-else class="space-y-4 md:space-y-5">
          <!-- Hero — first item, full width -->
          <motion.div
            class="group relative overflow-hidden rounded-2xl"
            :initial="{ opacity: 0, y: 36 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.75, ease }"
            :in-view-options="{ once: true }"
          >
            <div class="relative aspect-4/3 md:aspect-[16/7] overflow-hidden">
              <PrismicImage
                v-if="isFilled.image(items[0].image)"
                :field="items[0].image"
                class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 bg-lumina-100" />
              <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/95 via-lumina-deep/40 to-transparent" />
              <div v-if="isFilled.keyText(items[0].badge)" class="absolute top-4 right-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-white/80">
                  <span class="size-1.5 rounded-full bg-lumina-300 shrink-0" />
                  {{ items[0].badge }}
                </span>
              </div>
              <div class="absolute inset-x-0 bottom-0 p-8 md:p-12 flex items-end justify-between gap-6">
                <div class="group-hover:-translate-y-0.5 transition-transform duration-500">
                  <span
                    v-if="isFilled.keyText(items[0].category)"
                    class="block text-[0.625rem] font-semibold tracking-[0.2em] text-white/65 uppercase mb-2.5"
                  >
                    {{ items[0].category }}
                  </span>
                  <h3
                    v-if="isFilled.keyText(items[0].title)"
                    class="font-display italic text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-[-0.035em] text-white leading-snug"
                  >
                    {{ items[0].title }}
                  </h3>
                  <p v-if="isFilled.keyText(items[0].description)" class="text-[0.875rem] text-white/70 mt-2.5">
                    {{ items[0].description }}
                  </p>
                </div>
                <div class="shrink-0 flex items-center gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out pb-0.5">
                  <span class="w-4 h-px bg-lumina-300 shrink-0" />
                  <span class="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-300 whitespace-nowrap">Voir le projet</span>
                </div>
              </div>
            </div>
            <PrismicLink
              v-if="isFilled.link(items[0].link)"
              :field="items[0].link"
              class="absolute inset-0 cursor-pointer"
              :aria-label="items[0].title ?? 'Voir le projet'"
            />
          </motion.div>

          <!-- Secondary grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <motion.div
              v-for="(item, index) in items.slice(1)"
              :key="index + 1"
              class="group relative overflow-hidden rounded-2xl"
              :initial="{ opacity: 0, y: 36 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.7, delay: index * 0.12, ease }"
              :in-view-options="{ once: true }"
            >
              <div class="relative aspect-4/3 overflow-hidden">
                <PrismicImage
                  v-if="isFilled.image(item.image)"
                  :field="item.image"
                  class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-lumina-100" />
                <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/95 via-lumina-deep/40 to-transparent" />
                <div v-if="isFilled.keyText(item.badge)" class="absolute top-4 right-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-white/80">
                    <span class="size-1.5 rounded-full bg-lumina-300 shrink-0" />
                    {{ item.badge }}
                  </span>
                </div>
                <div class="absolute inset-x-0 bottom-0 p-6 md:p-7 group-hover:-translate-y-0.5 transition-transform duration-500">
                  <span
                    v-if="isFilled.keyText(item.category)"
                    class="block text-[0.625rem] font-semibold tracking-[0.2em] text-white/65 uppercase mb-2.5"
                  >
                    {{ item.category }}
                  </span>
                  <h3
                    v-if="isFilled.keyText(item.title)"
                    class="font-display italic text-[clamp(1.25rem,2vw,1.625rem)] font-medium tracking-[-0.03em] text-white leading-snug"
                  >
                    {{ item.title }}
                  </h3>
                  <p v-if="isFilled.keyText(item.description)" class="text-[0.8125rem] text-white/70 mt-2">
                    {{ item.description }}
                  </p>
                  <div class="mt-4 flex items-center gap-2 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
                    <span class="w-4 h-px bg-lumina-300 shrink-0" />
                    <span class="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-lumina-300">Voir le projet</span>
                  </div>
                </div>
              </div>
              <PrismicLink
                v-if="isFilled.link(item.link)"
                :field="item.link"
                class="absolute inset-0 cursor-pointer"
                :aria-label="item.title ?? 'Voir le projet'"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
