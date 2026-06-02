<script setup lang="ts">
import { asImageSrc } from "@prismicio/client";

const prismic = usePrismic();

const { data: settings } = await useAsyncData("settings", () =>
  prismic.client.getSingle("settings"));

useSeoMeta({
  title: settings.value?.data.site_title,
  ogTitle: settings.value?.data.site_title,
  description: settings.value?.data.meta_description,
  ogDescription: settings.value?.data.meta_description,
  ogImage: () => asImageSrc(settings.value?.data.meta_image),
  ogType: "website",
  ogLocale: "fr_FR",
  twitterCard: "summary_large_image",
  twitterTitle: settings.value?.data.site_title,
  twitterDescription: settings.value?.data.meta_description,
  twitterImage: () => asImageSrc(settings.value?.data.meta_image),
});

useSchemaOrg([
  defineOrganization({
    name: "Lumina Consulting",
    url: "https://www.luminaconsulting.fr",
    logo: "https://www.luminaconsulting.fr/images/logo.webp",
  }),
  defineWebSite({
    name: "Lumina Consulting",
  }),
  defineWebPage(),
]);
</script>

<template>
  <div>
    <Header :settings="settings" />

    <UMain>
      <slot />
    </UMain>

    <Footer :settings="settings" />
  </div>
</template>
