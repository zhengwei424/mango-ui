import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const useTabStore = defineStore('tab', () => {
    // 主入口标签页
    let mainTabs = reactive<string[]>([])
    // 当前标签页名
    const mainTabsActiveName = ref('')

    function updateMainTabs(tabs: string[]) {
        mainTabs = tabs
    }

    function updateMainTabsActiveName(name: string) {
        mainTabsActiveName.value = name
    }

    return {
        mainTabs,
        mainTabsActiveName,
        updateMainTabs,
        updateMainTabsActiveName,
    }
});