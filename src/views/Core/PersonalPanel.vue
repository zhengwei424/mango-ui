<template>
  <div class="personal-panel">
    <div
      class="personal-desc"
      :style="{ background: store.useAppStore().themeColor }"
    >
      <div class="avatar-container">
        <img class="avatar" src="@/assets/user.png" />
      </div>
      <div class="name-role">
        <span class="sender">{{ user.nickName }} - {{ user.roleNames }}</span>
      </div>
      <div class="registe-info">
        <span class="registe-info">
          <li class="fa fa-clock-o"></li>
          {{ dateFormat(user.createTime) }}
        </span>
      </div>
    </div>
    <div class="personal-relation">
      <span class="relation-item">followers</span>
      <span class="relation-item">watches</span>
      <span class="relation-item">friends</span>
    </div>
    <div class="main-operation">
      <span class="main-operation-item" @click="openPersonCenter">
        <el-button size="small">
          <template #icon>
            <i class="fa fa-male" />
          </template>
          个人中心
        </el-button>
      </span>
      <span class="main-operation-item" @click="openupdatePasswordDialog">
        <el-button size="small">
          <template #icon>
            <i class="fa fa-key" />
          </template>
          修改密码
        </el-button>
      </span>
    </div>
    <div class="other-operation">
      <div class="other-operation-item" @click="clearCache">
        <li class="fa fa-eraser"></li>
        清除缓存
      </div>
      <div class="other-operation-item" @click="openOnlinePage">
        <li class="fa fa-user"></li>
        在线人数 {{ onlineUser }}
      </div>
      <div class="other-operation-item">
        <li class="fa fa-bell"></li>
        访问次数 {{ accessTimes }}
      </div>
      <div class="other-operation-item" @click="showBackupDialog">
        <li class="fa fa-undo"></li>
        {{ t("common.backupRestore") }}
      </div>
    </div>
    <div class="personal-footer" @click="logout">
      <li class="fa fa-sign-out"></li>
      {{ t("common.logout") }}
    </div>
    <!--修改密码界面-->
    <el-dialog
      title="修改密码"
      width="40%"
      v-model="updatePwdDialogVisible"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form
        :model="updatePwdDataForm"
        label-width="100px"
        :rules="updatePwdDataFormRules"
        ref="updatePwdDataFormRef"
        :size="size"
      >
        <el-form-item label="原密码" prop="password">
          <el-input
            v-model="updatePwdDataForm.password"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="updatePwdDataForm.newPassword"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="updatePwdDataForm.confirmPassword"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button :size="size" @click.native="updatePwdDialogVisible = false"
            >{{ t("action.cancel") }}
          </el-button>
          <el-button
            :size="size"
            type="primary"
            @click.native="updatePassword"
            :loading="updatePwdLoading"
          >
            {{ t("action.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!--备份还原界面-->
    <backup ref="backupDialogRef" @afterRestore="afterRestore"></backup>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import {format} from "@/utils/datetime";
import Backup from "@/views/Backup/Backup.vue";
import {ElMessage, ElMessageBox, FormInstance} from "element-plus";
import {defineProps, onMounted, reactive, ref, withDefaults} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const { t } = useI18n();
const router = useRouter();

withDefaults(defineProps<{ user: any }>(), {
  user: () => {
    return {
      nickName: "admin",
      avatar: "@/assets/user.png",
      role: "超级管理员",
      registeInfo: "注册时间：2018-12-25 ",
    };
  },
});

const backupDialogRef = ref();
const updatePwdDataFormRef = ref<FormInstance>();
let onlineUser = ref(0);
let accessTimes = ref(0);
let size = ref("small");
let updatePwdDialogVisible = ref(false);
let updatePwdLoading = ref(false);
let updatePwdDataForm = reactive({
  password: "",
  newPassword: "",
  confirmPassword: "",
});
let updatePwdDataFormRules = reactive({
  password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请确认密码", trigger: "blur" }],
});

// 打开个人中心
function openPersonCenter() {
  alert("待开发");
}

// 打开修改密码对话框
function openupdatePasswordDialog() {
  updatePwdDialogVisible.value = true;
}

// 修改密码
function updatePassword() {
  updatePwdDataFormRef.value?.validate((valid) => {
    if (valid) {
      if (updatePwdDataForm.newPassword != updatePwdDataForm.confirmPassword) {
        ElMessage({ message: "新密码与确认新密码不一致", type: "error" });
        return;
      }
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        updatePwdLoading.value = true;
        let params = {
          password: updatePwdDataForm.password,
          newPassword: updatePwdDataForm.newPassword,
        };
        // api.user.updatePassword(params).then((res: any) => {
        //   updatePwdLoading.value = false;
        //   if (res.code == 200) {
        //     ElMessage({ message: "操作成功", type: "success" });
        //     updatePwdDataFormRef.value?.resetFields();
        //     logoutApi();
        //   } else {
        //     ElMessage({ message: "操作失败, " + res.msg, type: "error" });
        //   }
        //   updatePwdDialogVisible.value = false;
        // });
      });
    }
  });
}

// 退出登录
function logout() {
  ElMessageBox.confirm!("确认退出吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      logoutApi();
    })
    .catch(() => {});
}

// 清除缓存并退出登录
function clearCache() {
  ElMessageBox.confirm!("确认清除缓存并退出登录吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      deleteCookie("token"); // 清空Cookie里的token
      logoutApi();
    })
    .catch(() => {});
}

function logoutApi() {
  sessionStorage.removeItem("user");
  router.push("/login");
  // api.login
  //   .logout()
  //   .then(() => {})
  //   .catch(function () {});
}

// 清除Cookie
function deleteCookie(name: string) {
  let myDate = new Date();
  myDate.setTime(-1000); // 设置过期时间
  document.cookie = name + "=''; expires=" + myDate.toUTCString();
}

// 获取在线用户数
function countOnlineUser() {
  let pageRequest = { pageNum: 1, pageSize: 10000000, params: [{}] };
  pageRequest.params = [{ name: "status", value: "online" }];
  // api.loginlog.findPage(pageRequest).then((res: any) => {
  //   onlineUser.value = res.data.content.length;
  // });
}

// 获取访问次数
function countAccessTimes() {
  let pageRequest = { pageNum: 1, pageSize: 10000000, params: [{}] };
  pageRequest.params = [{ name: "status", value: "login" }];
  // api.loginlog.findPage(pageRequest).then((res: any) => {
  //   accessTimes.value = res.data.content.length + 1;
  // });
}

function openOnlinePage() {
  // 通过菜单URL跳转至指定路由
  router.push("/Sys/online");
}

// 时间格式化
function dateFormat(date: string) {
  return format(date);
}

// 打开备份还原界面
function showBackupDialog() {
  backupDialogRef.value.setBackupVisible(true);
}

// 成功还原之后，重新登录
function afterRestore() {
  backupDialogRef.value.setBackupVisible(false);
  sessionStorage.removeItem("user");
  router.push("/login");
  // api.login
  //   .logout()
  //   .then(() => {})
  //   .catch(function () {});
}

onMounted(() => {
  countOnlineUser();
  countAccessTimes();
});
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 300px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  background: rgba(182, 172, 172, 0.1);
  margin: -14px;
}

.personal-desc {
  padding: 15px;
  color: #fff;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}

.name-role {
  font-size: 16px;
  padding: 5px;
}

.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}

.relation-item {
  padding: 12px;
}

.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}

.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.main-operation-item {
  margin: 15px;
}

.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.other-operation-item {
  padding: 12px;
}

.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}

.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}

.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>
