<template>
  <el-select
    v-model="selectLabel"
    placeholder="select tree"
    :size="size"
    style="width: 200px"
  >
    <!-- 必须要嵌套一个el-option,否则el-tree不显示。el-option标签内没有内容！！！ -->
    <el-option hidden style="height: 100%" :value="selectLabel"></el-option>
    <!-- filter -->
    <el-input v-model="filterText" size="small"></el-input>
    <!-- tree -->
    <el-tree
      ref="treeRef"
      :data="data"
      :props="props"
      :node-key="nodeKey"
      default-expand-all
      @node-click="handNodeClick"
      :filter-node-method="filterNode"
      style="height: 100%; width: 200px"
      :size="size"
    >
    </el-tree>
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElTree } from "element-plus";

const emits = defineEmits(["currentChangeHandle"]);

interface TreeProps {
  data?: any;
  props?: any;
  prop?: any;
  nodeKey?: any;
  selectWidth?: number;
  treeWidth?: number;
  size?: any;
}

const cps = withDefaults(defineProps<TreeProps>(), {
  data: () => {},
  props: () => {
    return {
      label: "label",
      children: "children",
    };
  },
  selectWidth: 200,
  treeWidth: 200,
  size: "small",
});

const selectLabel = ref<any>();
selectLabel.value = cps.prop;
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

watch(filterText, (value: string) => {
  treeRef.value!.filter(value);
});

function handNodeClick(data: any) {
  // 自动匹配el-tree的props的label属性
  selectLabel.value = data[cps.props.label];
  emits("currentChangeHandle", data);
}

const filterNode = (value: any, data: any): boolean => {
  if (!value) {
    return true;
  }
  return data.label.includes(value);
};
</script>

<style scoped></style>
