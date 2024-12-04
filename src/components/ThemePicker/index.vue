<template>
  <el-color-picker
    v-model="themeColor"
    size="default"
    show-alpha
    :predefine="predefineColors"
    @change="changeTheme"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import store from "@/store";
import { ref } from "vue";

const predefineColors = ref([
  "#14889A",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);

const { themeColor } = storeToRefs(store.useAppStore());

function changeTheme() {
  store.useAppStore().setThemeColor(themeColor.value);
}
</script>

<style>
.el-icon.el-color-picker__icon.is-icon-arrow-down {
  margin-right: 0 !important;
}
</style>
