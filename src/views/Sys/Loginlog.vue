<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="t('action.search')"
            perms="sys:loginlog:view"
            type="primary"
            @click="findPage({})"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      :data="pageResult"
      :columns="columns"
      :loading="loading"
      :showOperation="showOperation"
      @findPage="findPage"
    >
    </kt-table>
  </div>
</template>

<script setup lang="ts">
import {IPageRequest} from "@/interface/pageRequest.ts";
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import { format } from "@/utils/datetime";
import {inject, onMounted, provide, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";

const api = inject("api");
const { t } = useI18n();

let size = ref("small");
let filters = reactive({
  name: "",
});
let columns = reactive([
  { prop: "id", label: "ID", minWidth: 60 },
  { prop: "userName", label: "用户名", minWidth: 100 },
  { prop: "status", label: "状态", minWidth: 120 },
  { prop: "ip", label: "IP", minWidth: 120 },
  { prop: "time", label: "耗时", minWidth: 80 },
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
let pageResult = reactive({});
let showOperation = ref(false);
let loading = ref(true);
provide('loading',loading);

// 获取分页数据
function findPage(val: IPageRequest) {
  if (val) {
    Object.assign(pageRequest, val);
  }
  pageRequest.params = {username: filters.name, status: "online"};
  api.loginlog
    .findPage(pageRequest)
    .then((res: any) => {
      Object.assign(pageResult, res.data);
      loading.value=false
    });
}

// 时间格式化
// function dateFormat(row, column, cellValue, index) {
//   return format(row[column.property]);
// }
function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

onMounted(() => {
  findPage("");
});
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
}
</style>
