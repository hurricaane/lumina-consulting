<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.AProposSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <div
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <!-- ══ HERO ══════════════════════════════════════════════════════════ -->
    <section class="pt-[clamp(5rem,10vw,8rem)] pb-[clamp(4rem,8vw,6rem)]">
      <UContainer>
        <div class="max-w-2xl">
          <!-- Eyebrow -->
          <motion.div
            v-if="isFilled.keyText(slice.primary.eyebrow)"
            :initial="{ opacity: 0, x: -10 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, ease }"
            class="flex items-center gap-4 mb-10"
          >
            <div class="w-8 h-px bg-lumina-300/50 shrink-0" />
            <span class="section-label mb-0">{{ slice.primary.eyebrow }}</span>
          </motion.div>

          <!-- Heading -->
          <motion.div
            v-if="isFilled.richText(slice.primary.heading)"
            :initial="{ opacity: 0, y: 22 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.75, delay: 0.1, ease }"
          >
            <PrismicRichText
              :field="slice.primary.heading"
              :components="{
                heading2: {
                  class:
                    'font-display text-[clamp(2.75rem,6vw,4.5rem)] font-medium tracking-[-0.04em] leading-[1.06] text-lumina-deep italic m-0',
                },
              }"
            />
          </motion.div>

          <!-- Animated separator -->
          <motion.div
            :initial="{ scaleX: 0 }"
            :animate="{ scaleX: 1 }"
            :transition="{ duration: 0.65, delay: 0.32, ease }"
            class="w-12 h-px bg-lumina-300/50 my-10 origin-left"
          />

          <!-- Intro prose -->
          <motion.div
            v-if="isFilled.richText(slice.primary.intro)"
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.65, delay: 0.42, ease }"
          >
            <PrismicRichText
              :field="slice.primary.intro"
              :components="{
                paragraph: {
                  class:
                    'text-[1.0625rem] leading-[1.9] text-lumina-deep/60 m-0 [&+p]:mt-5',
                },
              }"
            />
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- ══ STORY ═════════════════════════════════════════════════════════ -->
    <section
      v-if="isFilled.richText(slice.primary.story)"
      class="py-[clamp(4.5rem,9vw,7rem)] bg-lumina-deep overflow-hidden relative"
    >
      <!-- Breathing radial glow -->
      <motion.div
        :animate="{ opacity: [0.08, 0.16, 0.08] }"
        :transition="{ duration: 6, repeat: Infinity, ease: 'easeInOut' }"
        class="pointer-events-none absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full"
        style="background: radial-gradient(circle, oklch(0.84 0.09 230) 0%, transparent 70%);"
      />

      <UContainer>
        <motion.div
          class="max-w-2xl relative z-10"
          :initial="{ opacity: 0, y: 24 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease }"
          :in-view-options="{ once: true }"
        >
          <!-- Section label -->
          <div
            v-if="isFilled.keyText(slice.primary.story_label)"
            class="flex items-center gap-4 mb-10"
          >
            <div class="w-8 h-px bg-lumina-300/30 shrink-0" />
            <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-300/60">
              {{ slice.primary.story_label }}
            </span>
          </div>

          <!-- Story prose -->
          <PrismicRichText
            :field="slice.primary.story"
            :components="{
              paragraph: {
                class:
                  'text-[1.0625rem] leading-[1.9] text-white/55 m-0 [&+p]:mt-6',
              },
            }"
          />

          <!-- Accent line -->
          <motion.div
            :initial="{ scaleX: 0 }"
            :while-in-view="{ scaleX: 1 }"
            :transition="{ duration: 0.65, delay: 0.35, ease }"
            :in-view-options="{ once: true }"
            class="w-10 h-px bg-lumina-300/40 mt-10 origin-left"
          />
        </motion.div>
      </UContainer>
    </section>

    <!-- ══ CONVICTIONS ════════════════════════════════════════════════════ -->
    <section
      v-if="isFilled.group(slice.primary.items)"
      class="py-[clamp(5rem,10vw,8rem)]"
    >
      <UContainer>
        <div class="max-w-2xl mx-auto">
          <motion.div
            v-for="(item, index) in slice.primary.items"
            :key="index"
            :initial="{ opacity: 0, y: 16 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: index * 0.07, ease }"
            :in-view-options="{ once: true }"
            class="group flex gap-8 sm:gap-12 py-10 border-b border-lumina-100 first:border-t first:border-lumina-100"
          >
            <!-- Ghost number -->
            <span
              aria-hidden="true"
              class="font-display text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] text-lumina-200 group-hover:text-lumina-300 tabular-nums select-none shrink-0 transition-colors duration-500 pt-0.5"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div class="flex-1 min-w-0">
              <!-- Conviction title -->
              <h3
                v-if="isFilled.keyText(item.title)"
                class="font-display italic text-[clamp(1.25rem,2.5vw,1.625rem)] font-medium tracking-[-0.03em] leading-snug text-lumina-deep mb-4"
              >
                {{ item.title }}
              </h3>

              <!-- Conviction body -->
              <PrismicRichText
                v-if="isFilled.richText(item.body)"
                :field="item.body"
                :components="{
                  paragraph: {
                    class:
                      'text-[0.9375rem] leading-[1.85] text-lumina-deep/55 m-0 [&+p]:mt-4',
                  },
                }"
              />
            </div>
          </motion.div>
        </div>
      </UContainer>
    </section>

    <!-- ══ CLOSING + CTA ══════════════════════════════════════════════════ -->
    <section
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

          <!-- Closing text -->
          <PrismicRichText
            v-if="isFilled.richText(slice.primary.closing_text)"
            :field="slice.primary.closing_text"
            :components="{
              paragraph: {
                class:
                  'font-display italic text-[clamp(1.25rem,2.5vw,1.625rem)] leading-[1.65] tracking-[-0.02em] text-lumina-deep/70 m-0 [&+p]:mt-4',
              },
            }"
          />

          <!-- CTA -->
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
  </div>
</template>
