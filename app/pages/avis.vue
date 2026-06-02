<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

useSeoMeta({
  title: "Laisser un avis",
  ogTitle: "Laisser un avis",
  description: "Partagez votre expérience avec Lumina Consulting.",
  ogDescription: "Partagez votre expérience avec Lumina Consulting.",
});

const ease: Easing = [0.16, 1, 0.3, 1];
const easeOut: Easing = [0.0, 0.0, 0.2, 1];

const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "200px 200px",
};

const attrs = ["2 minutes", "Anonymisable", "Publié après validation"];

const form = reactive({
  nom: "",
  email: "",
  projet: "",
  note: 0,
  temoignage: "",
});

const hovered = ref<number | null>(null);
const starError = ref(false);
const status = ref<"idle" | "loading" | "success" | "error">("idle");

async function submit() {
  if (form.note === 0) {
    starError.value = true;
    return;
  }
  starError.value = false;
  status.value = "loading";
  try {
    await $fetch("/api/review", {
      method: "POST",
      body: {
        nom: form.nom,
        email: form.email,
        projet: form.projet || undefined,
        note: form.note,
        temoignage: form.temoignage,
      },
    });
    status.value = "success";
  }
  catch {
    status.value = "error";
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-5rem)] flex flex-col py-[clamp(3rem,5vw,5rem)]">
    <UContainer class="flex-1 flex flex-col">
      <!-- Back link -->
      <motion.div
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.45, ease }"
        class="mb-10"
      >
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/35 hover:text-primary transition-colors duration-300 group cursor-pointer"
        >
          <span class="group-hover:-translate-x-0.5 transition-transform duration-300 ease-out">←</span>
          <span>Accueil</span>
        </NuxtLink>
      </motion.div>

      <!-- Two-column grid -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
        <!-- LEFT PANEL — dark editorial -->
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.05, ease: easeOut }"
          class="relative bg-lumina-deep overflow-hidden flex flex-col justify-between p-10 sm:p-12 lg:p-14 min-h-[480px] lg:min-h-0"
        >
          <!-- Radial glow -->
          <motion.div
            :animate="{ opacity: [0.10, 0.17, 0.10] }"
            :transition="{ duration: 5, repeat: Infinity, ease: 'easeInOut' }"
            class="pointer-events-none absolute -top-20 -right-20 w-[28rem] h-[28rem] rounded-full"
            style="background: radial-gradient(circle, oklch(0.84 0.09 230) 0%, transparent 70%);"
          />

          <!-- Grain texture -->
          <div
            class="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
            :style="grainStyle"
          />

          <!-- Ghost watermark -->
          <motion.div
            :animate="{ y: [0, -10, 0] }"
            :transition="{ duration: 9, repeat: Infinity, ease: 'easeInOut' }"
            class="pointer-events-none absolute right-6 bottom-4 font-display italic text-white select-none leading-none"
            style="font-size: clamp(8rem, 18vw, 14rem); opacity: 0.04; letter-spacing: -0.04em;"
          >
            ★
          </motion.div>

          <!-- Top content -->
          <div class="relative z-10">
            <motion.div
              :initial="{ opacity: 0, x: -8 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.5, delay: 0.2, ease }"
              class="flex items-center gap-3 mb-6"
            >
              <div class="w-5 h-px bg-lumina-300/50" />
              <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-300/70">
                Témoignage client
              </span>
            </motion.div>

            <motion.h1
              :initial="{ opacity: 0, y: 16 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.65, delay: 0.3, ease }"
              class="font-display italic text-white leading-[1.05] tracking-[-0.03em] mb-8"
              style="font-size: clamp(2rem, 4.5vw, 3rem);"
            >
              Votre avis<br>compte.
            </motion.h1>

            <motion.p
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.55, delay: 0.44, ease }"
              class="text-[0.9375rem] leading-[1.8] text-white/45 max-w-[340px]"
            >
              En deux minutes, partagez votre expérience. Votre témoignage aide les futurs clients à se décider — et il me touche profondément. Si vous préférez rester anonyme, mentionnez-le dans votre message : votre nom ne sera pas publié.
            </motion.p>
          </div>

          <!-- Bottom content -->
          <div class="relative z-10">
            <div class="flex flex-wrap gap-2 mb-8">
              <motion.span
                v-for="(attr, i) in attrs"
                :key="attr"
                :initial="{ opacity: 0, y: 6 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.56 + i * 0.07, ease }"
                class="px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.08em] text-white/40 border border-white/[0.08] rounded-full"
              >
                {{ attr }}
              </motion.span>
            </div>
          </div>
        </motion.div>

        <!-- RIGHT PANEL — form -->
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.12, ease: easeOut }"
          class="bg-white border border-lumina-100 lg:border-l-0 flex flex-col p-10 sm:p-12 lg:p-14"
        >
          <!-- Section label -->
          <motion.div
            :initial="{ opacity: 0, x: 8 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.45, delay: 0.28, ease }"
            class="flex items-center gap-3 mb-10"
          >
            <span class="text-[0.625rem] font-semibold tracking-[0.22em] uppercase text-lumina-deep/30">
              Votre témoignage
            </span>
            <div class="flex-1 h-px bg-lumina-100" />
          </motion.div>

          <!-- Success state -->
          <motion.div
            v-if="status === 'success'"
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease }"
            class="flex-1 flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              :initial="{ scaleX: 0 }"
              :animate="{ scaleX: 1 }"
              :transition="{ duration: 0.5, delay: 0.2, ease }"
              class="w-10 h-px bg-lumina-300 mb-8 mx-auto origin-left"
            />
            <p
              class="font-display italic text-lumina-deep/70 leading-[1.6]"
              style="font-size: clamp(1.25rem, 2.5vw, 1.5rem);"
            >
              Merci infiniment.<br>Votre avis a bien été reçu.
            </p>
            <motion.div
              :initial="{ scaleX: 0 }"
              :animate="{ scaleX: 1 }"
              :transition="{ duration: 0.5, delay: 0.35, ease }"
              class="w-10 h-px bg-lumina-300 mt-8 mx-auto origin-right"
            />
          </motion.div>

          <!-- Form -->
          <form
            v-else
            class="flex-1 flex flex-col"
            @submit.prevent="submit"
          >
            <div class="flex-1 space-y-8">
              <!-- Nom -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.38, ease }"
                class="relative"
              >
                <input
                  id="nom"
                  v-model="form.nom"
                  type="text"
                  required
                  autocomplete="name"
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="nom"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Nom complet
                </label>
              </motion.div>

              <!-- Email -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.5, ease }"
                class="relative"
              >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="email"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Adresse email
                </label>
                <p class="mt-1.5 text-[0.625rem] text-lumina-deep/25 tracking-[0.06em]">
                  Non publié · uniquement pour vous remercier
                </p>
              </motion.div>

              <!-- Projet -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.56, ease }"
                class="relative"
              >
                <input
                  id="projet"
                  v-model="form.projet"
                  type="text"
                  placeholder=" "
                  autocomplete="off"
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent"
                >
                <label
                  for="projet"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Projet <span class="normal-case font-normal tracking-normal text-lumina-deep/20">(optionnel)</span>
                </label>
                <p class="mt-1.5 text-[0.625rem] text-lumina-deep/25 tracking-[0.06em]">
                  ex : Refonte de site vitrine, site événementiel…
                </p>
              </motion.div>

              <!-- Note — star rating -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.62, ease }"
              >
                <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 mb-3">
                  Votre note
                </p>
                <div class="flex items-center gap-1">
                  <button
                    v-for="i in 5"
                    :key="i"
                    type="button"
                    class="text-[1.75rem] leading-none transition-all duration-150 hover:scale-110 cursor-pointer focus:outline-none"
                    :class="i <= (hovered ?? form.note) ? 'text-lumina-300' : 'text-lumina-200'"
                    :aria-label="`${i} étoile${i > 1 ? 's' : ''}`"
                    @mouseenter="hovered = i"
                    @mouseleave="hovered = null"
                    @click="form.note = i; starError = false"
                  >
                    ★
                  </button>
                </div>
                <p v-if="starError" class="mt-2 text-[0.75rem] text-red-400/80">
                  Veuillez sélectionner une note.
                </p>
              </motion.div>

              <!-- Témoignage -->
              <motion.div
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.5, delay: 0.68, ease }"
                class="relative"
              >
                <textarea
                  id="temoignage"
                  v-model="form.temoignage"
                  rows="4"
                  required
                  placeholder=" "
                  class="peer w-full pt-5 pb-2 px-0 text-[0.9375rem] text-lumina-deep bg-transparent border-b border-lumina-100 focus:outline-none focus:border-lumina-400 transition-colors duration-300 placeholder-transparent resize-none"
                />
                <label
                  for="temoignage"
                  class="absolute left-0 top-0.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-lumina-deep/35 transition-all duration-300 ease-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-[0.9375rem] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-placeholder-shown:text-lumina-deep/30 peer-focus:top-0.5 peer-focus:text-[0.6875rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase peer-focus:text-lumina-500 cursor-text pointer-events-none"
                >
                  Votre témoignage
                </label>
              </motion.div>
            </div>

            <!-- Error -->
            <motion.p
              v-if="status === 'error'"
              :initial="{ opacity: 0, y: -4 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.3, ease }"
              class="mt-6 text-[0.8125rem] text-red-400/80"
            >
              Une erreur est survenue. Réessayez ou écrivez-moi directement.
            </motion.p>

            <!-- Submit -->
            <motion.div
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ duration: 0.4, delay: 0.8, ease }"
              class="mt-10 flex items-center justify-between gap-6"
            >
              <button
                type="submit"
                :disabled="status === 'loading'"
                class="group inline-flex items-center gap-3 px-7 py-3.5 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase border border-lumina-deep/15 text-lumina-deep/50 hover:border-lumina-deep/30 hover:text-lumina-deep/80 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>{{ status === 'loading' ? 'Envoi en cours…' : 'Envoyer' }}</span>
                <span
                  v-if="status !== 'loading'"
                  class="transition-transform duration-300 group-hover:translate-x-0.5"
                >→</span>
                <span v-else class="w-3.5 h-3.5 border border-lumina-deep/30 border-t-lumina-deep/70 rounded-full animate-spin" />
              </button>
              <span class="text-[0.6875rem] text-lumina-deep/20 tracking-[0.06em]">
                Publié après validation
              </span>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </UContainer>
  </div>
</template>
