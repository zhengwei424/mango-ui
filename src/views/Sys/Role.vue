<template>
  <div class="page-container">
    <!--工具栏-->
    <div>
      <el-form :inline="true" :model="filters" size="small">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
              icon="fa fa-search"
              :label="t('action.search')"
              perms="sys:role:view"
              type="primary"
              @click="findPage({})"
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
        :loading="loading"
        :stripe="false"
        :data="pageResult"
        :columns="columns"
        :showBatchDelete="false"
        @handle-current-change="handleRoleSelectChange"
        @find-page="findPage"
        @handle-edit="handleEdit"
        @handle-delete="handleDelete"
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
          size="small"
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
          <el-button size="small" @click.native="dialogVisible = false"
          >{{ t("action.cancel") }}
          </el-button>
          <el-button
              size="small"
              type="primary"
              @click.native="submitForm"
              :loading="editLoading"
          >
            {{ t("action.submit") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
<!--        &lt;!&ndash;角色菜单，表格树内容栏&ndash;&gt;-->
<!--        <div class="menu-container" v-if="true">-->
<!--          <div class="menu-header">-->
<!--            <span><B>角色菜单授权</B></span>-->
<!--          </div>-->
<!--          <el-tree-->
<!--            :data="menuData"-->
<!--            size="small"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            :props="defaultProps"-->
<!--            style="width: 100%; pading-top: 20px"-->
<!--            ref="menuTreeRef"-->
<!--            :render-content="renderContent"-->
<!--            v-loading="menuLoading"-->
<!--            element-loading-text="拼命加载中"-->
<!--            :check-strictly="true"-->
<!--            @check-change="handleMenuCheckChange"-->
<!--          >-->
<!--          </el-tree>-->
<!--          <div-->
<!--            style="-->
<!--              float: left;-->
<!--              padding-left: 24px;-->
<!--              padding-top: 12px;-->
<!--              padding-bottom: 4px;-->
<!--            "-->
<!--          >-->
<!--            <el-checkbox-->
<!--              v-model="checkAll"-->
<!--              @change="handleCheckAll"-->
<!--              :disabled="this.selectRole.id == null"-->
<!--              ><b>全选</b>-->
<!--            </el-checkbox>-->
<!--          </div>-->
<!--          <div-->
<!--            style="-->
<!--              float: right;-->
<!--              padding-right: 15px;-->
<!--              padding-top: 4px;-->
<!--              padding-bottom: 4px;-->
<!--            "-->
<!--          >-->
<!--            <kt-button-->
<!--              :label="t('action.reset')"-->
<!--              perms="sys:role:edit"-->
<!--              type="primary"-->
<!--              @click="resetSelection"-->
<!--              :disabled="this.selectRole.id == null"-->
<!--            />-->
<!--            <kt-button-->
<!--              :label="t('action.submit')"-->
<!--              perms="sys:role:edit"-->
<!--              type="primary"-->
<!--              @click="submitAuthForm"-->
<!--              :disabled="this.selectRole.id == null"-->
<!--              :loading="authLoading"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
  </div>
</template>

<script setup lang="ts">
import {IPageRequest} from "@/interface/pageRequest.ts";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import {format} from "@/utils/datetime";
import {ElMessage, ElMessageBox, FormInstance} from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import {inject, onMounted, provide, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {createIRole, IRole} from "@/interface/role.ts";

const api = inject("api");
const {t} = useI18n();

interface Tree {
  icon: string;
  name: string;
  url: string;
  parentName: string;
  type: number;
}

const menuTreeRef = ref();
const dataFormRef = ref<FormInstance>();

let filters = reactive({
  name: "",
});
let columns = ref([
  {prop: "id", label: "ID", minWidth: 50},
  {prop: "name", label: "角色名", minWidth: 120},
  {prop: "remark", label: "备注", minWidth: 120},
  {prop: "createBy", label: "创建人", minWidth: 120},
  {
    prop: "createTime",
    label: "创建时间",
    minWidth: 120,
    formatter: dateFormat,
  },
  // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
  // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
]);
let pageRequest = reactive<IPageRequest>({
  pageNum: 1,
  pageSize: 10,
  params: {name: ""},
});
let pageResult = reactive<any>({});
let operation = ref(false); // true:新增, false:编辑
let dialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let dataFormRules = {
  name: [{required: true, message: "请输入角色名", trigger: "blur"}],
};
// 新增编辑界面数据
let dataForm: IRole = reactive<IRole>({});
let selectRole = reactive<any>({});
let menuData = ref([]);
let menuSelections = ref([]);
let menuLoading = ref(false);
let authLoading = ref(false);
let checkAll = ref(false);
let currentRoleMenus = ref([]);
let defaultProps = reactive<any>({
  children: "children",
  label: "name",
});

let loading = ref(true);
provide('loading', loading);

// 获取分页数据
function findPage(val: IPageRequest) {
  // pageRequest.params = [{name: "name", value: filters.name}];
  if (val) {
    Object.assign(pageRequest, val);
  }
  pageRequest.params = {name: filters.name};
  api.role
      .findPage(pageRequest)
      .then((res: any) => {
        Object.assign(pageResult, res.data);
        findTreeData();
      })
      .then(() => {
        loading.value = false;
      });
}

// 删除
function handleDelete(row: any) {
  let params = []
  params.push(row)
  handleDeleteRecord(params)
}

// 删除的实际动作
function handleDeleteRecord(params: any[]) {
  ElMessageBox.confirm!("确认删除选中记录吗？", "提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    api.role.batchDelete(params).then((res) => {
      if (res.code === 200) {
        ElMessage({message: '删除成功', type: "success"});
        findPage({});
      } else {
        ElMessage({message: '删除失败, ' + res.msg, type: "success"});
      }
    });
  })
}

