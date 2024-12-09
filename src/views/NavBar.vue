<template>
  <div class="menu-bar-container">
    <!-- logo -->
    <div
      class="logo"
      :style="{ 'background-color': themeColor }"
      @click="router.push('/')"
    >
      <div v-show="collapse">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div v-show="!collapse">{{ collapse ? "" : appName }}</div>
    </div>

    <div class="nav-menu">
      <!-- 导航菜单 -->
      <el-menu
        ref="navmenuRef"
        class="el-menu-vertical-demo"
        :class="collapse ? 'menu-bar-fold-width' : 'menu-bar-expand-width'"
        default-active="1"
        :collapse="collapse"
        :unique-opened="true"
        :collapse-transition="false"
        :background-color="themeColor"
        @open="handleopen"
        @close="handleclose"
        @select="handleselect"
      >
        <!-- 导航菜单树组件，动态加载菜单 -->
        <MenuTree
          v-for="item in navTree"
          :key="item.id"
          :menu="item"
        ></MenuTree>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watchEffect } from "vue";
import MenuTree from "../components/MenuTree/index.vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";

const router = useRouter();

const { appName, themeColor, collapse } = storeToRefs(store.useAppStore());
const navmenuRef = ref();

let { mainTabs, mainTabsActiveName } = storeToRefs(store.useTabStore());
const { navTree } = storeToRefs(store.useMenuStore());

function handleopen() {
  console.log("handleopen");
}

function handleclose() {
  console.log("handleclose");
}

function handleselect(a, b) {
  console.log("handleselect");
}

// // 路由操作处理
// function handleRoute(route) {
//   // tab标签页选中, 如果不存在则先添加
//   let tab = mainTabs.filter((item) => item.name === route.name)[0];
//   if (!tab) {
//     tab = {
//       name: route.name,
//       title: route.name,
//       icon: route.meta.icon,
//     };
//     mainTabs = mainTabs.concat(tab);
//   }
//   mainTabsActiveName.value = tab.name;
//   // 切换标签页时同步更新高亮菜单
//   if (navmenuRef.value != null) {
//     navmenuRef.value.activeIndex = "" + route.meta.index;
//     navmenuRef.value.initOpenedMenu();
//   }
// }

// // 执行一次
// handleRoute(route);
//
// watchEffect(() => {
//   handleRoute(route);
// });
</script>

<style scoped lang="scss">
.menu-bar-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.nav-menu,
.el-menu-vertical-demo {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}

.logo {
  height: 60px;
  width: 100%;
  line-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  img {
    display: block;
    width: 32px;
    height: 32px;
  }

  div {
    font-size: 22px;
    color: white;
    text-align: center;
  }
}

.menu-bar-expand-width {
  width: 200px;
}

.menu-bar-fold-width {
  width: 65px;
}
</style>
