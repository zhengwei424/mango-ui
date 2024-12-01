<template>
  <el-table-column :prop="prop" v-bind="$attrs">
    <template #default="scope">
      <span @click.prevent="toggleHandle(scope.$index, scope.row)" :style="childStyles(scope.row)">
        <i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i>
        {{ scope.row[prop] }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import {isArray} from 'lodash'
import {defineProps, withDefaults, nextTick } from 'vue';

let props = withDefaults(defineProps<{
  prop: string,
  treeKey: string,
  parentKey: string,
  levelKey: string,
  childKey: string
}>(), {
  prop: '',
  treeKey: 'id',
  parentKey: 'parentId',
  levelKey: 'level',
  childKey: 'children'
})

function childStyles(row: any) {
  return {'padding-left': (row[props.levelKey] * 25) + 'px'}
}

function iconClasses(row: any) {
  return [!row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom']
}

function iconStyles(row: any) {
  return JSON.stringify({'visibility': hasChild(row) ? 'visible' : 'hidden'})
}

function hasChild(row: any): boolean {
  return (isArray(row[props.childKey]) && row[props.childKey].length >= 1) || false
}

// 切换处理
function toggleHandle(index: number, row: any) {
  if (hasChild(row)) {
    let data = this.$parent.store.states.data.slice(0)
    data[index]._expanded = !data[index]._expanded
    if (data[index]._expanded) {
      data = data.splice(0, index + 1).concat(row[props.childKey]).concat(data)
    } else {
      data = removeChildNode(data, row[props.treeKey])
    }
    this.$parent.store.commit('setData', data)
    nextTick(() => {
      this.$parent.doLayout()
    })
  }
}

// 移除子节点
function removeChildNode(data: any, parentId: any) {
  let parentIds = isArray(parentId) ? parentId : [parentId]
  if (parentId.length <= 0) {
    return data
  }
  let ids = []
  for (let i = 0; i < data.length; i++) {
    if (parentIds.indexOf(data[i][props.parentKey]) !== -1 && parentIds.indexOf(data[i][props.treeKey]) === -1) {
      ids.push(data.splice(i, 1)[0][props.treeKey])
      i--
    }
  }
  return removeChildNode(data, ids)
}

</script>
