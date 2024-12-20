<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar">
      <el-form :inline="true" :model="filters" :size="size">
        <!--        <el-form-item>-->
        <!--          <el-input v-model="filters.name" placeholder="名称"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <kt-button-->
        <!--            icon="fa fa-search"-->
        <!--            :label="t('action.search')"-->
        <!--            perms="sys:dept:view"-->
        <!--            type="primary"-->
        <!--            @click="findTreeData()"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="t('action.add')"
            perms="sys:dept:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
    <el-table
      :data="tableTreeData"
      stripe
      size="small"
      style="width: 100%"
      v-loading="loading"
      rowKey="id"
      element-loading-text="t('action.loading')"
    >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级机构"
      >
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序"
      >
      </el-table-column>
      <el-table-column
        prop="createBy"
        header-align="center"
        align="center"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column align="center" :label="t('action.operation')">
        <template #default="scope">
          <kt-button
            icon="fa fa-edit"
            :label="t('action.edit')"
            perms="sys:dept:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            :label="t('action.delete')"
            perms="sys:dept:delete"
            type="danger"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      width="40%"
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataFormRef"
        @keyup.enter.native="submitForm()"
        label-width="80px"
        :size="size"
        style="text-align: left"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentName">
          <tree-select
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="
              dataForm.parentName == null ? '顶级菜单' : dataForm.parentName
            "
            :nodeKey="'' + dataForm.parentId"
            @currentChangeHandle="handleTreeSelectChange"
          ></tree-select>
        </el-form-item>
        <el-form-item v-if="dataForm.id !== 2" label="排序编号" prop="orderNum">
          <el-input-number
            v-model="dataForm.orderNum"
            controls-position="right"
            :min="0"
            label="排序编号"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button :size="size" @click="dialogVisible = false">{{
            t("action.cancel")
          }}</el-button>
          <el-button :size="size" type="primary" @click="submitForm()">{{
            t("action.confirm")
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { createIDept, IDept } from "@/interface/dept.ts";
import KtButton from "@/views/Core/KtButton.vue";
import TreeSelect from "@/components/TreeSelect/index.vue";
import PopoverTreeInput from "@/components/PopupTreeInput/index.vue";
import { format } from "@/utils/datetime";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { inject, onMounted, provide, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const api = inject("api");
const dataFormRef = ref<FormInstance>();
const { t } = useI18n();
let size = ref<any>("small");

let loading = ref(false);

let filters = reactive({
  name: "",
});
let tableTreeData = ref<IDept[]>([]);
let dialogVisible = ref(false);
let dataForm = reactive<IDept>({});
let dataRule = {
  name: [{ required: true, message: "机构名称不能为空", trigger: "blur" }],
  parentName: [
    { required: true, message: "上级机构不能为空", trigger: "blur" },
  ],
};
let popupTreeData = ref<any[]>([]);
let popupTreeProps = reactive({
  label: "name",
  children: "children",
});

// 获取数据
function findTreeData() {
  loading.value = true;
  api.dept.findDeptTree().then((res: any) => {
    tableTreeData.value = res.data;
    popupTreeData.value = getParentMenuTree(res.data);
    loading.value = false;
  });
}

// 获取上级机构树
function getParentMenuTree(tableTreeData: any) {
  let parent = {
    parentId: 0,
    name: "顶级菜单",
    children: tableTreeData,
  };
  return [parent];
}

// 显示新增界面
function handleAdd() {
  dialogVisible.value = true;
  Object.assign(dataForm, createIDept());
}

// 显示编辑界面
function handleEdit(row: any) {
  dialogVisible.value = true;
  Object.assign(dataForm, row);
}

// 删除
function handleDelete(row: any) {
  ElMessageBox.confirm!("确认删除选中记录吗？", "提示", {
    type: "warning",
  }).then(() => {
    let params = getDeleteIds([], row);
    api.dept.batchDelete(params).then(() => {
      findTreeData();
      ElMessage({ message: "删除成功", type: "success" });
    });
  });
}

// 获取删除的包含子机构的id列表
function getDeleteIds(ids: any, row: any) {
  ids.push({ id: row.id });
  if (row.children != null) {
    for (let i = 0, len = row.children.length; i < len; i++) {
      getDeleteIds(ids, row.children[i]);
    }
  }
  return ids;
}

// 机构树选中
function handleTreeSelectChange(data: any) {
  console.log("机构选择：", data);
  dataForm.parentId = data.id;
  dataForm.parentName = data.name;
}

// 表单提交
function submitForm() {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        loading.value = true;
        let params: any = dataForm;
        console.log("params:", params);
        api.dept.save(params).then((res: any) => {
          loading.value = false;
          if (res.code == 200) {
            ElMessage({ message: "操作成功", type: "success" });
            dialogVisible.value = false;
            dataFormRef.value?.resetFields();
          } else {
            ElMessage({
              message: "操作失败, " + res.msg,
              type: "error",
            });
          }
          findTreeData();
        });
      });
    }
  });
}

// 时间格式化
function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

onMounted(() => {
  findTreeData();
});
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
}
</style>
