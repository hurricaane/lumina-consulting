<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

useSeoMeta({
  title: "Politique de confidentialité — Lumina Consulting",
  description: "Politique de confidentialité du site Lumina Consulting, studio numérique.",
});

const ease: Easing = [0.16, 1, 0.3, 1];

type LegalRow = {
  label: string;
  value: string;
  href?: string;
};

type LegalSection = {
  number: string;
  title: string;
  content?: LegalRow[];
  body?: string;
  list?: string[];
};

const sections: LegalSection[] = [
  {
    number: "01",
    title: "Responsable du traitement",
    content: [
      { label: "Identité", value: "Yannick Dossou — Lumina Consulting" },
      { label: "Adresse", value: "206 Rue d'Oran, Résidence Rimbaud Bâtiment A/B, 30000 Nîmes, France" },
      { label: "Email", value: "dossouyannick.pro@gmail.com", href: "mailto:dossouyannick.pro@gmail.com" },
    ],
  },
  {
    number: "02",
    title: "Données collectées",
    body: "Ce site ne collecte aucune donnée personnelle de façon volontaire : il n'existe ni formulaire de contact, ni espace membre, ni inscription à une newsletter, ni outil d'analyse comportementale.",
  },
  {
    number: "03",
    title: "Logs techniques (hébergeur)",
    body: "L'hébergeur Vercel Inc. enregistre automatiquement des données techniques à chaque visite : adresse IP, type de navigateur, système d'exploitation, pages consultées, date et heure d'accès. Ces données sont traitées par Vercel dans le cadre de ses obligations d'exploitation et de sécurité, conformément à sa propre politique de confidentialité. Elles ne sont ni exploitées ni consultées par Lumina Consulting, sauf en cas de signalement d'incident de sécurité. Vercel conserve ces journaux pendant une durée limitée conforme à ses engagements RGPD.",
  },
  {
    number: "04",
    title: "Cookies",
    body: "Ce site ne dépose aucun cookie publicitaire, de traçage ou de mesure d'audience. Un unique cookie technique (nuxt-color-mode) peut être déposé automatiquement par l'infrastructure du site afin de prévenir un scintillement visuel lors du chargement des pages (rendu côté serveur). Ce cookie contient uniquement la valeur « light », ne contient aucune donnée personnelle et est qualifié de strictement nécessaire au fonctionnement technique du site — il ne requiert pas de consentement en vertu de la directive ePrivacy.",
  },
  {
    number: "05",
    title: "Polices de caractères",
    body: "Les polices utilisées sur ce site (Lora, DM Sans) sont téléchargées et auto-hébergées à la compilation via Nuxt Fonts. Aucune requête n'est envoyée vers les serveurs de Google ou d'un tiers lors de votre navigation.",
  },
  {
    number: "06",
    title: "Vos droits",
    body: "Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité concernant vos données personnelles. Dans la mesure où ce site ne collecte aucune donnée directement, ces droits s'exercent principalement auprès de l'hébergeur. Pour toute demande ou interrogation, vous pouvez contacter Lumina Consulting à l'adresse indiquée ci-dessus. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : cnil.fr.",
  },
  {
    number: "07",
    title: "Mise à jour",
    body: "Cette politique pourra être mise à jour en cas d'évolution du site ou de la réglementation. La date de dernière modification est indiquée en haut de cette page.",
  },
];
</script>

<template>
  <section class="py-[clamp(4rem,8vw,7rem)]">
    <UContainer>
      <div class="max-w-170 mx-auto">
        <!-- ─── Back link ─────────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.45, ease }"
          class="mb-12"
        >
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/35 hover:text-primary transition-colors duration-300 group"
          >
            <span class="group-hover:-translate-x-0.5 transition-transform duration-300 ease-out">←</span>
            <span>Accueil</span>
          </NuxtLink>
        </motion.div>

        <!-- ─── Page title ─────────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.65, delay: 0.07, ease }"
          class="mb-14 pb-10 border-b border-lumina-100"
        >
          <span class="section-label">Protection des données</span>
          <h1
            class="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep italic mt-0"
          >
            Politique de confidentialité
          </h1>
          <p class="mt-4 text-[0.8125rem] text-lumina-deep/35 tracking-[0.04em]">
            Dernière mise à jour · mars 2026
          </p>
        </motion.div>

        <!-- ─── Sections ───────────────────────────────────────────── -->
        <div>
          <motion.div
            v-for="(section, index) in sections"
            :key="section.number"
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.55, delay: 0.14 + index * 0.09, ease }"
            class="py-9 border-b border-lumina-100"
          >
            <!-- Section header -->
            <div class="flex items-baseline gap-3.5 mb-5">
              <span class="font-display text-[0.625rem] tabular-nums text-lumina-300/70 shrink-0 leading-none">
                {{ section.number }}
              </span>
              <h2 class="section-label mb-0">
                {{ section.title }}
              </h2>
            </div>

            <!-- Key-value rows -->
            <dl v-if="section.content" class="space-y-3 pl-[1.6rem]">
              <div
                v-for="row in section.content"
                :key="row.label"
                class="flex flex-col sm:flex-row sm:gap-8"
              >
                <dt class="text-[0.8125rem] text-lumina-deep/35 shrink-0 sm:w-44 leading-relaxed">
                  {{ row.label }}
                </dt>
                <dd class="text-[0.875rem] text-lumina-deep/70 leading-relaxed">
                  <a
                    v-if="row.href"
                    :href="row.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:text-lumina-600 underline underline-offset-2 decoration-lumina-300/50 transition-colors duration-200"
                  >
                    {{ row.value }}
                  </a>
                  <template v-else>
                    {{ row.value }}
                  </template>
                </dd>
              </div>
            </dl>

            <!-- Prose body -->
            <p v-if="section.body" class="pl-[1.6rem] text-[0.9375rem] leading-[1.85] text-lumina-deep/60">
              {{ section.body }}
            </p>
          </motion.div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
