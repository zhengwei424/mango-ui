import { defineStore } from "pinia";
import { reactive } from "vue";

export const useMenuStore = defineStore("menu", () => {
  // 导航菜单树
  let navTree = reactive<any[]>([]);

  // 设置导航菜单树
  function setNavTree(val: string[]) {
    Object.assign(navTree, val);
  }

  return {
    navTree,
    setNavTree,
  };
});
