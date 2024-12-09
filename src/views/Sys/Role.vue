<template>
  <div class="page-container">
    <!--工具栏-->
    <div>
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
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
            perms="sys:role:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      permsEdit="sys:role:edit"
      permsDelete="sys:role:delete"
      :highlightCurrentRow="true"
      :stripe="false"
      :data="pageResult"
      :columns="columns"
      :showBatchDelete="false"
      @handleCurrentChange="handleRoleSelectChange"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </kt-table>
    <!-- </el-col> -->
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
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 " prop="remark">
          <el-input
            v-model="dataForm.remark"
            auto-complete="off"
            type="textarea"
          ></el-input>
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
    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span><B>角色菜单授权</B></span>
      </div>
      <el-tree
        :data="menuData"
        size="small"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        style="width: 100%; pading-top: 20px"
        ref="menuTreeRef"
        :render-content="renderContent"
        v-loading="menuLoading"
        element-loading-text="拼命加载中"
        :check-strictly="true"
        @check-change="handleMenuCheckChange"
      >
      </el-tree>
      <div
        style="
          float: left;
          padding-left: 24px;
          padding-top: 12px;
          padding-bottom: 4px;
        "
      >
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
          :disabled="this.selectRole.id == null"
          ><b>全选</b>
        </el-checkbox>
      </div>
      <div
        style="
          float: right;
          padding-right: 15px;
          padding-top: 4px;
          padding-bottom: 4px;
        "
      >
        <kt-button
          :label="t('action.reset')"
          perms="sys:role:edit"
          type="primary"
          @click="resetSelection"
          :disabled="this.selectRole.id == null"
        />
        <kt-button
          :label="t('action.submit')"
          perms="sys:role:edit"
          type="primary"
          @click="submitAuthForm"
          :disabled="this.selectRole.id == null"
          :loading="authLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import { format } from "@/utils/datetime";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import { inject, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const api = inject("api");
const { t } = useI18n();

interface Tree {
  icon: string;
  name: string;
  url: string;
  parentName: string;
  type: number;
}

const menuTreeRef = ref();
const dataFormRef = ref<FormInstance>();

let size = ref("small");
let filters = reactive({
  name: "",
});
let columns = reactive([
  { prop: "id", label: "ID", minWidth: 50 },
  { prop: "name", label: "角色名", minWidth: 120 },
  { prop: "remark", label: "备注", minWidth: 120 },
  { prop: "createBy", label: "创建人", minWidth: 120 },
  {
    prop: "createTime",
    label: "创建时间",
    minWidth: 120,
    formatter: dateFormat,
  },
  // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
  // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
]);
let pageRequest = reactive<{
  pageNum: number;
  pageSize: number;
  params: any[];
}>({ pageNum: 1, pageSize: 10, params: [] });
let pageResult = reactive({});
let operation = ref(false); // true:新增, false:编辑
let dialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let dataFormRules = {
  name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
};
// 新增编辑界面数据
let dataForm = reactive({
  id: 0,
  name: "",
  remark: "",
});
let selectRole = reactive<any>({});
let menuData = reactive([]);
let menuSelections = reactive([]);
let menuLoading = ref(false);
let authLoading = ref(false);
let checkAll = ref(false);
let currentRoleMenus = ref([]);
let defaultProps = reactive({
  children: "children",
  label: "name",
});

// 获取分页数据
function findPage(data: any) {
  if (data !== null) {
    pageRequest = data.pageRequest;
  }
  pageRequest.params = [{ name: "name", value: filters.name }];
  api.role
    .findPage(pageRequest)
    .then((res: any) => {
      pageResult = res.data;
      findTreeData();
    })
    .then(data != null ? data.callback : "");
}

// 批量删除
function handleDelete(data: any) {
  api.role.batchDelete(data.params).then(data.callback);
}

// 显示新增界面
function handleAdd() {
  dialogVisible.value = true;
  operation.value = true;
  dataForm = {
    id: 0,
    name: "",
    remark: "",
  };
}

// 显示编辑界面
function handleEdit(params: any) {
  dialogVisible.value = true;
  operation.value = false;
  dataForm = Object.assign({}, params.row);
}

