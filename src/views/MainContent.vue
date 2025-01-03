<template>
  <div class="main-container">
    <!-- 标签页 -->
    <div class="tab-container">
      <el-dropdown class="tabs-tools" :show-timeout="0" trigger="hover">
        <el-icon size="16px">
          <arrow-down/>
        </el-icon>
        标签管理
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
      <!-- v-model的值必须要和el-tab-pane的name属性的值相同，活动标签的前端渲染才不会有问题。即mainTabsActiveName与当前活动标签的name属性值相同来判断活动标签 -->
      <el-tabs
          class="tabs"
          v-model="mainTabsActiveName"
          @tab-click="selectedTabHandle"
          @tab-remove="removeTabHandle"
          closable
      >
        <el-tab-pane
            v-for="item in mainTabs"
            :key="item.name"
            :name="item.name"
            lazy
        >
          <template #label>
            <span><i :class="'fa ' + item.icon + ' fa-fw'"></i> {{ item.name }} </span>
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
            <component :is="Component" :key="route.fullPath"/>
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import {ArrowDown} from "@element-plus/icons-vue";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

const router = useRouter();
let {mainTabs, mainTabsActiveName} = storeToRefs(store.useTabStore());


// tabs, 选中tab
function selectedTabHandle(currentTabPane) {
  let tab = mainTabs.value.filter((item) => item.name === currentTabPane.paneName);
  if (tab.length >= 1) {
    router.push({name: tab[0].name});
  }
}

// tabs, 删除tab
function removeTabHandle(tabName) {
  mainTabs.value = mainTabs.value.filter((item) => item.name !== tabName);
  if (mainTabs.value.length >= 1) {
    // 当前选中tab被删除,选中最后一个为活动标签
    let tmp = mainTabs.value[mainTabs.value.length - 1]
    mainTabsActiveName.value = tmp.name
    router.push("/" + tmp.routePath)
  } else {
    router.push("/");
  }
}

// tabs, 关闭当前
function tabsCloseCurrentHandle() {
  removeTabHandle(mainTabsActiveName.value);
}

// tabs, 关闭其它
function tabsCloseOtherHandle() {
  mainTabs.value = mainTabs.value.filter((item) => item.name === mainTabsActiveName.value);
}

// tabs, 关闭全部
function tabsCloseAllHandle() {
  mainTabs.value = [];
  router.push("/");
}

// tabs, 刷新当前
function tabsRefreshCurrentHandle() {
  let tempTabName = mainTabsActiveName.value;
  router.push({name: tempTabName});
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  overflow: auto;
}

.tabs-tools {
  margin: auto 20px;
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>
