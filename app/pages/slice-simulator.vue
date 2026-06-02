<script setup lang="ts">
import { components } from "~/slices";

definePageMeta({
  layout: "blank",
});

useSeoMeta({
  robots: "noindex, nofollow",
});
</script>

<template>
  <SliceSimulator v-slot="{ slices }" background="transparent">
    <SliceZone
      :slices="slices"
      :components="components"
    />
  </SliceSimulator>
</template>
