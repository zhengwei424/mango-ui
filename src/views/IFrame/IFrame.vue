<template>
  <div class="iframe-container">
    <iframe :src="iframeUrl" class="frame"></iframe>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import { storeToRefs } from "pinia";

const { iframeUrl } = storeToRefs(store.useIframeStore());
</script>

<style scoped>
.iframe-container,
iframe {
  width: 100%;
  height: 100%;
}
</style>