// 显示新增界面
function handleAdd() {
  dialogVisible.value = true;
  operation.value = true;
  Object.assign(dataForm, createIRole());
}

// 显示编辑界面
function handleEdit(row: IRole) {
  dialogVisible.value = true;
  operation.value = false;
  row.lastUpdateBy = sessionStorage.getItem("user");
  row.lastUpdateTime = new Date().toISOString();
  Object.assign(dataForm, row);
}

// 编辑
function submitForm() {
  dataFormRef.value?.validate((valid: any) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        editLoading.value = true;
        let params: any = dataForm;
        api.role.save(params).then((res: any) => {
          editLoading.value = false;
          if (res.code == 200) {
            ElMessage({message: "操作成功", type: "success"});
            dialogVisible.value = false;
          } else {
            ElMessage({message: "操作失败, " + res.msg, type: "error"});
          }
          findPage(pageRequest);
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
  api.role.findRoleMenus({roleId: val.val.id}).then((res: any) => {
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
    let roleMenu = {roleId: roleId, menuId: checkedNodes[i].id};
    roleMenus.push(roleMenu);
  }
  api.role.saveRoleMenus(roleMenus).then((res: any) => {
    if (res.code == 200) {
      ElMessage({message: "操作成功", type: "success"});
    } else {
      ElMessage({message: "操作失败, " + res.msg, type: "error"});
    }
    authLoading.value = false;
  });
}

const renderContent = (
    h: any,
    {node, data, store}: { node: Node; data: Tree; store: Node["store"] },
) => {
  h(
      "div",
      {class: "column-container"},
      h(
          "span",
          {class: "column"},
          {style: {textAlign: "center", marginRight: "80px"}},
          data.name,
      ),
      h(
          "span",
          {class: "column"},
          {style: {textAlign: "center", marginRight: "80px"}},
          h(
              "el-tag",
              {
                type: data.type === 0 ? "" : data.type === 1 ? "success" : "info",
              },
              {size: "small"},
              data.type === 0 ? "目录" : data.type === 1 ? "菜单" : "按钮",
          ),
      ),
      h(
          "span",
          {class: "column"},
          {style: {textAlign: "center", marginRight: "80px"}},
          h("i", {
            class: data.icon,
          }),
      ),
      h(
          "span",
          {class: "column"},
          {style: {textAlign: "center", marginRight: "80px"}},
          data.parentName ? data.parentName : "顶级菜单",
      ),
      h(
          "span",
          {class: "column"},
          {style: {textAlign: "center", marginRight: "80px"}},
          data.url ? data.url : "\t",
      ),
  );
};

// 时间格式化
// function dateFormat (row, column, cellValue, index) {
//   return format(row[column.property])
// }
function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

onMounted(async () => {
  await findPage({});
});
</script>
<style scoped>
.page-container {
  height: 100%;
  width: 100%;
}
</style>
