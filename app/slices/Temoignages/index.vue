<script setup lang="ts">
import type { Content } from "@prismicio/client";
import type { Easing } from "motion-v";

import { isFilled } from "@prismicio/client";
import { motion } from "motion-v";

const props = defineProps(getSliceComponentProps<Content.TemoignagesSlice>());

const ease: Easing = [0.16, 1, 0.3, 1];

const items = computed(() => props.slice.primary.items ?? []);
const total = computed(() => items.value.length);
const current = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

function goTo(index: number) {
  if (index === current.value)
    return;
  current.value = index;
  resetTimer();
}

function resetTimer() {
  if (timer)
    clearInterval(timer);
  if (total.value > 1) {
    timer = setInterval(() => {
      current.value = (current.value + 1) % total.value;
    }, 7000);
  }
}

onMounted(() => resetTimer());
onUnmounted(() => {
  if (timer)
    clearInterval(timer);
});
</script>

<template>
  <section
    v-if="items.length"
    id="temoignages"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="py-[clamp(5rem,10vw,8rem)] bg-[linear-gradient(to_bottom,var(--color-background)_0%,var(--color-lumina-50)_25%,var(--color-lumina-50)_75%,var(--color-background)_100%)]"
  >
    <UContainer>
      <motion.div
        class="max-w-2xl mx-auto text-center"
        :initial="{ opacity: 0, y: 22 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, ease }"
        :in-view-options="{ once: true }"
      >
        <!-- Label -->
        <span
          v-if="isFilled.keyText(slice.primary.label)"
          class="section-label"
        >
          {{ slice.primary.label }}
        </span>

        <!-- Quote area -->
        <div class="relative mt-10">
          <!-- Ghost guillemet -->
          <span
            aria-hidden="true"
            class="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 font-display italic text-lumina-300/20 leading-none"
            style="font-size: clamp(7rem, 18vw, 12rem); top: -2.5rem; line-height: 1;"
          >«</span>

          <!-- Carousel -->
          <Transition name="temoignage" mode="out-in">
            <div :key="current" class="relative">
              <!-- Quote text -->
              <PrismicRichText
                v-if="isFilled.richText(items[current].quote)"
                :field="items[current].quote"
                :components="{
                  paragraph: {
                    class: 'font-display italic text-[clamp(1.125rem,2.2vw,1.5rem)] leading-[1.8] tracking-[-0.01em] text-lumina-deep/70 m-0 [&+p]:mt-4',
                  },
                }"
              />

              <!-- Attribution -->
              <div class="mt-8 flex flex-col items-center gap-1.5">
                <div class="w-6 h-px bg-lumina-300/50" />
                <span
                  v-if="isFilled.keyText(items[current].name)"
                  class="text-[0.875rem] font-medium text-lumina-deep tracking-[0.04em] mt-1"
                >
                  {{ items[current].name }}
                </span>
                <span
                  v-if="isFilled.keyText(items[current].context)"
                  class="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-lumina-deep/30"
                >
                  {{ items[current].context }}
                </span>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Navigation dots -->
        <div v-if="total > 1" class="flex items-center justify-center gap-2 mt-10">
          <button
            v-for="(_, index) in items"
            :key="index"
            class="size-1.5 rounded-full transition-all duration-300 cursor-pointer"
            :class="index === current
              ? 'bg-lumina-400 scale-125'
              : 'bg-lumina-200 hover:bg-lumina-300'"
            :aria-label="`Avis ${index + 1}`"
            @click="goTo(index)"
          />
        </div>
      </motion.div>
    </UContainer>
  </section>
</template>

<style scoped>
.temoignage-enter-active,
.temoignage-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}
.temoignage-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.temoignage-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
