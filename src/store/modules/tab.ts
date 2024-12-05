import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useTabStore = defineStore("tab", () => {
  // 主入口标签页
  let mainTabs = reactive<any[]>([]);
  // 当前标签页名
  const mainTabsActiveName = ref("");

  function setMainTabs(tabs: any[]) {
    Object.assign(mainTabs, tabs);
  }

  function setMainTabsActiveName(name: string) {
    mainTabsActiveName.value = name;
  }

  return {
    mainTabs,
    mainTabsActiveName,
    setMainTabs,
    setMainTabsActiveName,
  };
});
