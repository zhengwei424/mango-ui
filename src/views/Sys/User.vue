<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="t('action.search')"
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="t('action.add')"
            perms="sys:user:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      class="toolbar"
      style="float: right; padding-top: 10px; padding-right: 15px"
    >
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button
                icon="fa fa-refresh"
                @click="findPage(null)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button
                icon="fa fa-filter"
                @click="displayFilterColumnsDialog"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button
                icon="fa fa-file-excel-o"
                @click="exportUserExcelFile"
              ></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialogRef"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      >
      </table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <kt-table
      permsEdit="sys:user:edit"
      permsDelete="sys:user:delete"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
      v-model:visible="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataFormRef"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptName">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :nodeKey="'' + dataForm.deptId"
            :currentChangeHandle="deptTreeCurrentChangeHandle"
          >
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles" v-if="!operation">
          <el-select
            v-model="dataForm.userRoles"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button :size="size" @click.native="dialogVisible = false"
            >{{ t("action.cancel") }}
          </el-button>
          <el-button
            :size="size"
            type="primary"
            @click.native="submitForm"
            :loading="editLoading"
          >
            {{ t("action.submit") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import PopupTreeInput from "@/components/PopupTreeInput/index.vue";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import {inject, onMounted, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";

const api = inject('api')
const { t } = useI18n();
const dataFormRef = ref<FormInstance>();
const tableColumnFilterDialogRef = ref();

let size = ref("small");
let filters = reactive({
  name: "",
});
let columns = reactive<any[]>([]);
let filterColumns = reactive([]);
let pageRequest = reactive<{
  pageNum: number;
  pageSize: number;
  params: any[];
}>({ pageNum: 1, pageSize: 8, params: [] });
let pageResult = reactive({});

let operation = ref(false); // true:新增, false:编辑
let dialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let dataFormRules = {
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
};
// 新增编辑界面数据
let dataForm = reactive<{
  id: number;
  name: string;
  nickName: string;
  password: string;
  deptId: number;
  deptName: string;
  email: string;
  mobile: string;
  status: number;
  userRoles: any[];
}>({
  id: 0,
  name: "",
  nickName: "",
  password: "123456",
  deptId: 1,
  deptName: "",
  email: "test@qq.com",
  mobile: "13889700023",
  status: 1,
  userRoles: [],
});
let deptData = reactive([]);
let deptTreeProps = reactive({
  label: "name",
  children: "children",
});
let roles = reactive<
  {
    id: number;
    remark?: string;
  }[]
>([
  {
    id: 0,
  },
]);

// 获取分页数据
function findPage(data: any) {
  if (data !== null) {
    pageRequest = data.pageRequest;
  }
  pageRequest.params = [{ name: "name", value: this.filters.name }];
  api.user
    .findPage(pageRequest)
    .then((res: any) => {
      pageResult = res.data;
      findUserRoles();
    })
    .then(data != null ? data.callback : "");
}

// 导出Excel用户信息
function exportUserExcelFile() {
  pageRequest.pageSize = 100000;
  pageRequest.params = [{ name: "name", value: filters.name }];
  api.user.exportUserExcelFile(pageRequest).then((res: any) => {
    ElMessageBox.alert(res.data, "导出成功", {
      confirmButtonText: "确定",
      callback: () => {},
    });
  });
}

// 加载用户角色信息
function findUserRoles() {
  api.role.findAll().then((res: any) => {
    // 加载角色集合
    roles = res.data;
  });
}

// 批量删除
function handleDelete(data: any) {
  api.user.batchDelete(data.params).then(data ? data.callback : "");
}

// 显示新增界面
function handleAdd() {
  dialogVisible.value = true;
  operation.value = true;
  dataForm = {
    id: 0,
    name: "",
    password: "",
    deptId: 1,
    deptName: "",
    email: "test@qq.com",
    mobile: "13889700023",
    status: 1,
    userRoles: [],
  };
}

// 显示编辑界面
function handleEdit(params: unknown) {
  dialogVisible.value = true;
  operation.value = false;
  dataForm = Object.assign({}, params.row);
  let userRoles = [];
  for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
    userRoles.push(params.row.userRoles[i].roleId);
  }
  dataForm.userRoles = userRoles;
}

// 编辑
function submitForm() {
  dataFormRef.value?.validate((valid: any) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        editLoading.value = true;
        let params = Object.assign({}, dataForm);
        let userRoles = [];
        for (let i = 0, len = params.userRoles.length; i < len; i++) {
          let userRole = {
            userId: params.id,
            roleId: params.userRoles[i],
          };
          userRoles.push(userRole);
        }
        params.userRoles = userRoles;
        api.user.save(params).then((res: any) => {
          editLoading.value = false;
          if (res.code == 200) {
            ElMessage({ message: "操作成功", type: "success" });
            dialogVisible.value = false;
            dataFormRef.value?.resetFields();
          } else {
            ElMessage({ message: "操作失败, " + res.msg, type: "error" });
          }
          findPage(null);
        });
      });
    }
  });
}

// 获取部门列表
function findDeptTree() {
  api.dept.findDeptTree().then((res: any) => {
    deptData = res.data;
  });
}

// 菜单树选中
function deptTreeCurrentChangeHandle(data) {
  dataForm.deptId = data.id;
  dataForm.deptName = data.name;
}

// 时间格式化
function dateFormat(row, column, cellValue, index) {
  return format(row[column.property]);
}

// 处理表格列过滤显示
function displayFilterColumnsDialog() {
  tableColumnFilterDialogRef.value?.setDialogVisible(true);
}

// 处理表格列过滤显示
function handleFilterColumns(data: unknown) {
  filterColumns = data.filterColumns;
  tableColumnFilterDialogRef.value?.setDialogVisible(false);
}

// 处理表格列过滤显示
function initColumns() {
  columns = [
    { prop: "id", label: "ID", minWidth: 50 },
    { prop: "name", label: "用户名", minWidth: 120 },
    { prop: "nickName", label: "昵称", minWidth: 120 },
    { prop: "deptName", label: "机构", minWidth: 120 },
    { prop: "roleNames", label: "角色", minWidth: 100 },
    { prop: "email", label: "邮箱", minWidth: 120 },
    { prop: "mobile", label: "手机", minWidth: 100 },
    { prop: "status", label: "状态", minWidth: 70 },
    // {prop:"createBy", label:"创建人", minWidth:120},
    // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
    // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
    // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
  ];
  filterColumns = JSON.parse(JSON.stringify(columns));
}

onMounted(() => {
  findDeptTree();
  initColumns();
});
</script>

<style scoped></style>
