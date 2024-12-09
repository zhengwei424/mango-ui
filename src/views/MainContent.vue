<template>
  <div class="main-container">
    <!-- 标签页 -->
    <div class="tab-container">
      <el-dropdown class="tabs-tools" :show-timeout="0" trigger="hover">
        <el-icon><arrow-down /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
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
        </template>
      </el-dropdown>
      <el-tabs
        class="tabs"
        v-model="mainTabsActiveName"
        @tab-click="selectedTabHandle"
        @tab-remove="removeTabHandle"
      >
        <el-tab-pane
          v-for="item in mainTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <template #label>
            <span><i :class="item.icon"></i> {{ item.title }} </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- <router-view/>获取component， <component/>使用component-->
      <router-view v-slot="{ Component, route }">
        <transition>
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { nextTick } from "vue";
import store from "@/store";
import { ArrowDown } from "@element-plus/icons-vue";

const router = useRouter();
const { mainTabs, mainTabsActiveName } = storeToRefs(store.useTabStore());

console.log("maincontent_maintabs:", mainTabs);

// tabs, 选中tab
function selectedTabHandle(tab) {
  tab = mainTabs.filter((item) => item.name === tab.name);
  if (tab.length >= 1) {
    router.push({ name: tab[0].name });
  }
}

// tabs, 删除tab
function removeTabHandle(tabName) {
  mainTabs.value = mainTabs.value.filter((item) => item.name !== tabName);
  if (mainTabs.value.length >= 1) {
    // 当前选中tab被删除
    if (tabName === mainTabsActiveName.value) {
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
  removeTabHandle(mainTabsActiveName);
}

// tabs, 关闭其它
function tabsCloseOtherHandle() {
  mainTabs.value = mainTabs.filter((item) => item.name === mainTabsActiveName);
}

// tabs, 关闭全部
function tabsCloseAllHandle() {
  mainTabs.value = [];
  router.push("/");
}

// tabs, 刷新当前
function tabsRefreshCurrentHandle() {
  let tempTabName = mainTabsActiveName;
  removeTabHandle(tempTabName);
  nextTick(() => {
    router.push({ name: tempTabName });
  });
}
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}

.tab-container {
  width: 100%;
  height: 60px;
}

.main-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>
