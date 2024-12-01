<template>
  <el-button
    :size="size"
    :type="type"
    :icon="icon"
    :loading="loading"
    :disabled="!hasPerm(perms)"
    @click="handleClick"
  >
    {{ label }}
  </el-button>
</template>

<script setup lang="ts">
import { hasPermission } from "@/permission";
import { defineProps } from "vue";

const emit = defineEmits(["click"]);

let props = withDefaults(
  defineProps<{
    label: string; // 按钮显示文本
    icon: string; // 按钮显示图标
    size: string; // 按钮尺寸
    type: string; // 按钮类型
    loading: boolean; // 按钮加载标识
    disabled: boolean; // 按钮是否禁用
    perms: string; // 按钮权限标识，外部使用者传入
  }>(),
  {
    label: "Button",
    icon: "",
    size: "",
    type: "mini",
    loading: false,
    disabled: false,
    perms: "",
  },
);

function handleClick() {
  emit("click", {});
}

function hasPerm(perms: string) {
  return hasPermission(perms) && !props.disabled;
}
</script>

<style scoped></style>
