<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.RichTextSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="relative overflow-hidden flex items-center min-h-[92svh] py-[clamp(5rem,10vw,8rem)] bg-background bg-[radial-gradient(circle_at_50%_28%,oklch(0.84_0.09_230/0.14)_0%,transparent_62%),radial-gradient(oklch(0.70_0.13_230/0.08)_1.5px,transparent_1.5px)] bg-size-[100%_100%,30px_30px]"
  >
    <!-- Blurred background orbs -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[min(920px,130vw)] aspect-square rounded-full bg-[radial-gradient(circle,oklch(0.84_0.09_230/0.28)_0%,transparent_68%)] blur-[90px]"
      />
      <div
        class="absolute bottom-[-5%] right-[-8%] w-[min(480px,55vw)] aspect-square rounded-full bg-[radial-gradient(circle,oklch(0.70_0.12_178/0.15)_0%,transparent_70%)] blur-[90px]"
      />
    </div>

    <!-- Content column -->
    <div
      class="relative z-10 w-full max-w-272 mx-auto px-[clamp(1.25rem,4vw,4rem)] flex flex-col items-center gap-7.5 text-center"
    >
      <!-- Badge -->
      <motion.div
        v-if="isFilled.keyText(slice.primary.badge)"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
      >
        <span
          class="inline-flex items-center gap-2 px-3.75 py-1.25 rounded-full bg-white/70 backdrop-blur-md border border-[oklch(0.84_0.09_230/0.28)] shadow-[0_2px_14px_oklch(0.84_0.09_230/0.10)] text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-[oklch(0.50_0.025_240)]"
        >
          <motion.span
            class="block size-1.5 rounded-full bg-lumina-300 shrink-0"
            :animate="{ scale: [1, 1.65, 1], opacity: [1, 0.35, 1] }"
            :transition="{ duration: 2.4, delay: 1, repeat: Infinity, ease: 'easeInOut' }"
          />
          {{ slice.primary.badge }}
        </span>
      </motion.div>

      <!-- Two-line heading -->
      <motion.div
        class="flex flex-col items-center"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.1, ease }"
      >
        <PrismicRichText
          v-if="isFilled.richText(slice.primary.title_first_line)"
          :field="slice.primary.title_first_line"
          :components="{
            heading1: {
              class:
                'font-display text-[clamp(2.625rem,6.5vw,5.25rem)] font-bold not-italic tracking-[-0.04em] leading-[1.05] text-[oklch(0.18_0.04_240)] m-0',
            },
          }"
        />
        <PrismicRichText
          v-if="isFilled.richText(slice.primary.title_second_line)"
          :field="slice.primary.title_second_line"
          :components="{
            heading2: {
              class:
                'font-display text-[clamp(2.625rem,6.5vw,5.25rem)] font-semibold italic tracking-[-0.03em] leading-[1.1] m-0 bg-gradient-to-br from-[oklch(0.84_0.09_230)] to-[oklch(0.70_0.12_178)] bg-clip-text text-transparent',
            },
          }"
        />
      </motion.div>

      <!-- Body text -->
      <motion.div
        v-if="isFilled.richText(slice.primary.text)"
        :initial="{ opacity: 0, y: 18 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.2, ease }"
      >
        <PrismicRichText
          :field="slice.primary.text"
          :components="{
            paragraph: {
              class:
                'text-[clamp(1rem,1.5vw,1.125rem)] text-[oklch(0.50_0.025_240)] max-w-[50ch] leading-[1.75] mx-auto m-0',
            },
          }"
        />
      </motion.div>

      <!-- CTAs -->
      <motion.div
        v-if="slice.primary.cta?.length"
        class="flex flex-wrap items-center justify-center gap-3"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.3, ease }"
      >
        <template v-for="link in slice.primary.cta" :key="link.key">
          <!-- Solid variant -->
          <PrismicLink
            v-if="isFilled.link(link) && link.variant === 'Solid'"
            :field="link"
            class="inline-flex items-center justify-center px-7.5 py-3 rounded-full font-sans text-[0.9375rem] font-medium tracking-[0.01em] leading-none whitespace-nowrap transition-all duration-300 active:scale-[0.97] bg-lumina-300 text-[oklch(0.18_0.04_240)] border-[1.5px] border-transparent hover:bg-lumina-400 hover:shadow-[0_0_28px_oklch(0.84_0.09_230/0.42)]"
          />
          <!-- Outlined variant -->
          <PrismicLink
            v-else-if="isFilled.link(link)"
            :field="link"
            class="inline-flex items-center justify-center px-7.5 py-3 rounded-full font-sans text-[0.9375rem] font-medium tracking-[0.01em] leading-none whitespace-nowrap transition-all duration-300 active:scale-[0.97] bg-transparent text-[oklch(0.18_0.04_240)] border-[1.5px] border-[oklch(0.84_0.09_230/0.42)] hover:bg-[oklch(0.84_0.09_230/0.08)] hover:border-[oklch(0.84_0.09_230/0.72)]"
          />
        </template>
      </motion.div>
    </div>
  </section>
</template>
