<template>
  <div
    class="headbar"
    :style="{ background: themeColor }"
    :class="collapse ? 'position-collapse-left' : 'position-left'"
  >
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu
        class="el-menu-demo"
        :background-color="themeColor"
        text-color="#fff"
        :active-text-color="themeColor"
        mode="horizontal"
      >
        <el-menu-item index="1" @click="onCollapse">
          <hamburger :isActive="collapse"></hamburger>
        </el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal"
        @select="selectNavBar()"
      >
        <el-menu-item index="1" @click="$router.push('/')">{{
          $t("common.home")
        }}</el-menu-item>
        <el-menu-item
          index="2"
          @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')"
          >{{ $t("common.doc") }}</el-menu-item
        >
        <el-menu-item
          index="3"
          @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')"
          >{{ $t("common.blog") }}</el-menu-item
        >
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu
        class="el-menu-demo"
        :background-color="themeColor"
        text-color="#14889A"
        :active-text-color="themeColor"
        mode="horizontal"
      >
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker
            class="theme-picker"
            :default="themeColor"
            @onThemeChange="onThemeChange"
          >
          </theme-picker>
        </el-menu-item>
        <el-menu-item index="2" v-popover:popover-lang>
          <!-- 语言切换 -->
          <li style="color: #fff" class="fa fa-language fa-lg"></li>
          <el-popover
            ref="popover-lang"
            placement="bottom-start"
            trigger="click"
            v-model="langVisible"
          >
            <div class="lang-item" @click="changeLanguage('zh_cn')">
              简体中文
            </div>
            <div class="lang-item" @click="changeLanguage('en_us')">
              English
            </div>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3" v-popover:popover-message>
          <!-- 我的私信 -->
          <el-badge :value="5" :max="99" class="badge">
            <li style="color: #fff" class="fa fa-envelope-o fa-lg"></li>
          </el-badge>
          <el-popover
            ref="popover-message"
            placement="bottom-end"
            trigger="click"
          >
            <message-panel></message-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4" v-popover:popover-notice>
          <!-- 系统通知 -->
          <el-badge :value="4" :max="99" class="badge">
            <li style="color: #fff" class="fa fa-bell-o fa-lg"></li>
          </el-badge>
          <el-popover
            ref="popover-notice"
            placement="bottom-end"
            trigger="click"
          >
            <notice-panel></notice-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"
            ><img :src="user.avatar" />{{ user.nickName }}</span
          >
          <el-popover
            ref="popover-personal"
            placement="bottom-end"
            trigger="click"
            :visible-arrow="false"
          >
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script setup lang="ts">
import api from "@/http/api.ts";
import i18n from "../i18n";
import { options } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { mapState } from "vuex";
import Hamburger from "@/components/Hamburger";
import ThemePicker from "@/components/ThemePicker";
import NoticePanel from "@/views/Core/NoticePanel";
import MessagePanel from "@/views/Core/MessagePanel";
import PersonalPanel from "@/views/Core/PersonalPanel";
import { useStore } from "vuex/types/index.d.ts";

const store = useStore();

let user = reactive({});
let activeIndex = ref("1");
let langVisible = ref(false);

function openWindow(url: any) {
  window.open(url);
}

function selectNavBar(key: any, keyPath: any) {
  console.log(key, keyPath);
}

// 折叠导航栏
function onCollapse() {
  store.commit("onCollapse");
}

// 切换主题
function onThemeChange(themeColor: string) {
  store.commit("setThemeColor", themeColor);
}

// 语言切换
function changeLanguage(lang: "zh_cn" | "en_us") {
  i18n.global.locale = lang;
  langVisible.value = false;
}

computed(() => {
  mapState({
    themeColor: (state: any) => state.app.themeColor,
    collapse: (state: any) => state.app.collapse,
  });
});

onMounted(() => {
  let user: any = sessionStorage.getItem("user");
  if (user) {
    let params = { name: user };
    api.user.findByName(params).then((res: any) => {
      if (res.code == 200) {
        user = res.data;
        user.avatar = require("@/assets/user.png");
      }
    });
  }
});
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}

.hamburg {
  float: left;
}

.navbar {
  float: left;
}

.toolbar {
  float: right;
}

.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}

.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}

.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}

.badge {
  line-height: 18px;
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>
