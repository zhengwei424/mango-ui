<template>
  <el-sub-menu
    v-if="menu.children && menu.children.length >= 1"
    :index="'' + menu.id"
  >
    <template v-slot:title>
      <!--      <el-icon>-->
      <!--        <component :is="menu.icon" />-->
      <!--      </el-icon>-->
      <!--      <i :class="menu.icon"></i>-->
      <i :class="'fa ' + menu.icon + ' fa-fw'"></i>
      <span slot="title">{{ menu.name }}</span>
    </template>
    <MenuTree
      v-for="item in menu.children"
      :key="item.id"
      :menu="item"
    ></MenuTree>
  </el-sub-menu>
  <el-menu-item v-else :index="'' + menu.id" @click="handleRoute(menu)">
    <!--    <el-icon>-->
    <!--      <component :is="menu.icon" />-->
    <!--    </el-icon>-->
    <i :class="'fa ' + menu.icon + ' fa-fw'"></i>
    <template v-slot:title>
      <span>{{ menu.name }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts">
export default {
  name: "MenuTree",
};
</script>

<script setup lang="ts">
import { IMenu } from "@/interface/menu.ts";
import {ITab} from "@/interface/tab.ts";
import { getIFrameUrl, getIFramePath } from "@/utils/iframe";
import { storeToRefs } from "pinia";
import { withDefaults, defineProps } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";

const router = useRouter();

let {mainTabs, mainTabsActiveName} = storeToRefs(store.useTabStore())

withDefaults(defineProps<{ menu: IMenu }>(), {});

function handleRoute(menu) {
  // 如果是嵌套页面，转换成iframe的path
  let path = getIFramePath(menu.url);
  store.useIframeStore().setIFrameUrl(menu.url);

  let tab:ITab = {name: menu.name,routePath: menu.url,icon: menu.icon} as ITab;
  store.useTabStore().setMainTabs(tab);
  store.useTabStore().setMainTabsActiveName(tab.name);

  if (!path) {
    path = menu.url;
  }
  // 通过菜单URL跳转至指定路由
  router.push("/" + path);
}
</script>

<style scoped lang="scss"></style>
