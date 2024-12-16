<template>
  <div>
    <el-popover :placement="placement" trigger="click">
      <el-tree
        :data="data"
        :props="props"
        :node-key="nodeKey"
        :default-expand-all="defaultExpandAll"
        @node-click="handleNodeClick"
        :highlight-current="true"
      >
      </el-tree>
      <template #reference>
        <el-input
          v-model="inputValue"
          :readonly="true"
          :placeholder="placeholder"
          style="cursor: pointer"
        ></el-input>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
export default {
  name: "PopoverTreeInput",
};
</script>

<script setup lang="ts">
import { defineProps, ref, toRef, watch, withDefaults } from "vue";

const emits = defineEmits(["currentChangeHandle"]);

let popoverProps = withDefaults(
  defineProps<{
    data: Array<any>;
    props: any;
    prop: string;
    nodeKey: string;
    placeholder?: string;
    placement?: any;
    defaultExpandAll?: boolean;
  }>(),
  {
    data: () => [],
    props: () => {},
    prop: "",
    nodeKey: "",
    placeholder: "点击选择内容",
    placement: "right-start",
    defaultExpandAll: false,
  },
);

let inputValue = ref<string>();
watch(
  () => popoverProps.prop,
  (val) => {
    inputValue.value = val;
  },
  { immediate: true },
);

function handleNodeClick(data: any) {
  emits("currentChangeHandle", data);
  inputValue.value = data.name;
}
</script>
<style scoped></style>
