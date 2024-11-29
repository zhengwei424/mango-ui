<template>
  <div
    id="main-container"
    class="main-container"
    :class="
      $store.state.app.collapse ? 'position-collapse-left' : 'position-left'
    "
  >
    <!-- 标签页 -->
    <div class="tab-container">
      <el-tabs
        class="tabs"
        :class="
          $store.state.app.collapse ? 'position-collapse-left' : 'position-left'
        "
        v-model="mainTabsActiveName"
        :closable="true"
        type="card"
        @tab-click="selectedTabHandle"
        @tab-remove="removeTabHandle"
      >
        <el-dropdown class="tabs-tools" :show-timeout="0" trigger="hover">
          <div style="font-size: 20px; width: 50px">
            <i class="el-icon-arrow-down"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="tabsCloseCurrentHandle"
              >关闭当前标签
            </el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseOtherHandle"
              >关闭其它标签
            </el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseAllHandle"
              >关闭全部标签
            </el-dropdown-item>
            <el-dropdown-item @click.native="tabsRefreshCurrentHandle"
              >刷新当前标签
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tab-pane
          v-for="item in mainTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <span slot="label"><i :class="item.icon"></i> {{ item.title }} </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { computed, nextTick } from "vue";

let mainTabs: any = computed({
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

// tabs, 选中tab
function selectedTabHandle(tab) {
  tab = this.mainTabs.filter((item) => item.name === tab.name);
  if (tab.length >= 1) {
    router.push({ name: tab[0].name });
  }
}

// tabs, 删除tab
function removeTabHandle(tabName) {
  mainTabs = mainTabs.filter((item) => item.name !== tabName);
  if (mainTabs.length >= 1) {
    // 当前选中tab被删除
    if (tabName === mainTabsActiveName) {
      // router.push(
      //   { name: mainTabs[this.mainTabs.length - 1].name },
      //   () => {
      //     mainTabsActiveName = this.$route.name;
      //   },
      // );
    }
  } else {
    router.push("/");
  }
}

// tabs, 关闭当前
function tabsCloseCurrentHandle() {
  removeTabHandle(this.mainTabsActiveName);
}

// tabs, 关闭其它
function tabsCloseOtherHandle() {
  mainTabs = this.mainTabs.filter(
    (item) => item.name === this.mainTabsActiveName,
  );
}

// tabs, 关闭全部
function tabsCloseAllHandle() {
  mainTabs = [];
  router.push("/");
}

// tabs, 刷新当前
function tabsRefreshCurrentHandle() {
  let tempTabName = this.mainTabsActiveName;
  removeTabHandle(tempTabName);
  nextTick(() => {
    router.push({ name: tempTabName });
  });
}
</script>

<style scoped lang="scss">
.main-container {
  padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  // background: rgba(56, 5, 114, 0.5);
  .tabs {
    position: fixed;
    top: 60px;
    right: 50px;
    padding-left: 0px;
    padding-right: 2px;
    z-index: 1020;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: rgb(255, 253, 255);
    border-color: rgba(200, 206, 206, 0.5);
    // border-left-width: 1px;
    // border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  .tabs-tools {
    position: fixed;
    top: 60px;
    right: 0;
    z-index: 1020;
    height: 40px;
    // padding: 0 10px;
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
    border-color: rgba(200, 206, 206, 0.5);
    border-left-width: 1px;
    border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: rgba(255, 255, 255, 1);
  }

  .tabs-tools:hover {
    background: rgba(200, 206, 206, 1);
  }

  .main-content {
    position: absolute;
    top: 45px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    // background: rgba(209, 212, 212, 0.5);
  }
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>
