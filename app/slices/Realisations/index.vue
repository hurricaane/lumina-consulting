<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.RealisationsSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    id="realisations"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_25%,var(--color-lumina-50)_75%,var(--color-background)_100%)]"
  >
    <UContainer>
      <!-- ─── Header ──────────────────────────────────────────── -->
      <motion.div
        class="flex items-end justify-between gap-8 mb-14 md:mb-16"
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
                  'font-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep mt-3 m-0 italic',
              },
            }"
          />
        </div>

        <PrismicLink
          v-if="isFilled.link(slice.primary.cta_link)"
          :field="slice.primary.cta_link"
          class="hidden md:inline-flex items-center gap-2 text-sm font-medium text-lumina-deep hover:text-primary transition-colors duration-300 shrink-0 pb-1.5 group"
        >
          <span>{{ slice.primary.cta_link.text ?? "Voir tous les projets" }}</span>
          <span class="group-hover:translate-x-1 transition-transform duration-300 ease-out">→</span>
        </PrismicLink>
      </motion.div>

      <!-- ─── Cards ─────────────────────────────────────────────── -->
      <div v-if="isFilled.group(slice.primary.items)" class="space-y-4 md:space-y-5">
        <!-- Hero card — first item, full width -->
        <motion.div
          v-if="slice.primary.items[0]"
          class="group relative overflow-hidden rounded-2xl"
          :initial="{ opacity: 0, y: 36 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.75, ease }"
          :in-view-options="{ once: true }"
        >
          <div class="relative aspect-4/3 md:aspect-16/7 overflow-hidden">
            <PrismicImage
              v-if="isFilled.image(slice.primary.items[0].image)"
              :field="slice.primary.items[0].image"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div v-else class="absolute inset-0 bg-lumina-100" />

            <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/80 via-lumina-deep/15 to-transparent" />

            <div class="absolute inset-x-0 bottom-0 p-7 md:p-10 flex items-end justify-between gap-6">
              <div class="group-hover:-translate-y-0.5 transition-transform duration-500">
                <span
                  v-if="isFilled.keyText(slice.primary.items[0].category)"
                  class="block text-[0.6875rem] font-semibold tracking-[0.18em] text-white/55 uppercase mb-2"
                >
                  {{ slice.primary.items[0].category }}
                </span>
                <h3
                  v-if="isFilled.keyText(slice.primary.items[0].title)"
                  class="font-display text-2xl md:text-3xl font-medium tracking-[-0.025em] text-white leading-snug"
                >
                  {{ slice.primary.items[0].title }}
                </h3>
                <p v-if="isFilled.keyText(slice.primary.items[0].description)" class="text-sm text-white/55 mt-1.5">
                  {{ slice.primary.items[0].description }}
                </p>
              </div>

              <div
                class="shrink-0 flex items-center gap-2 text-xs font-semibold text-primary tracking-wide opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-out pb-0.5"
              >
                <span>Voir le projet</span>
                <span>→</span>
              </div>
            </div>
          </div>

          <PrismicLink
            v-if="isFilled.link(slice.primary.items[0].link)"
            :field="slice.primary.items[0].link"
            class="absolute inset-0"
            aria-label="Voir le projet"
          />
        </motion.div>

        <!-- Secondary cards — remaining items, 2-col grid -->
        <div v-if="slice.primary.items.length > 1" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <motion.div
            v-for="(item, index) in slice.primary.items.slice(1)"
            :key="index + 1"
            class="group relative overflow-hidden rounded-2xl"
            :initial="{ opacity: 0, y: 36 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.7, delay: index * 0.14, ease }"
            :in-view-options="{ once: true }"
          >
            <div class="relative aspect-4/3 overflow-hidden">
              <PrismicImage
                v-if="isFilled.image(item.image)"
                :field="item.image"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 bg-lumina-100" />

              <div class="absolute inset-0 bg-linear-to-t from-lumina-deep/80 via-lumina-deep/15 to-transparent" />

              <div
                class="absolute inset-x-0 bottom-0 p-6 group-hover:-translate-y-0.5 transition-transform duration-500"
              >
                <span
                  v-if="isFilled.keyText(item.category)"
                  class="block text-[0.6875rem] font-semibold tracking-[0.18em] text-white/55 uppercase mb-2"
                >
                  {{ item.category }}
                </span>
                <h3
                  v-if="isFilled.keyText(item.title)"
                  class="font-display text-xl font-medium tracking-[-0.02em] text-white leading-snug"
                >
                  {{ item.title }}
                </h3>
                <p v-if="isFilled.keyText(item.description)" class="text-sm text-white/55 mt-1">
                  {{ item.description }}
                </p>

                <div
                  class="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary tracking-wide opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all duration-500 ease-out"
                >
                  <span>Voir le projet</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            <PrismicLink
              v-if="isFilled.link(item.link)"
              :field="item.link"
              class="absolute inset-0"
              aria-label="Voir le projet"
            />
          </motion.div>
        </div>
      </div>

      <!-- ─── Mobile CTA ──────────────────────────────────────── -->
      <div class="md:hidden flex justify-center mt-10">
        <PrismicLink
          v-if="isFilled.link(slice.primary.cta_link)"
          :field="slice.primary.cta_link"
          class="inline-flex items-center gap-2 text-sm font-medium text-lumina-deep hover:text-primary transition-colors duration-300 group"
        >
          <span>{{ slice.primary.cta_link.text ?? "Voir tous les projets" }}</span>
          <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </PrismicLink>
      </div>
    </UContainer>
  </section>
</template>
