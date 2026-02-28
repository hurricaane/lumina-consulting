<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Content } from "@prismicio/client";

import { asLink, isFilled } from "@prismicio/client";

const props = defineProps<{
  settings?: Content.SettingsDocument;
}>();

const currentYear = new Date().getFullYear();

const ICON_MAP: Record<string, string> = {
  email: "i-lucide-mail",
  linkedin: "i-simple-icons-linkedin",
  twitter: "i-simple-icons-x",
  instagram: "i-simple-icons-instagram",
  website: "i-lucide-globe",
};

const footerNavItems = computed<NavigationMenuItem[]>(() => {
  const nav = props.settings?.data.footer_navigation;
  if (!nav)
    return [];

  return nav
    .filter(item => isFilled.link(item))
    .map(item => ({
      label: item.text || "Link",
      to: asLink(item) || "#",
      ...(
        "target" in item && item.target
          ? { target: item.target }
          : {}
      ),
    }));
});

const socialLinks = computed(() => {
  const links = props.settings?.data.footer_social_links;
  if (!links)
    return [];
  return links.filter(item => isFilled.link(item.link));
});
</script>

<template>
  <footer class="bg-[oklch(0.095_0.018_240)] text-[oklch(0.92_0.01_230)] pt-16 pb-8">
    <!-- Main grid -->
    <UContainer>
      <div class="grid grid-cols-1 gap-12 pb-12 md:grid-cols-[3fr_2fr] md:gap-16 md:items-start">
        <!-- Brand column -->
        <div class="flex flex-col gap-6">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <span class="text-lumina-300 text-xs leading-none" aria-hidden="true">✦</span>
            <span class="font-display text-lg font-medium tracking-[0.08em] uppercase text-[oklch(0.92_0.01_230)]">
              Lumina Consulting
            </span>
          </div>

          <!-- Description -->
          <PrismicRichText
            :field="props.settings?.data.footer_primary_text"
            :components="{
              heading3: { class: 'font-display text-base font-medium tracking-[0.01em] text-[oklch(0.92_0.01_230)] mb-1.5' },
              paragraph: { class: 'text-[0.8125rem] leading-[1.75] text-[oklch(0.92_0.01_230/0.42)] max-w-[34ch]' },
            }"
          />

          <!-- Social icons -->
          <div v-if="socialLinks.length" class="flex items-center gap-0.5">
            <a
              v-for="(item, index) in socialLinks"
              :key="index"
              :href="asLink(item.link) ?? '#'"
              class="flex items-center justify-center size-8 rounded-md text-[oklch(0.92_0.01_230/0.42)] text-[0.9375rem] transition-[color,background] duration-200 hover:text-[oklch(0.92_0.01_230)] hover:bg-white/8"
              :aria-label="item.icon ?? 'social link'"
            >
              <UIcon :name="ICON_MAP[item.icon ?? ''] ?? 'i-lucide-link'" />
            </a>
          </div>
        </div>

        <!-- Nav column -->
        <div class="flex flex-col gap-5">
          <p class="text-[0.625rem] tracking-[0.22em] uppercase text-[oklch(0.92_0.01_230/0.42)] font-medium">
            Explorer
          </p>
          <nav class="flex flex-col gap-0.5">
            <NuxtLink
              v-for="item in footerNavItems"
              :key="item.to as string"
              :to="item.to as string"
              :target="(item.target as string | undefined)"
              class="relative inline-flex items-center text-sm tracking-[0.02em] text-[oklch(0.92_0.01_230)] no-underline py-[0.3rem] opacity-70 [transition:opacity_0.25s_ease,padding-left_0.35s_cubic-bezier(0.25,0,0,1)] hover:opacity-100 hover:pl-4.5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-px before:w-0 before:bg-lumina-300 before:-translate-y-1/2 before:[transition:width_0.35s_cubic-bezier(0.25,0,0,1)] hover:before:w-3"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </UContainer>

    <!-- Separator -->
    <UContainer>
      <div class="flex items-center gap-3.5">
        <div class="flex-1 h-px bg-[oklch(0.92_0.01_230/0.1)]" />
        <span class="text-lumina-300 text-[0.5rem] opacity-65 shrink-0" aria-hidden="true">✦</span>
        <div class="flex-1 h-px bg-[oklch(0.92_0.01_230/0.1)]" />
      </div>
    </UContainer>

    <!-- Bottom bar -->
    <UContainer>
      <div class="flex items-center justify-between flex-wrap gap-3 pt-5">
        <p class="text-[0.6875rem] tracking-[0.09em] text-[oklch(0.92_0.01_230/0.42)]">
          © {{ currentYear }} · Lumina Consulting
        </p>
        <nav class="flex items-center gap-2.5" aria-label="Legal links">
          <NuxtLink
            to="/mentions-legales"
            class="relative text-[0.6875rem] tracking-[0.09em] text-[oklch(0.92_0.01_230/0.42)] no-underline pb-px transition-colors duration-250 hover:text-[oklch(0.92_0.01_230)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-current after:scale-x-0 after:origin-right after:[transition:transform_0.4s_cubic-bezier(0.76,0,0.24,1)] hover:after:scale-x-100 hover:after:origin-left"
          >
            Mentions légales
          </NuxtLink>
          <span
            class="text-[0.625rem] text-[oklch(0.92_0.01_230/0.42)] opacity-40 select-none"
            aria-hidden="true"
          >—</span>
          <NuxtLink
            to="/politique-de-confidentialite"
            class="relative text-[0.6875rem] tracking-[0.09em] text-[oklch(0.92_0.01_230/0.42)] no-underline pb-px transition-colors duration-250 hover:text-[oklch(0.92_0.01_230)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-current after:scale-x-0 after:origin-right after:[transition:transform_0.4s_cubic-bezier(0.76,0,0.24,1)] hover:after:scale-x-100 hover:after:origin-left"
          >
            Politique de confidentialité
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </footer>
</template>
