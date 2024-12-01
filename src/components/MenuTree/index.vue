<template>
  <el-sub-menu
    v-if="menu.children && menu.children.length >= 1"
    :index="'' + menu.id"
  >
    <template v-slot:title>
      <i :class="menu.icon"></i>
      <span slot="title">{{ menu.name }}</span>
    </template>
    <MenuTree
      v-for="item in menu.children"
      :key="item.id"
      :menu="item"
    ></MenuTree>
  </el-sub-menu>
  <el-menu-item v-else :index="'' + menu.id" @click="handleRoute(menu)">
    <i :class="menu.icon"></i>
    <template v-slot:title>
      <span>{{ menu.name }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "MenuTree"
})

</script>

<script setup lang="ts">
import { getIFrameUrl, getIFramePath } from "@/utils/iframe";
import {withDefaults, defineProps} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()

withDefaults(defineProps<{menu: any}>(), {
  menu: {name: "zhangsan"}
})

function handleRoute(menu) {
  // 如果是嵌套页面，转换成iframe的path
  let path = getIFramePath(menu.url);
  if (!path) {
    path = menu.url;
  }
  // 通过菜单URL跳转至指定路由
  router.push("/" + path);
}
</script>


<style scoped lang="scss"></style>
