<template>
  <div class="menu-bar-container">
    <!-- logo -->
    <div
      class="logo"
      :style="{ 'background-color': themeColor }"
      :class="collapse ? 'menu-bar-collapse-width' : 'menu-bar-width'"
      @click="$router.push('/')"
    >
      <img v-if="collapse" src="@/assets/logo.png" />
      <div>{{ collapse ? "" : appName }}</div>
    </div>
    <!-- 导航菜单 -->
    <el-menu
      ref="navmenuRef"
      default-active="1"
      :class="collapse ? 'menu-bar-collapse-width' : 'menu-bar-width'"
      :collapse="collapse"
      :collapse-transition="false"
      :unique-opened="true"
      @open="handleopen"
      @close="handleclose"
      @select="handleselect"
    >
      <!-- 导航菜单树组件，动态加载菜单 -->
      <menu-tree
        v-for="item in navTree"
        :key="item.id"
        :menu="item"
      ></menu-tree>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { mapState } from "vuex";
import MenuTree from "@/components/MenuTree";

const navmenuRef = ref();

// ...mapState({
//   appName: state=>state.app.appName,
//   themeColor: state=>state.app.themeColor,
//   collapse: state=>state.app.collapse,
//   navTree: state=>state.menu.navTree
// }),
let mainTabs = computed({
  get() {
    return this.$store.state.tab.mainTabs;
  },
  set(val) {
    this.$store.commit("updateMainTabs", val);
  },
});
let mainTabsActiveName = computed({
  get() {
    return this.$store.state.tab.mainTabsActiveName;
  },
  set(val) {
    this.$store.commit("updateMainTabsActiveName", val);
  },
});

watchEffect(() => {
  // $route: 'handleRoute'
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
  let tab = mainTabs.filter((item) => item.name === route.name)[0];
  if (!tab) {
    tab = {
      name: route.name,
      title: route.name,
      icon: route.meta.icon,
    };
    mainTabs = mainTabs.concat(tab);
  }
  mainTabsActiveName = tab.name;
  // 切换标签页时同步更新高亮菜单
  if (navmenuRef.value != null) {
    navmenuRef.value.activeIndex = "" + route.meta.index;
    navmenuRef.value.initOpenedMenu();
  }
}
</script>

<style scoped lang="scss">
.menu-bar-container {
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  z-index: 1020;
  .el-menu {
    position: absolute;
    top: 60px;
    bottom: 0px;
    text-align: left;
    // background-color: #2968a30c;
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
  .menu-bar-width {
    width: 200px;
  }
  .menu-bar-collapse-width {
    width: 65px;
  }
}
</style>
