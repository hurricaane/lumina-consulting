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
});
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
