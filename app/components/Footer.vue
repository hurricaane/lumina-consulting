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
  <footer class="lc-footer">
    <!-- Main grid -->
    <UContainer>
      <div class="lc-footer__main">
        <!-- Brand column -->
        <div class="lc-footer__brand">
          <div class="lc-footer__logo">
            <span class="lc-footer__logo-mark" aria-hidden="true">✦</span>
            <span class="lc-footer__logo-text">Lumina</span>
          </div>

          <PrismicRichText
            :field="props.settings?.data.footer_primary_text"
            :components="{
              heading3: { class: 'lc-footer__desc-h3' },
              paragraph: { class: 'lc-footer__desc-p' },
            }"
          />

          <div v-if="socialLinks.length" class="lc-footer__social">
            <a
              v-for="(item, index) in socialLinks"
              :key="index"
              :href="asLink(item.link) ?? '#'"
              class="lc-footer__social-btn"
              :aria-label="item.icon ?? 'social link'"
            >
              <UIcon :name="ICON_MAP[item.icon ?? ''] ?? 'i-lucide-link'" />
            </a>
          </div>
        </div>

        <!-- Nav column -->
        <div class="lc-footer__nav-col">
          <p class="lc-footer__nav-label">
            Explorer
          </p>
          <nav class="lc-footer__nav">
            <NuxtLink
              v-for="item in footerNavItems"
              :key="item.to as string"
              :to="item.to as string"
              :target="(item.target as string | undefined)"
              class="lc-footer__nav-link"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </UContainer>

    <!-- Separator -->
    <UContainer>
      <div class="lc-footer__divider">
        <div class="lc-footer__divider-line" />
        <span class="lc-footer__divider-mark" aria-hidden="true">✦</span>
        <div class="lc-footer__divider-line" />
      </div>
    </UContainer>

    <!-- Bottom bar -->
    <UContainer>
      <div class="lc-footer__bottom">
        <p class="lc-footer__copyright">
          © {{ currentYear }} · Lumina Consulting
        </p>
        <nav class="lc-footer__legal" aria-label="Legal links">
          <NuxtLink to="/mentions-legales" class="lc-footer__legal-link">
            Mentions légales
          </NuxtLink>
          <span class="lc-footer__legal-sep" aria-hidden="true">—</span>
          <NuxtLink to="/politique-de-confidentialite" class="lc-footer__legal-link">
            Politique de confidentialité
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </footer>
</template>

<style scoped>
/* ─── Tokens ──────────────────────────────────────────── */
.lc-footer {
  --f-bg: oklch(0.095 0.018 240);
  /* deep midnight, brand-tinted */
  --f-text: oklch(0.92 0.01 230);
  /* warm near-white, blue-tinted */
  --f-muted: oklch(0.92 0.01 230 / 0.42);
  --f-border: oklch(0.92 0.01 230 / 0.1);
  --f-accent: oklch(0.84 0.09 230);
  /* lumina-300 — baby blue */

  background: var(--f-bg);
  color: var(--f-text);
  padding-top: 4rem;
  padding-bottom: 2rem;
}

/* ─── Main grid ───────────────────────────────────────── */
.lc-footer__main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
}

@media (min-width: 768px) {
  .lc-footer__main {
    grid-template-columns: 3fr 2fr;
    gap: 4rem;
    align-items: start;
  }
}

/* ─── Brand ───────────────────────────────────────────── */
.lc-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lc-footer__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lc-footer__logo-mark {
  color: var(--f-accent);
  font-size: 0.75rem;
  line-height: 1;
}

.lc-footer__logo-text {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--f-text);
}

:deep(.lc-footer__desc-h3) {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--f-text);
  margin-bottom: 0.375rem;
}

:deep(.lc-footer__desc-p) {
  font-size: 0.8125rem;
  line-height: 1.75;
  color: var(--f-muted);
  max-width: 34ch;
}

/* ─── Social ──────────────────────────────────────────── */
.lc-footer__social {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.lc-footer__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  color: var(--f-muted);
  font-size: 0.9375rem;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.lc-footer__social-btn:hover {
  color: var(--f-text);
  background: rgba(221, 217, 209, 0.08);
}

/* ─── Nav column ──────────────────────────────────────── */
.lc-footer__nav-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lc-footer__nav-label {
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--f-muted);
  font-weight: 500;
}

.lc-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.lc-footer__nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--f-text);
  text-decoration: none;
  padding: 0.3rem 0;
  padding-left: 0;
  opacity: 0.7;
  transition:
    opacity 0.25s ease,
    padding-left 0.35s cubic-bezier(0.25, 0, 0, 1);
}

.lc-footer__nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  height: 1px;
  width: 0;
  background: var(--f-accent);
  transform: translateY(-50%);
  transition: width 0.35s cubic-bezier(0.25, 0, 0, 1);
}

.lc-footer__nav-link:hover {
  opacity: 1;
  padding-left: 1.125rem;
}

.lc-footer__nav-link:hover::before {
  width: 0.75rem;
}

/* ─── Divider ─────────────────────────────────────────── */
.lc-footer__divider {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.lc-footer__divider-line {
  flex: 1;
  height: 1px;
  background: var(--f-border);
}

.lc-footer__divider-mark {
  color: var(--f-accent);
  font-size: 0.5rem;
  opacity: 0.65;
  flex-shrink: 0;
}

/* ─── Bottom bar ──────────────────────────────────────── */
.lc-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1.25rem;
}

.lc-footer__copyright {
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
  color: var(--f-muted);
}

.lc-footer__legal {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.lc-footer__legal-sep {
  font-size: 0.625rem;
  color: var(--f-muted);
  opacity: 0.4;
  user-select: none;
}

.lc-footer__legal-link {
  position: relative;
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
  color: var(--f-muted);
  text-decoration: none;
  padding-bottom: 1px;
  transition: color 0.25s ease;
}

.lc-footer__legal-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

.lc-footer__legal-link:hover {
  color: var(--f-text);
}

.lc-footer__legal-link:hover::after {
  transform: scaleX(1);
  transform-origin: left center;
}
</style>
