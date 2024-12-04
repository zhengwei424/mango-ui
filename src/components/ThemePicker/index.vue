<template>
  <el-color-picker v-model="themeColor" size="small" @change="changeTheme" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import store from "@/store";

const { themeColor } = storeToRefs(store.useAppStore());
function changeTheme() {
  store.useAppStore().setThemeColor(themeColor.value);
}
</script>

<style scoped></style>
