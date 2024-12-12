<template>
  <!--表格显示列界面-->
  <el-dialog
    title="表格显示列"
    width="40%"
    v-model:visible="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-table
      ref="filterTable"
      :data="columns"
      height="330px"
      tooltip-effect="dark"
      header-align="left"
      align="left"
      :size="size"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column label="属性">
        <template #default="scope">{{ scope.row.prop }}</template>
      </el-table-column>
      <el-table-column label="列名">
        <template #default="scope">
          <el-input :size="size" v-model="scope.row.label"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="最小宽度">
        <template #default="scope">
          <el-input :size="size" v-model="scope.row.minWidth"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <template v-slot:footer>
<div  class="dialog-footer">
      <el-button :size="size" @click.native="dialogVisible = false">{{
        t("action.cancel")
      }}</el-button>
      <el-button
        :size="size"
        type="primary"
        @click.native="handleFilterColumns"
        >{{ t("action.confirm") }}</el-button
      >
    </div>
</template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, ref, reactive, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["handleFilterColumns"]);

let props = withDefaults(defineProps<{ columns?: any; size?: any }>(), {
  columns: () => [],
  size: "small",
});

let selections: Array<any> = reactive<Array<any>>([]);
let dialogVisible = ref(false);

function selectionChange(val: Array<any>): void {
  selections = val;
}

function setDialogVisible(val: boolean): void {
  dialogVisible.value = val;
}

function handleFilterColumns() {
  let filterColumns = [];
  for (let i = 0; i < props.columns.length; i++) {
    let column = props.columns[i];
    if (hasColumn(column)) {
      filterColumns.push(column);
    }
  }
  emit("handleFilterColumns", {
    filterColumns: JSON.parse(JSON.stringify(filterColumns)),
  });
}

function hasColumn(column: any): boolean {
  for (let i = 0; i < selections.length; i++) {
    let col = selections[i];
    if (column.prop == col.prop) {
      return true;
    }
  }
  return false;
}
</script>

<style scoped></style>
