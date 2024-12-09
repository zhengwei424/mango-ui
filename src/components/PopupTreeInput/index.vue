<template>
  <div>
    <el-popover :placement="placement" trigger="click">
      <el-tree
        :data="treeData"
        :props="treeProps"
        node-key="nodeKey"
        @current-change="currentChangeHandle"
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
        :expand-on-click-node="true"
      >
      </el-tree>
    </el-popover>
    <!--    <el-input-->
    <!--      v-model="prop"-->
    <!--      :readonly="true"-->
    <!--      :placeholder="placeholder"-->
    <!--      style="cursor: pointer"-->
    <!--    ></el-input>-->
  </div>
</template>

<script lang="ts">
export default {
  name: "PopoverTreeInput",
};
</script>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

withDefaults(
  defineProps<{
    treeData: Array<any>;
    treeProps: any;
    prop: string;
    nodeKey: string;
    placeholder: string;
    placement: any;
    defaultExpandAll: boolean;
    currentChangeHandle: Function;
  }>(),
  {
    treeData: () => [],
    treeProps: () => {},
    prop: "",
    nodeKey: "",
    placeholder: "",
    placement: "right-start",
    defaultExpandAll: false,
    currentChangeHandle: () => {},
  },
);
</script>

<style scoped></style>
