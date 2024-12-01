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
<!--                    <hamburger :isActive="collapse"></hamburger>-->
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
      >
        <el-menu-item index="1" @click="router.push('/')">{{
            t("common.home")
          }}</el-menu-item>
        <el-menu-item
            index="2"
            @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')"
        >{{ t("common.doc") }}</el-menu-item
        >
        <el-menu-item
            index="3"
            @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')"
        >{{ t("common.blog") }}</el-menu-item
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
          <ThemePicker
              class="theme-picker"
              :default="themeColor"
              @onThemeChange="onThemeChange"
          >
          </ThemePicker>
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
            <MessagePanel/>
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
            <NoticePanel/>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"
          ><img :src="user.avatar"/>{{ user.nickName }}</span
          >
          <el-popover
              ref="popover-personal"
              placement="bottom-end"
              trigger="click"
              :visible-arrow="false"
          >
            <PersonalPanel :user="user"></PersonalPanel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {onMounted, reactive, ref} from "vue";
import store from "@/store";
// import Hamburger from "@/components/Hamburger/index.vue";
import ThemePicker from "@/components/ThemePicker/index.vue";
import NoticePanel from "@/views/Core/NoticePanel.vue";
import MessagePanel from "@/views/Core/MessagePanel.vue";
import PersonalPanel from "@/views/Core/PersonalPanel.vue";
import {useRouter} from "vue-router";

let {t, locale} = useI18n();
const router = useRouter();

const {themeColor, collapse} = store.useAppStore();

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
  store.useAppStore().onCollapse();
}

// 切换主题
function onThemeChange(themeColor: string) {
  store.useAppStore().setThemeColor(themeColor)
}

// 语言切换
function changeLanguage(lang: "zh_cn" | "en_us") {
  locale = lang;
  langVisible.value = false;
}

onMounted(() => {
  // let user: any = sessionStorage.getItem("user");
  // if (user) {
  //   let params = { name: user };
  //   api.user.findByName(params).then((res: any) => {
  //     if (res.code == 200) {
  //       user = res.data;
  //       user.avatar = require("@/assets/user.png");
  //     }
  //   });
  // }
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
