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