// 编辑
function submitForm() {
  dataFormRef.value?.validate((valid: any) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        editLoading.value = true;
        let params = Object.assign({}, dataForm);
        api.role.save(params).then((res: any) => {
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

// 获取数据
function findTreeData() {
  menuLoading.value = true;
  api.menu.findMenuTree().then((res: any) => {
    menuData = res.data;
    menuLoading.value = false;
  });
}

// 角色选择改变监听
function handleRoleSelectChange(val: any) {
  if (val == null || val.val == null) {
    return;
  }
  selectRole = val.val;
  api.role.findRoleMenus({ roleId: val.val.id }).then((res: any) => {
    currentRoleMenus.value = res.data;
    menuTreeRef.value?.setCheckedNodes(res.data);
  });
}

// 树节点选择监听
function handleMenuCheckChange(data, check, subCheck) {
  if (check) {
    // 节点选中时同步选中父节点
    let parentId = data.parentId;
    menuTreeRef.value?.setChecked(parentId, true, false);
  } else {
    // 节点取消选中时同步取消选中子节点
    if (data.children != null) {
      data.children.forEach((element: any) => {
        menuTreeRef.value?.setChecked(element.id, false, false);
      });
    }
  }
}

// 重置选择
function resetSelection() {
  checkAll.value = false;
  menuTreeRef.value?.setCheckedNodes(currentRoleMenus);
}

// 全选操作
function handleCheckAll() {
  if (checkAll.value) {
    let allMenus: any[] = [];
    checkAllMenu(menuData, allMenus);
    menuTreeRef.value?.setCheckedNodes(allMenus);
  } else {
    menuTreeRef.value?.setCheckedNodes([]);
  }
}

// 递归全选
function checkAllMenu(menuData: any, allMenus: any) {
  menuData.forEach((menu: any) => {
    allMenus.push(menu);
    if (menu.children) {
      checkAllMenu(menu.children, allMenus);
    }
  });
}

// 角色菜单授权提交
function submitAuthForm() {
  let roleId = selectRole.id;
  if ("admin" == selectRole.name) {
    ElMessage({
      message: "超级管理员拥有所有菜单权限，不允许修改！",
      type: "error",
    });
    return;
  }
  authLoading.value = true;
  let checkedNodes = menuTreeRef.value?.getCheckedNodes(false, true);
  let roleMenus = [];
  for (let i = 0, len = checkedNodes.length; i < len; i++) {
    let roleMenu = { roleId: roleId, menuId: checkedNodes[i].id };
    roleMenus.push(roleMenu);
  }
  api.role.saveRoleMenus(roleMenus).then((res: any) => {
    if (res.code == 200) {
      ElMessage({ message: "操作成功", type: "success" });
    } else {
      ElMessage({ message: "操作失败, " + res.msg, type: "error" });
    }
    authLoading.value = false;
  });
}

const renderContent = (
  h: any,
  { node, data, store }: { node: Node; data: Tree; store: Node["store"] },
) => {
  h(
    "div",
    { class: "column-container" },
    h(
      "span",
      { class: "column" },
      { style: { textAlign: "center", marginRight: "80px" } },
      data.name,
    ),
    h(
      "span",
      { class: "column" },
      { style: { textAlign: "center", marginRight: "80px" } },
      h(
        "el-tag",
        {
          type: data.type === 0 ? "" : data.type === 1 ? "success" : "info",
        },
        { size: "small" },
        data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮",
      ),
    ),
    h(
      "span",
      { class: "column" },
      { style: { textAlign: "center", marginRight: "80px" } },
      h("i", {
        class: data.icon,
      }),
    ),
    h(
      "span",
      { class: "column" },
      { style: { textAlign: "center", marginRight: "80px" } },
      data.parentName ? data.parentName : "顶级菜单",
    ),
    h(
      "span",
      { class: "column" },
      { style: { textAlign: "center", marginRight: "80px" } },
      data.url ? data.url : "\t",
    ),
  );
};

// 时间格式化
// function dateFormat (row, column, cellValue, index) {
//   return format(row[column.property])
// }
function dateFormat(val: string) {
  return format(val);
}
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}

.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>
