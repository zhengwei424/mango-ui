<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar">
      <div>
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
              @click="findPage"
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
      <div>
        <el-form :inline="true" :size="size">
          <el-form-item>
            <el-button-group>
              <el-tooltip content="刷新" placement="top">
                <el-button @click="findPage(null)">
                  <template #icon>
                    <i class="fa fa-refresh"></i>
                  </template>
                </el-button>
              </el-tooltip>
              <el-tooltip content="列显示" placement="top">
                <el-button @click="displayFilterColumnsDialog">
                  <template #icon>
                    <i class="fa fa-filter"></i>
                  </template>
                </el-button>
              </el-tooltip>
              <el-tooltip content="导出" placement="top">
                <el-button @click="exportUserExcelFile">
                  <template #icon>
                    <i class="fa fa-file-excel-o"></i>
                  </template>
                </el-button>
              </el-tooltip>
            </el-button-group>
          </el-form-item>
        </el-form>
        <!--表格显示列界面-->
        <table-column-filter-dialog
          :columns="columns"
          @handleFilterColumns="handleFilterColumns"
        >
        </table-column-filter-dialog>
      </div>
    </div>

    <!--表格内容栏-->
    <kt-table
      permsEdit="sys:user:edit"
      permsDelete="sys:user:delete"
      :loading="loading"
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
      v-model="dialogVisible"
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
          <popover-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :nodeKey="'' + dataForm.deptId"
            @currentChangeHandle="deptTreeCurrentChangeHandle"
          >
          </popover-tree-input>
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
import PopoverTreeInput from "@/components/PopupTreeInput/index.vue";
import { IPageRequest } from "@/interface/pageRequest.ts";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog.vue";
import { format } from "@/utils/datetime";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { inject, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const api = inject("api");
const { t } = useI18n();

// /user/findPage返回结果
let pageResult = reactive<any>({});

// /role/findAll查询结果
let roles = reactive<
  {
    id: number;
    createBy: string;
    createTime: string;
    lastUpdateBy: string;
    lastUpdateTime: string;
    name: string;
    remark: string;
    delFlag: number;
  }[]
>([
  {
    id: 1,
    createBy: "admin",
    createTime: "2019-01-19T17:11:11.000+0000",
    lastUpdateBy: "admin",
    lastUpdateTime: "2019-01-20T01:07:18.000+0000",
    name: "admin",
    remark: "超级管理员",
    delFlag: 0,
  },
]);

// 工具栏过滤用户名
let filters = reactive({
  name: "",
});

let dataFormRef = ref<FormInstance>();
let tableColumnFilterDialogRef = ref();

let disabled = ref(true);
let size = ref<"large" | "default" | "small">("small");

let columns = reactive<any[]>([]);
let filterColumns = reactive([]);
let pageRequest = reactive<IPageRequest>({
  pageNum: 1,
  pageSize: 8,
  params: {},
});

let operation = ref<boolean>(false); // true:新增, false:编辑
let dialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let loading = true;
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

// 获取分页数据
function findPage(pageRequest: IPageRequest) {
  pageRequest.params = { name: filters.name, email: "" };
  api.user.findPage(pageRequest).then((res: any) => {
    pageResult = Object.assign(pageResult, res.data);
    findUserRoles(); // 有啥用???????????
    loading = false;
  });
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
    deptData = Object.assign(deptData, res.data);
  });
}

// 菜单树选中
function deptTreeCurrentChangeHandle(data) {
  dataForm.deptId = data.id;
  dataForm.deptName = data.name;
  console.log(dataForm);
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

// 设置列标题
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
    // { prop: "createBy", label: "创建人", minWidth: 120 },
    // {
    //   prop: "createTime",
    //   label: "创建时间",
    //   minWidth: 120,
    //   formatter: dateFormat,
    // },
    // { prop: "lastUpdateBy", label: "更新人", minWidth: 100 },
    // {
    //   prop: "lastUpdateTime",
    //   label: "更新时间",
    //   minWidth: 120,
    //   formatter: dateFormat,
    // },
  ];
  filterColumns = JSON.parse(JSON.stringify(columns));
}

function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

onMounted(async () => {
  await findDeptTree();
  initColumns();
});
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
}
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
