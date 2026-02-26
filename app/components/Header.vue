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
  rest: { rotate: 0 },
  hover: { rotate: 180 },
};

const textVariants: MotionProps["variants"] = {
  rest: {
    x: -30,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    x: -5,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
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
          <span
            class="font-display text-[1.125rem] font-medium tracking-tight text-lumina-deep group-hover:text-primary transition-colors duration-300"
          >
            Lumina
          </span>
          <motion.span
            :variants="textVariants"
            class="font-display text-[1.125rem] font-medium tracking-tight text-primary"
          >
            Consulting
          </motion.span>
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
