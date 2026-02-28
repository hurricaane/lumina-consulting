<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Content } from "@prismicio/client";
import type { MotionProps } from "motion-v";

import { asLink, isFilled } from "@prismicio/client";
import { motion } from "motion-v";

const props = defineProps<{
  settings?: Content.SettingsDocument;
}>();

const route = useRoute();
const navigationItems = computed<NavigationMenuItem[]>(() => {
  const nav = props.settings?.data.navigation;
  if (!nav)
    return [];

  return nav
    .filter(item => isFilled.link(item))
    .map(item => ({
      label: item.text || "Link",
      to: asLink(item) || "#",
      active: route.path === asLink(item),
      ...(
        "target" in item && item.target
          ? { target: item.target }
          : {}
      ),
    }));
});

const ctaLabel = computed(() => props.settings?.data.navigation_cta.text || "CTA");
const ctaLink = computed(() => asLink(props.settings?.data.navigation_cta));

const starVariants: MotionProps["variants"] = {
  rest: {
    rotate: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  hover: {
    rotate: 72,
    transition: { type: "spring", stiffness: 400, damping: 18 },
  },
};

const lineVariants: MotionProps["variants"] = {
  rest: {
    scaleX: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
  hover: {
    scaleX: 1,
    transition: { duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] },
  },
};
</script>

<template>
  <Motion
    as-child
    :initial="{ y: -100 }"
    :animate="{ y: 0 }"
    :transition="{ duration: 0.6 }"
  >
    <UHeader mode="slideover">
      <template #title>
        <motion.div
          initial="rest"
          while-hover="hover"
          class="group flex items-center gap-2 cursor-pointer"
        >
          <motion.span
            :variants="starVariants"
            aria-hidden="true"
            class="text-primary text-xs leading-none"
          >
            ✦
          </motion.span>

          <div class="relative inline-flex items-baseline gap-[0.2em]">
            <span class="font-display text-[1.125rem] font-medium tracking-tight text-lumina-deep">
              Lumina
            </span>
            <span class="font-display text-[1.125rem] font-medium tracking-tight text-lumina-deep/50 group-hover:text-primary transition-colors duration-500">
              Consulting
            </span>
            <motion.div
              :variants="lineVariants"
              class="absolute inset-x-0 bottom-[-2px] h-px bg-primary origin-left"
            />
          </div>
        </motion.div>
      </template>

      <UNavigationMenu
        :items="navigationItems"
        :highlight="true"
        variant="link"
      />

      <template #right>
        <UButton
          v-if="ctaLink"
          :label="ctaLabel"
          :to="ctaLink"
          color="primary"
          variant="solid"
          class="rounded-full px-5 font-medium text-lumina-50 shadow-xl hover:shadow-glow transition-all duration-300"
        />
      </template>
    </UHeader>
  </Motion>
</template>
