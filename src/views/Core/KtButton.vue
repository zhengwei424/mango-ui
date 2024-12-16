<template>
  <el-button
      :size="size"
      :type="type"
      :loading="loading"
      :disabled="!hasPerm(perms)"
  >
    <template #icon>
      <i :class="icon"/>
    </template>
    {{ label }}
  </el-button>

</template>

<script setup lang="ts">
import {hasPermission} from "@/permission";
import {defineProps} from "vue";

let props = withDefaults(
    defineProps<{
      label?: string; // 按钮显示文本
      icon?: string; // 按钮显示图标
      size?: any; // 按钮尺寸
      type?: any; // 按钮类型
      loading?: boolean; // 按钮加载标识
      disabled?: boolean;
      perms?: string; // 按钮权限标识，外部使用者传入
    }>(),
    {
      label: "Button",
      icon: "",
      size: "default",
      type: "primary",
      disabled: false,
      loading: false,
      perms: "",
    },
);

function hasPerm(perms: string) {
  return hasPermission(perms) && !props.disabled;
}
</script>

<style scoped></style>
