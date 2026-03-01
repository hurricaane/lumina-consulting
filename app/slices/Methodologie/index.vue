<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

defineProps(getSliceComponentProps<Content.MethodologieSlice>());

const ICON_MAP: Record<string, string> = {
  users: "i-lucide-users",
  pen_tool: "i-lucide-pen-tool",
  gem: "i-lucide-gem",
  rocket: "i-lucide-rocket",
  lightbulb: "i-lucide-lightbulb",
  target: "i-lucide-target",
  message_circle: "i-lucide-message-circle",
};

const ease: Easing = [0.16, 1, 0.3, 1];
</script>

<template>
  <section
    id="methodologie"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_25%,var(--color-lumina-50)_75%,var(--color-background)_100%)]"
  >
    <UContainer>
      <!-- ─── Header ──────────────────────────────────────────────── -->
      <motion.div
        class="text-center mb-20 md:mb-28 max-w-2xl mx-auto"
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

      <!-- ─── Full-width hairline ──────────────────────────────────── -->
      <div class="h-px bg-lumina-100 mb-0 hidden lg:block" />

      <!-- ─── Steps grid ───────────────────────────────────────────── -->
      <div v-if="isFilled.group(slice.primary.items)" class="grid grid-cols-1 lg:grid-cols-4">
        <motion.div
          v-for="(item, index) in slice.primary.items"
          :key="index"
          class="group relative flex flex-col pt-10 pb-12 lg:px-8 lg:first:pl-0 lg:last:pr-0 border-b last:border-b-0 lg:border-b-0 lg:border-l lg:first:border-l-0 border-lumina-100 transition-colors duration-300"
          :initial="{ opacity: 0, y: 28 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.65, delay: index * 0.1, ease }"
          :in-view-options="{ once: true }"
        >
          <!-- Ghost number -->
          <span
            aria-hidden="true"
            class="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-lumina-200 tabular-nums select-none mb-6"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </span>

          <!-- Icon + Title row -->
          <div class="flex items-center gap-3 mb-5">
            <div
              v-if="isFilled.select(item.icon)"
              class="flex items-center justify-center size-9 rounded-xl bg-white text-lumina-500 group-hover:bg-lumina-100 group-hover:text-lumina-600 transition-colors duration-300 shrink-0"
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
