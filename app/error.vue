<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

const props = defineProps<{ error: { statusCode: number; message?: string } }>();

const ease: Easing = [0.16, 1, 0.3, 1];

const is404 = computed(() => props.error.statusCode === 404);

useHead({ title: is404.value ? "Page introuvable — Lumina Consulting" : "Erreur — Lumina Consulting" });

function handleError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-24 px-6">
    <!-- Ghost status code -->
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.6, ease }"
      aria-hidden="true"
      class="font-display italic text-lumina-100 leading-none select-none tabular-nums absolute pointer-events-none"
      style="font-size: clamp(10rem, 28vw, 22rem); letter-spacing: -0.05em;"
    >
      {{ error.statusCode }}
    </motion.div>

    <!-- Content -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.65, delay: 0.1, ease }"
      class="relative z-10 text-center max-w-md"
    >
      <span class="section-label">
        {{ is404 ? 'Page introuvable' : `Erreur ${error.statusCode}` }}
      </span>

      <h1
        class="font-display italic text-[clamp(2rem,5vw,3rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep mt-3 mb-6"
      >
        {{ is404 ? 'Cette page n\'existe pas.' : 'Quelque chose s\'est mal passé.' }}
      </h1>

      <p class="text-[0.9375rem] leading-[1.8] text-lumina-deep/50 mb-10">
        {{ is404
          ? 'La page que vous cherchez a peut-être été déplacée ou supprimée.'
          : 'Une erreur inattendue s\'est produite. Revenez à l\'accueil et réessayez.'
        }}
      </p>

      <button
        class="group inline-flex items-center gap-3 px-7 py-3.5 bg-lumina-deep text-white text-[0.875rem] font-semibold tracking-[0.04em] rounded-full transition-all duration-300 hover:shadow-[0_8px_40px_oklch(0.25_0.04_240_/_0.22)]"
        @click="handleError"
      >
        <span class="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
        <span>Retour à l'accueil</span>
      </button>
    </motion.div>
  </div>
</template>
