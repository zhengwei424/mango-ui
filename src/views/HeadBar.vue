<template>
  <div class="headBar" :style="{ backgroundColor: themeColor }">
    <div class="nav">
      <!-- 导航菜单 -->
      <el-menu
        default-active="1"
        class="el-menu-nav"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal"
      >
        <div class="expand">
          <keep-alive>
            <el-icon
              style="display: block"
              size="24px"
              color="#ffffff"
              @click="changeIcon"
            >
              <component :is="collapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </keep-alive>
        </div>
        <el-menu-item index="1" @click="router.push('/')"
          >{{ t("common.home") }}
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')"
          >{{ t("common.doc") }}
        </el-menu-item>
        <el-menu-item
          index="3"
          @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')"
          >{{ t("common.blog") }}
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 工具栏 -->
    <div class="tools">
      <el-menu
        class="el-menu-tool"
        :background-color="themeColor"
        text-color="#14889A"
        :active-text-color="themeColor"
        mode="horizontal"
      >
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker />
        </el-menu-item>
        <el-menu-item index="2">
          <!-- 语言切换 -->
          <el-popover
            ref="popover-lang"
            placement="bottom"
            trigger="click"
            :show-arrow="false"
            :show-after="300"
          >
            <template #reference>
              <i style="color: #fff" class="fa fa-language fa-lg"></i>
            </template>
            <template #default>
              <div class="lang-item" @click="changeLanguage('zh_cn')">
                简体中文
              </div>
              <div class="lang-item" @click="changeLanguage('en_us')">
                English
              </div>
            </template>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3">
          <!-- 我的私信 -->
          <el-popover
            ref="popover-message"
            placement="bottom"
            trigger="click"
            width="300px"
            :show-arrow="false"
            :show-after="300"
          >
            <template #reference>
              <el-badge :value="5" :max="99" class="badge">
                <i style="color: #fff" class="fa fa-envelope-o fa-lg"></i>
              </el-badge>
            </template>
            <template #default>
              <MessagePanel data="" />
            </template>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4">
          <!-- 系统通知 -->
          <el-popover
            ref="popover-notice"
            placement="bottom"
            trigger="click"
            width="300px"
            :show-arrow="false"
            :show-after="300"
          >
            <template #reference>
              <el-badge :value="4" :max="99" class="badge">
                <i style="color: #fff" class="fa fa-bell-o fa-lg"></i>
              </el-badge>
            </template>
            <template #default>
              <NoticePanel data="" />
            </template>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5">
          <!-- 用户信息 -->
          <el-popover
            ref="popover-personal"
            placement="bottom-end"
            trigger="click"
            width="300px"
          >
            <template #reference>
              <span class="user-info">
                <img src="../assets/user.png" alt="" srcset="" />
                超管
              </span>
            </template>
            <template #default>
              <PersonalPanel :user="user"></PersonalPanel>
            </template>
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
let langVisible = ref(false);

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
  locale.value = lang;
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

.nav {
  width: 100%;
}

.expand {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}

.tools {
  min-width: 450px;
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
  font-size: 16px;
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
