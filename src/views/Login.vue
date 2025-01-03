<template>
  <el-form
    :model="loginForm"
    :rules="fieldRules"
    ref="loginFormRef"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm login-container"
    @keyup.enter="login"
  >
    <span class="tool-bar">
      <!-- 主题切换 -->
      <theme-picker />
    </span>
    <h2 class="title" style="padding-left: 22px">系统登录</h2>
    <el-form-item prop="account">
      <el-input
        type="text"
        v-model="loginForm.account"
        auto-complete="off"
        placeholder="账号"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input
            type="text"
            v-model="loginForm.captcha"
            auto-complete="off"
            placeholder="验证码, 单击图片刷新"
            style="width: 100%"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img
            style="width: 100%"
            class="pointer"
            :src="loginForm.src"
            @click="refreshCaptcha"
            alt=""
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button style="width: 48%" @click.native.prevent="reset"
        >重 置
      </el-button>
      <el-button
        type="primary"
        style="width: 48%"
        @click="login"
        :loading="loading"
        >登 录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import ThemePicker from "@/components/ThemePicker/index.vue";
import store from "@/store";
import {ElMessage, FormInstance} from "element-plus";
import Cookies from "js-cookie";
import {inject, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";

const global = inject("global");
const api = inject("api");
const loginFormRef = ref<FormInstance>();
const router = useRouter();

let loading = ref(false);
let loginForm = reactive({
  account: "admin",
  password: "admin",
  captcha: "",
  src: "",
});

let fieldRules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

function login() {
  loading.value = true;
  let userInfo = {
    account: loginForm.account,
    password: loginForm.password,
    captcha: loginForm.captcha,
  };
  api.login
    .login(userInfo)
    .then((res: any) => {
      if (res.msg != null) {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      } else {
        Cookies.remove("token"); // 清理一次token，比秒
        Cookies.set("token", res.data.token); // 放置token到Cookie
        sessionStorage.setItem("user", userInfo.account); // 保存用户到本地会话
        store.useAppStore().changeMenuRouteLoaded(false); // 要求重新加载导航菜单
        store.useTabStore().init(); // 初始化tab
        router.push("/"); // 登录成功，跳转到主页
      }
      loading.value = false;
    })
    .catch((res) => {
      ElMessage({
        message: res.message,
        type: "error",
      });
    });
}

function refreshCaptcha() {
  loginForm.src = global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
}

function reset() {
  loginFormRef.value?.resetFields();
}

// 切换主题
function onThemeChange(themeColor: string) {
  store.useAppStore().setThemeColor(themeColor);
}

onMounted(() => {
  refreshCaptcha();
});
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
