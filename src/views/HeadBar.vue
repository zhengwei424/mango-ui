<template>
  <div class="headBar" :style="{ backgroundColor: themeColor }">
    <div class="fold">
      <!-- 导航收缩 -->
      <!--
      background-color deprecated	菜单的背景颜色 (十六进制格式) (推荐在样式类中使用 --el-menu-bg-color)
      text-color deprecated	菜单的文字颜色 (十六进制格式) (推荐在样式类中使用 --el-menu-text-color)
      active-text-color deprecated	活动菜单项的文本颜色（十六进制格式）（推荐使用 css var --el-menu-active-color）
      -->

      <el-icon><component :is="icon" /></el-icon>
    </div>

    <div class="nav">
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal"
      >
        <div class="expand" @click="changeIcon">
          <el-icon size="24px" color="#ffffff">
            <component :is="collapse ? icon.expand : icon.fold"></component>
          </el-icon>
        </div>

        <el-menu-item index="2" @click="router.push('/')"
          >{{ t("common.home") }}
        </el-menu-item>
        <el-menu-item
          index="3"
          @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')"
          >{{ t("common.doc") }}
        </el-menu-item>
        <el-menu-item
          index="4"
          @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')"
          >{{ t("common.blog") }}
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 工具栏 -->
    <div class="tools">
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
            <MessagePanel />
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
            <NoticePanel />
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"
            ><img src="../assets/user.png" alt="" srcset="" />超管</span
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { inject, onMounted, reactive, ref } from "vue";
import store from "@/store";
// import Hamburger from "@/components/Hamburger/index.vue";
import ThemePicker from "@/components/ThemePicker/index.vue";
import NoticePanel from "@/views/Core/NoticePanel.vue";
import MessagePanel from "@/views/Core/MessagePanel.vue";
import PersonalPanel from "@/views/Core/PersonalPanel.vue";
import { useRouter } from "vue-router";
import { Expand, Flag, Fold, Location } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";

let { t, locale } = useI18n();
const router = useRouter();
const api = inject("api");
const { themeColor, collapse } = storeToRefs(store.useAppStore());

let user = reactive({});
let activeIndex = ref("1");
let langVisible = ref(false);

enum icon {
  expand = "Expand",
  fold = "Fold",
}

function openWindow(url: any) {
  window.open(url);
}

function selectNavBar(key: any, keyPath: any) {
  console.log(key, keyPath);
}

// 折叠导航栏
function changeIcon() {
  store.useAppStore().setCollapse();
  console.log("collapse: ", collapse);
}

// 切换主题
function onThemeChange(themeColor: string) {
  store.useAppStore().setThemeColor(themeColor);
}

// 语言切换
function changeLanguage(lang: "zh_cn" | "en_us") {
  locale = lang;
  langVisible.value = false;
}

onMounted(() => {
  let user: any = sessionStorage.getItem("user");
  if (user) {
    let params = { name: user };
    api.user.findByName(params).then((res: any) => {
      if (res.code == 200) {
        user = res.data;
      }
    });
  }
});
</script>

<style scoped lang="scss">
.headBar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.expand {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
}

.nav {
  width: 100%;
}

.tools {
  width: 500px;
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
