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
