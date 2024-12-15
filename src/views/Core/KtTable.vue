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
            @click="handleEdit(scope.row)"
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
    <div class="table-footer" style="padding: 10px">
      <!-- 批量删除 -->
      <kt-button
        :label="t('action.batchDelete')"
        :perms="permsDelete"
        :size="size"
        type="danger"
        @click="handleBatchDelete"
        :disabled="selections.length === 0"
        style="float: left"
        v-if="showBatchDelete && showOperation"
      />
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pageRequest.pageNum"
        v-model:page-size="pageRequest.pageSize"
        :page-sizes="[10, 20]"
        :size="size"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.totalSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IPageRequest } from "@/interface/pageRequest.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import KtButton from "./KtButton.vue";
import { reactive, ref, defineEmits, watch, inject } from "vue";
import { useI18n } from "vue-i18n";
import { format } from "@/utils/datetime.ts";

const { t } = useI18n();
/* emit */
const emit = defineEmits([
  "findPage",
  "handleCurrentChange",
  "handleEdit",
  "handleDelete",
  "handleBatchDelete",
]);

/* props */
let props = withDefaults(
  defineProps<{
    columns?: any; // 表格列配置
    data?: any; // 表格分页数据
    permsEdit?: string; // 编辑权限标识
    permsDelete?: string; // 删除权限标识
    size?: "large" | "default" | "small"; // 尺寸样式
    align?: string; // 文本对齐方式
    maxHeight?: number; // 表格最大高度
    showOperation?: boolean; // 是否显示操作组件
    border?: boolean; // 是否显示边框
    stripe?: boolean; // 是否显示斑马线
    highlightCurrentRow?: boolean; // // 是否高亮当前行
    showOverflowTooltip?: boolean; // 是否单行显示
    showBatchDelete?: boolean; // 是否显示操作组件
  }>(),
  {
    columns: () => [],
    data: () => {},
    permsEdit: "",
    permsDelete: "",
    size: () => "small",
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

const loading = inject("loading");

/* 响应式数据 */
let pageRequest = reactive<IPageRequest>({
  pageNum: 1,
  pageSize: 10,
  params: {},
});
let selections = ref<any[]>([]);

watch(pageRequest, () => {
  // 页面改变时刷新
  findPage();
});

/* 方法 */
function findPage() {
  emit("findPage", pageRequest);
}

// 行被勾选时触发
function selectionChange(newSelection: any[]) {
  // 表格行被勾选时触发
  selections.value = newSelection;
  // emit("selectionChange", { selections: selections });
}

// 行被鼠标点击时触发
function handleCurrentChange(currentRow: any) {
  // console.log('当前行变化', currentRow)
}

// 编辑
function handleEdit(row: any) {
  emit("handleEdit", row);
}

// 删除
function handleDelete(row: any) {
  emit("handleDelete", row);
}

// 批量删除
function handleBatchDelete() {
  emit("handleBatchDelete", selections.value);
}

function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}
</script>

<style scoped>
.table-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
