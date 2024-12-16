<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.label" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="t('action.search')"
            perms="sys:dict:view"
            type="primary"
            @click="findPage({})"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="t('action.add')"
            perms="sys:dict:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      permsEdit="sys:dict:edit"
      permsDelete="sys:dict:delete"
      :data="pageResult"
      :columns="columns"
      :loading="loading"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleBatchDelete="handleBatchDelete"
    >
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
      v-model="editDialogVisible"
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
        <el-form-item label="名称" prop="label">
          <el-input v-model="dataForm.label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="dataForm.value" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="dataForm.type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述 " prop="description">
          <el-input
            v-model="dataForm.description"
            auto-complete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="dataForm.remarks"
            auto-complete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button :size="size" @click.native="editDialogVisible = false"
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
import { IPageRequest } from "@/interface/pageRequest.ts";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import { format } from "@/utils/datetime";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import {inject, onMounted, provide, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";
import {createIDict, IDict} from "@/interface/dict.ts";

const api = inject("api");
const { t } = useI18n();
const dataFormRef = ref<FormInstance>();

let size = ref<any>("small");
let filters = reactive({
  label: "",
});
let columns = ref([
  { prop: "id", label: "ID", minWidth: 50 },
  { prop: "label", label: "名称", minWidth: 100 },
  { prop: "value", label: "值", minWidth: 100 },
  { prop: "type", label: "类型", minWidth: 80 },
  { prop: "sort", label: "排序", minWidth: 80 },
  { prop: "description", label: "描述", minWidth: 120 },
  { prop: "remarks", label: "备注", minWidth: 120 },
  { prop: "createBy", label: "创建人", minWidth: 100 },
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
  params: {},
});
let pageResult = reactive<any>({});

let operation = ref(false); // true:新增, false:编辑
let editDialogVisible = ref(false); // 新增编辑界面是否显示
let editLoading = ref(false);
let dataFormRules = {
  label: [{ required: true, message: "请输入名称", trigger: "blur" }],
  sort: [{ type: 'number', required: true, message: "请输入序号", trigger: "blur" }],
};
// 新增编辑界面数据
let dataForm: IDict = reactive<IDict>({});

let loading = ref(true);
provide('loading', loading)

// 获取分页数据
function findPage(val: IPageRequest) {
  if (val) {
    Object.assign(pageRequest, val);
  }
  pageRequest.params = { label: filters.label };
  api.dict.findPage(pageRequest).then((res: any) => {
    Object.assign(pageResult, res.data);
    loading.value = false;
  });
}

// 删除
function handleDelete(row: any) {
  let params = []
  params.push(row)
  handleDeleteRecord(params)
}

// 批量删除
function handleBatchDelete(rows: any) {
  handleDeleteRecord(rows)
}

// 删除的实际动作
function handleDeleteRecord(params: any[]) {
  ElMessageBox.confirm!("确认删除选中记录吗？", "提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    api.dict.batchDelete(params).then((res) => {
      if (res.code === 200) {
        ElMessage({message: '删除成功', type: "success" });
        findPage({});
      } else {
        ElMessage({message: '删除失败, ' + res.msg, type: "success" });
      }
    });
  })
}

// 显示新增界面
function handleAdd() {
  editDialogVisible.value = true;
  operation.value = true;
  Object.assign(dataForm, createIDict());
}

// 显示编辑界面
function handleEdit(row: any) {
  editDialogVisible.value = true;
  operation.value = false;
  row.lastUpdateBy = sessionStorage.getItem("user");
  row.lastUpdateTime = new Date().toISOString();
  Object.assign(dataForm, row);
}

// 编辑
function submitForm() {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        editLoading.value = true;
        let params: any = dataForm;
        api.dict.save(params).then((res: any) => {
          if (res.code == 200) {
            ElMessage({ message: "操作成功", type: "success" });
          } else {
            ElMessage({ message: "操作失败, " + res.msg, type: "error" });
          }
          editLoading.value = false;
          dataFormRef.value?.resetFields();
          editDialogVisible.value = false;
          findPage({});
        });
      });
    }
  });
}

// 时间格式化
// function dateFormat (row, column, cellValue, index){
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
