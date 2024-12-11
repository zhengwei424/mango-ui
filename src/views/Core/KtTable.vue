<template>
  <div>
    <!--表格栏-->
    <el-table
        :data="data.content"
        :highlight-current-row="highlightCurrentRow"
        @selection-change="selectionChange"
        @current-change="handleCurrentChange"
        v-loading="loading"
        :element-loading-text="t('action.loading')"
        :border="border"
        :stripe="stripe"
        :show-overflow-tooltip="showOverflowTooltip"
        :max-height="maxHeight"
        :size="size"
        :align="align"
        style="width: 100%"
    >
      <el-table-column
          type="selection"
          fixed="left"
          v-if="showBatchDelete && showOperation"
      ></el-table-column>
      <el-table-column
          v-for="column in columns"
          header-align="center"
          align="center"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :key="column.prop"
          :type="column.type"
          :formatter="column.formatter"
          :sortable="column.sortable == null ? true : column.sortable"
      >
      </el-table-column>
      <el-table-column
          :label="t('action.operation')"
          v-if="showOperation"
          header-align="center"
          fixed="right"
          align="center"
          width="185"
      >
        <template #default="scope">
          <kt-button
              icon="fa fa-edit"
              :label="t('action.edit')"
              :perms="permsEdit"
              :size="size"
              @click="handleEdit(scope.$index, scope.row)"
          />
          <kt-button
              icon="fa fa-trash"
              :label="t('action.delete')"
              :perms="permsDelete"
              :size="size"
              type="danger"
              @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div style="padding: 10px">
      <kt-button
          :label="t('action.batchDelete')"
          :perms="permsDelete"
          :size="size"
          type="danger"
          @click="handleBatchDelete()"
          :disabled="selections.length === 0"
          style="float: left"
          v-if="showBatchDelete && showOperation"
      />
      <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="refreshPageRequest"
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          :total="data.totalSize"
          style="float: right"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IPageRequest} from "@/interface/pageRequest.ts";
import {ElMessage, ElMessageBox} from "element-plus";
import KtButton from "./KtButton.vue";
import {onMounted, reactive, ref, defineEmits, toRef} from "vue";
import {useI18n} from "vue-i18n";
import {format} from "@/utils/datetime.ts";

const {t} = useI18n();
/* emit */
const emit = defineEmits([
  "findPage",
  "handleCurrentChange",
  "handleEdit",
  "handleDelete",
]);

/* props */
let props = withDefaults(
    defineProps<{
      loading: boolean;
      columns: any; // 表格列配置
      data: any; // 表格分页数据
      permsEdit: string; // 编辑权限标识
      permsDelete: string; // 删除权限标识
      size: any; // 尺寸样式
      align: string; // 文本对齐方式
      maxHeight: number; // 表格最大高度
      showOperation: boolean; // 是否显示操作组件
      border: boolean; // 是否显示边框
      stripe: boolean; // 是否显示斑马线
      highlightCurrentRow: boolean; // // 是否高亮当前行
      showOverflowTooltip: boolean; // 是否单行显示
      showBatchDelete: boolean; // 是否显示操作组件
    }>(),
    {
      loading: true,
      columns: [{}],
      data: {},
      permsEdit: "",
      permsDelete: "",
      size: "small",
      align: "left",
      maxHeight: 440,
      showOperation: true,
      border: false,
      stripe: true,
      highlightCurrentRow: true,
      showOverflowTooltip: true,
      showBatchDelete: true,
    },
);

/* 响应式数据 */
let pageRequest = reactive<IPageRequest>({
  pageNum: 1,
  pageSize: 9,
  params: {}
});
let selections = reactive<any[]>([]);

/* 方法 */
function findPage() {
  emit("findPage", pageRequest);
}

// 选择切换
function selectionChange(val: any[]) {
  selections = val;
  emit("selectionChange", {selections: selections});
}

// 选择切换
function handleCurrentChange(val: any) {
  emit("handleCurrentChange", {val: val});
}

// 换页刷新
function refreshPageRequest(pageNum: number) {
  pageRequest.pageNum = pageNum;
  findPage();
}

// 编辑
function handleEdit(index: number, row: any) {
  emit("handleEdit", {index: index, row: row});
}

// 删除
function handleDelete(row: any) {
  handleDeleteRecord(row.id);
}

// 批量删除
function handleBatchDelete() {
  let ids = selections.map((item) => item.id).toString();
  handleDeleteRecord(ids);
}

// 删除操作
function handleDeleteRecord(ids: string) {
  ElMessageBox.confirm!("确认删除选中记录吗？", "提示", {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => {
        let params = [];
        let idArray = (ids + "").split(",");
        for (let i = 0; i < idArray.length; i++) {
          params.push({id: idArray[i]});
        }
        loading.value = true;
        let callback = (res: any) => {
          if (res.code == 200) {
            ElMessage({message: "删除成功", type: "success"});
            findPage();
          } else {
            ElMessage({message: "操作失败, " + res.msg, type: "error"});
          }
          loading.value = false;
        };
        emit("handleDelete", {params: params, callback: callback});
      })
      .catch(() => {
      });
}

function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

/* 生命周期钩子 */
onMounted(() => {
  refreshPageRequest(1);
});
</script>

<style scoped></style>
