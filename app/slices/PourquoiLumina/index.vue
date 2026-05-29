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
