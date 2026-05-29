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
