<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="t('action.search')"
            perms="sys:log:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table
      :data="pageResult"
      :columns="columns"
      :showOperation="showOperation"
      @findPage="findPage"
    >
    </kt-table>
  </div>
</template>

<script setup lang="ts">
import KtTable from "@/views/Core/KtTable.vue";
import KtButton from "@/views/Core/KtButton.vue";
import { format } from "@/utils/datetime";
import {inject, onMounted, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";

const api = inject('api')
const { t } = useI18n();

let size = ref("small");
let filters = reactive({
  name: "",
});
let columns = reactive([
  { prop: "id", label: "ID", minWidth: 60 },
  { prop: "userName", label: "用户名", minWidth: 100 },
  // {prop:"operation", label:"操作", minWidth:120},
  { prop: "method", label: "方法", minWidth: 180 },
  { prop: "params", label: "参数", minWidth: 220 },
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
let pageRequest = reactive<{
  pageNum: number;
  pageSize: number;
  params: any[];
}>({
  pageNum: 1,
  pageSize: 10,
  params: [],
});
let pageResult = reactive({});
let showOperation = ref(false);

// 获取分页数据
function findPage(data: any) {
  // if (data !== null) {
  //   pageRequest = data.pageRequest;
  // }
  // pageRequest.params = [{ name: "userName", value: filters.name }];
  api.log
    .findPage({params: {username: 'admin'}})
    .then((res: any) => {
      pageResult = res.data;
    })
    // .then(data != null ? data.callback : "");
}

// 时间格式化
// function dateFormat (row, column, cellValue, index) {
//   return format(row[column.property]);
// }

function dateFormat(row: any, column: any, cellValue: any, index: number) {
  return format(cellValue);
}

onMounted(()=>{
  findPage('')
})

</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
}
</style>
