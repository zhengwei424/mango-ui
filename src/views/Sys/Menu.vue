<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="t('action.search')"
            perms="sys:menu:view"
            type="primary"
            @click="findTreeData()"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="t('action.add')"
            perms="sys:menu:add"
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
        width="80"
        label="ID"
      >
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="id"
        width="150"
        label="名称"
      >
      </table-tree-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template #default="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success"
            >菜单
          </el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info"
            >按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      >
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
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
        fixed="right"
        header-align="center"
        align="center"
        width="185"
        :label="t('action.operation')"
      >
        <template #default="scope">
          <kt-button
            icon="fa fa-edit"
            :label="t('action.edit')"
            perms="sys:menu:edit"
            @click="handleEdit(scope.row)"
          />
          <kt-button
            icon="fa fa-trash"
            :label="t('action.delete')"
            perms="sys:menu:delete"
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
      v-model:visible="dialogVisible"
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
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio
              v-for="(type, index) in menuTypeList"
              :label="index"
              :key="index"
              >{{ type }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input
            v-model="dataForm.name"
            :placeholder="menuTypeList[dataForm.type] + '名称'"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <popup-tree-input
            :data="popupTreeData"
            :props="popupTreeProps"
            :prop="
              dataForm.parentName == null || dataForm.parentName == ''
                ? '顶级菜单'
                : dataForm.parentName
            "
            :nodeKey="'' + dataForm.parentId"
            :currentChangeHandle="handleTreeSelectChange"
          >
          </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
          <el-input
            v-model="dataForm.perms"
            placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
              <el-input
                v-model="dataForm.url"
                placeholder="菜单路由"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light" style="padding: 10px">
                <template v-slot:content>
                  <div>
                    <p>URL格式：</p>
                    <p>
                      1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为
                      /Sys/User, 此处填写 /sys/user。
                    </p>
                    <p>
                      2.嵌套外部网页，如通过菜单打开百度网页，此处填写
                      http://www.baidu.com，http:// 不可省略。
                    </p>
                    <p>
                      示例：用户管理：/sys/user 嵌套百度：https://www.baidu.com
                      嵌套网页：http://127.0.0.1:8000
                    </p>
                  </div>
                </template>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="dataForm.type !== 2"
          label="排序编号"
          prop="orderNum"
        >
          <el-input-number
            v-model="dataForm.orderNum"
            controls-position="right"
            :min="0"
            label="排序编号"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <!-- <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in dataForm.iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover> -->
              <el-input
                v-model="dataForm.icon"
                v-popover:iconListPopover
                :readonly="false"
                placeholder="菜单图标名称（如：fa fa-home fa-lg）"
                class="icon-list__input"
              ></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
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
import KtButton from "@/views/Core/KtButton.vue";
import TableTreeColumn from "@/views/Core/TableTreeColumn.vue";
import PopoverTreeInput from "@/components/PopupTreeInput/index.vue";
import FaIconTooltip from "@/components/FaIconTooltip/index.vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { inject, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const api = inject("api");
const { t } = useI18n();

const dataFormRef = ref<FormInstance>();

let size = ref("small");
let loading = ref(false);
let filters = reactive({
  name: "",
});
let tableTreeData = reactive([]);
let dialogVisible = ref(false);
let menuTypeList = reactive(["目录", "菜单", "按钮"]);
let dataForm = reactive({
  id: 0,
  type: 1,
  name: "",
  parentId: 0,
  parentName: "",
  url: "",
  perms: "",
  orderNum: 0,
  icon: "",
  iconList: [],
});
let dataRule = {
  name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
};
let popupTreeData = reactive<any[]>([]);
let popupTreeProps = reactive({
  label: "name",
  children: "children",
});

// 获取数据
function findTreeData() {
  loading.value = true;
  api.menu.findMenuTree().then((res: any) => {
    tableTreeData = res.data;
    popupTreeData = getParentMenuTree(res.data);
    loading.value = false;
  });
}

// 获取上级菜单树
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
  dataForm = {
    id: 0,
    type: 1,
    name: "",
    parentId: 0,
    parentName: "",
    url: "",
    perms: "",
    orderNum: 0,
    icon: "",
    iconList: [],
  };
}

// 显示编辑界面
function handleEdit(row: any) {
  dialogVisible.value = true;
  Object.assign(dataForm, row);
}

// 删除
function handleDelete(row: any) {
  ElMessageBox.confirm("确认删除选中记录吗？", "提示", {
    type: "warning",
  }).then(() => {
    let params = getDeleteIds([], row);
    api.menu.batchDelete(params).then(() => {
      findTreeData();
      ElMessage({ message: "删除成功", type: "success" });
    });
  });
}

// 获取删除的包含子菜单的id列表
function getDeleteIds(ids: any, row: any) {
  ids.push({ id: row.id });
  if (row.children != null) {
    for (let i = 0, len = row.children.length; i < len; i++) {
      getDeleteIds(ids, row.children[i]);
    }
  }
  return ids;
}

// 菜单树选中
function handleTreeSelectChange(data: any) {
  dataForm.parentId = data.id;
  dataForm.parentName = data.name;
}

// 图标选中
function iconActiveHandle(iconName: string) {
  dataForm.icon = iconName;
}

// 表单提交
function submitForm() {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认提交吗？", "提示", {}).then(() => {
        loading.value = true;
        let params = Object.assign({}, dataForm);
        api.menu.save(params).then((res: any) => {
          loading.value = false;
          if (res.code == 200) {
            ElMessage({ message: "操作成功", type: "success" });
            dataFormRef.value?.resetFields();
            dialogVisible.value = false;
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
