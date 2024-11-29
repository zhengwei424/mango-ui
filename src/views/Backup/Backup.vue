<template>
  <!--备份还原界面-->
  <el-dialog :title="$t('common.backupRestore')" width="40%" :visible.sync="backupVisible" :close-on-click-modal="false"
             :modal=false>
    <el-table :data="tableData" style="width: 100%;font-size:16px;" height="330px" :show-header="showHeader"
              size="mini" v-loading="tableLoading" :element-tableLoading-text="$t('action.loading')">
      <el-table-column prop="title" :label="$t('common.versionName')" header-align="center" align="center">
      </el-table-column>
      <el-table-column fixed="right" :label="$t('action.operation')" width="180">
        <template #default="scope">
          <el-button @click="handleRestore(scope.row)" type="primary" size="mini">{{ $t('common.restore') }}</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" :disabled="scope.row.name=='backup'?true:false"
                     size="mini">{{ $t('action.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="backupVisible = false">{{ $t('action.cancel') }}</el-button>
            <el-button size="small" type="primary" @click="handleBackup">{{ $t('common.backup') }}</el-button>
        </span>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Backup'
})
</script>

<script setup lang="ts">
import axios from 'axios';
import {ref, reactive, onMounted} from 'vue';
import {inject} from 'vue';
import {ElMessage} from "element-plus";

const global = inject<{
  baseUrl: string,
  backupBaseUrl: string
}>('globalValue')!

/* 变量初始化 */
let tableData = reactive([]);   // 备份记录
let showHeader = ref(false);
let backupVisible = ref(true);
let tableLoading = ref(false);

/* 方法 */
// // 设置可见性
// function setBackupVisible(backupVisible: boolean) {
//   back
// }

// 查询备份记录
function findRecords() {
  tableLoading.value = true
  axios.get(global.backupBaseUrl + '/backup/findRecords').then((res) => {
    let resData = res.data
    if (resData.code == 200) {
      tableData = res.data
    } else {
      ElMessage({message: '操作失败, ' + resData.msg, type: 'error'})
    }
    tableLoading.value = false
  })
}

// 数据备份
function handleBackup() {
  tableLoading.value = true
  axios.get(global.backupBaseUrl + '/backup/backup').then((res) => {
    let resData = res.data
    if (resData.code == 200) {
      ElMessage({message: '操作成功', type: 'success'})
    } else {
      ElMessage({message: '操作失败, ' + resData.msg, type: 'error'})
    }
    tableLoading.value = false
    findRecords()
  })
}

// 数据还原
function handleRestore(data: any) {
  tableLoading.value = true
  axios.get(global.backupBaseUrl + '/backup/restore', {params: {name: data.name}}).then((res) => {
    let resData = res.data
    if (resData.code == 200) {
      ElMessage({message: '操作成功', type: 'success'})
      // this.$emit('afterRestore', {}) ?????????????????????????????
    } else {
      ElMessage({message: '操作失败, ' + resData.msg, type: 'error'})
    }
    tableLoading.value = false
  })
}

// 删除备份
function handleDelete(data: any) {
  tableLoading.value = true
  axios.get(global.backupBaseUrl + '/backup/delete', {params: {name: data.name}}).then((res) => {
    let resData = res.data
    if (resData.code == 200) {
      ElMessage({message: '操作成功', type: 'success'})
    } else {
      ElMessage({message: '操作失败, ' + resData.msg, type: 'error'})
    }
    findRecords()
    tableLoading.value = false
  })
}

function setBackupVisible(val: boolean) {
  backupVisible.value = val
}

/* 生命周期钩子 */
onMounted(() => {
  findRecords()
})

defineExpose(['setBackupVisible'])

</script>

<style scoped>

</style>