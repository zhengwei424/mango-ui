<template>
  <div class="page-container">
    <!-----------------------工具栏-------------------------->
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
                <el-button @click="findPage({})">
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
        <!--------------------------表格显示列界面--------------------------->
        <table-column-filter-dialog
            ref="tableColumnFilterDialogRef"
            :columns="columns"
            @handleFilterColumns="handleFilterColumns"
        >
        </table-column-filter-dialog>
      </div>
    </div>

    <!-----------------------------------表格内容栏----------------------------------->
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
    <!-----------------------新增编辑界面----------------------->
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
          <tree-select
              :data="deptData"
              :props="deptTreeProps"
              :prop="dataForm.deptName"
              :nodeKey="'' + dataForm.deptId"
              @currentChangeHandle="deptTreeCurrentChangeHandle"
          ></tree-select>
          <!--          <popover-tree-input-->
          <!--              :data="deptData"-->
          <!--              :props="deptTreeProps"-->
          <!--              :prop="dataForm.deptName"-->
          <!--              :nodeKey="'' + dataForm.deptId"-->
          <!--              @currentChangeHandle="deptTreeCurrentChangeHandle"-->
          <!--          >-->
          <!--          </popover-tree-input>-->
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <!------------------------- 编辑时展示 ----------------------------------->
        <el-form-item label="角色" prop="userRoles" v-if="!operation">
          <!-- el-select v-model -->
          <el-select
              v-model="selectedRoles"
              multiple
              placeholder="请选择"
              style="width: 426px"
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
import TreeSelect from "@/components/TreeSelect/index.vue";
import {IPageRequest} from "@/interface/pageRequest.ts";
import {IRole} from "@/interface/role.ts";
import {IUserRoleManagement} from "@/interface/user.ts";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog.vue";
import {format} from "@/utils/datetime";
import {ElMessage, ElMessageBox, FormInstance} from "element-plus";
import {inject, onBeforeMount, onMounted, provide, reactive, ref, toRef} from "vue";
import {useI18n} from "vue-i18n";

const api = inject("api");
const {t} = useI18n();

// 组件的ref 用于调用组件暴露的属性和方法
let dataFormRef = ref<FormInstance>();
let tableColumnFilterDialogRef = ref();

// kt-table 启用加载动画
let loading = ref(true)
provide('loading', loading);

let size = ref<any>("small");
let operation = ref<boolean>(false); // true:新增, false:编辑
let dialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let dataFormRules = {
  name: [{required: true, message: "请输入用户名", trigger: "blur"}],
};

let columns = reactive<any[]>([]);
let filterColumns = reactive([]);
let pageRequest = reactive<IPageRequest>({
  pageNum: 1,
  pageSize: 10,
  params: {
    name: '',
    email: ''
  },
});
// /user/findPage返回结果
let pageResult = reactive<any>({});
// /role/findAll查询结果
let roles = reactive<IRole[]>([]);

// 工具栏过滤用户名
let filters = reactive({
  name: "",
});

// 新增编辑界面数据
let dataForm = reactive<IUserRoleManagement>({});
let selectedRoles = ref([]); // 角色el-tree el-option需要用ref调用组件方法
let deptData = reactive([]);
let deptTreeProps = reactive<any>({
  label: "name",
  children: "children",
});

// 获取分页数据
function findPage(val: IPageRequest) {
  // TODO: pageNum 和 pageSize请求值优化
  if (val) {
    Object.assign(pageRequest, val);
  }
  pageRequest.params = {name: filters.name, email: ""};
  api.user.findPage(pageRequest).then((res: any) => {
    Object.assign(pageResult, res.data);
  }).then(() => {
    loading.value = false;
  });
}

// 导出Excel用户信息
function exportUserExcelFile() {
  // TODO: 导出所有 如何优化
  pageRequest.pageSize = 100000;
  pageRequest.params = {name: filters.name};
  api.user.exportUserExcelFile(pageRequest).then((res: any) => {
    ElMessageBox.alert(res.data, "导出成功", {
      confirmButtonText: "确定",
      callback: () => {
      },
    });
  });
}

// 获取所有角色信息列表，供编辑时筛选
function findUserRoles() {
  api.role.findAll().then((res: any) => {
    Object.assign(roles, res.data);
  });
}

// 批量删除
function handleDelete(data: any) {
  api.user
      .batchDelete(data.params)
      .then(data ? data.callback : '');
}

// 显示新增界面
function handleAdd() {
  // dataForm初始化
  Object.assign(dataForm, {});

  dialogVisible.value = true;
  operation.value = true;
  findDeptTree();
}

// 显示编辑界面
function handleEdit(currentRow: any) {
  // dataForm初始化
  Object.assign(dataForm, {});

  dialogVisible.value = true;
  operation.value = false;

  // 从数据库中查询到所有角色信息
  findUserRoles();

  // 展示当前用户的角色信息到编辑界面
  let tmp = [];
  Object.assign(dataForm, currentRow);
  for (let i = 0, len = currentRow.userRoles.length; i < len; i++) {
    // TODO: 有时候只出现角色id，不显示角色标签 (v-loading???)
    tmp.push(currentRow.userRoles[i].roleId);
  }
  selectedRoles.value = tmp;
}

// 编辑 -> 提交
function submitForm() {
  dataFormRef.value?.validate((valid: any) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        editLoading.value = true;
        let params = dataForm;
        let tmp = [];
        for (let i = 0, len = selectedRoles.value.length; i < len; i++) {
          let userRole = {
            userId: params.id,
            roleId: selectedRoles.value[i],
          };
          tmp.push(userRole);
        }
        Object.assign(params.userRoles, tmp);
        api.user.save(params).then((res: any) => {
          editLoading.value = false;
          if (res.code == 200) {
            ElMessage({message: "操作成功", type: "success"});
            dialogVisible.value = false;
            dataFormRef.value?.resetFields();
          } else {
            ElMessage({message: "操作失败, " + res.msg, type: "error"});
          }
          findPage(pageRequest);
        });
      });
    }
  });
}

// 获取部门列表
function findDeptTree() {
  api.dept.findDeptTree().then((res: any) => {
    Object.assign(deptData, res.data);
  });
}

// 菜单树选中
// TODO: handleEdit 和 handleAdd清空dataForm无效
function deptTreeCurrentChangeHandle(data) {
  dataForm.deptId = data.id;
  dataForm.deptName = data.name;
}

function handNodeClick(data: any) {
  console.log("当前机构：", data);
}

// // 处理表格列过滤显示
// function displayFilterColumnsDialog() {
//   tableColumnFilterDialogRef.value?.setDialogVisible(true);
// }
//
// // 处理表格列过滤显示
// function handleFilterColumns(data: unknown) {
//   filterColumns = data.filterColumns;
//   tableColumnFilterDialogRef.value?.setDialogVisible(false);
// }

// 设置列标题
function initColumns() {
  columns = [
    {prop: "id", label: "ID", minWidth: 50},
    {prop: "name", label: "用户名", minWidth: 120},
    {prop: "nickName", label: "昵称", minWidth: 120},
    {prop: "deptName", label: "机构", minWidth: 120},
    {prop: "roleNames", label: "角色", minWidth: 100},
    {prop: "email", label: "邮箱", minWidth: 120},
    {prop: "mobile", label: "手机", minWidth: 100},
    {prop: "status", label: "状态", minWidth: 70},
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

// 初始化列标题
initColumns();

function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}


onMounted(async () => {
  await findDeptTree();
  await findPage({});
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
