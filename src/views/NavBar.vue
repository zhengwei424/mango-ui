<template>
  <div class="menu-bar-container">
    <!-- logo -->
    <div
      class="logo"
      :class="collapse ? 'menu-bar-fold-width' : 'menu-bar-expand-width'"
      :style="{ 'background-color': themeColor }"
      @click="router.push('/')"
    >
      <img v-if="collapse" src="../assets/logo.png" alt="" />
      <div>{{ collapse ? "" : appName }}</div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      ref="navmenuRef"
      class="el-menu-vertical-demo"
      :class="collapse ? 'menu-bar-fold-width' : 'menu-bar-expand-width'"
      default-active="1"
      :collapse="collapse"
      :unique-opened="true"
      @open="handleopen"
      @close="handleclose"
      @select="handleselect"
    >
      <!--        &lt;!&ndash; 导航菜单树组件，动态加载菜单 &ndash;&gt;-->
      <!--        <MenuTree v-for="item in navTree" :key="item.id" :menu="item"></MenuTree>-->

      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import MenuTree from "../components/MenuTree/index.vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";

const router = useRouter();
const { appName, themeColor, collapse } = store.useAppStore();
const navmenuRef = ref();

let { mainTabs, mainTabsActiveName } = store.useTabStore();
const { navTree } = store.useMenuStore();

watchEffect(() => {
  route: "handleRoute";
});

// handleRoute(this.$route)

function handleopen() {
  console.log("handleopen");
}

function handleclose() {
  console.log("handleclose");
}

function handleselect(a, b) {
  console.log("handleselect");
}

// 路由操作处理
function handleRoute(route) {
  // tab标签页选中, 如果不存在则先添加
  let tab = mainTabs.value.filter((item) => item.name === route.name)[0];
  if (!tab) {
    tab = {
      name: route.name,
      title: route.name,
      icon: route.meta.icon,
    };
    mainTabs = mainTabs.concat(tab);
  }
  mainTabsActiveName.value = tab.name;
  // 切换标签页时同步更新高亮菜单
  if (navmenuRef.value != null) {
    navmenuRef.value.activeIndex = "" + route.meta.index;
    navmenuRef.value.initOpenedMenu();
  }
}
</script>

<style scoped lang="scss">
.menu-bar-container {
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.logo {
  position: absolute;
  top: 0px;
  height: 60px;
  line-height: 60px;
  background: #545c64;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 0px;
    margin: 10px 10px 10px 10px;
    float: left;
  }

  div {
    font-size: 22px;
    color: white;
    text-align: left;
    padding-left: 20px;
  }
}
.menu-bar-expand-width {
  width: 200px;
}

.menu-bar-fold-width {
  width: 65px;
}
</style>
