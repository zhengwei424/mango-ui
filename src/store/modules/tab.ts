import {defineStore} from "pinia";
import {ITab} from "../../interface/tab.ts";
import {ref} from "vue";

export const useTabStore = defineStore("tab", () => {
    // 主入口标签页
    let mainTabs = ref<ITab[]>([]);
    // 当前标签页名
    const mainTabsActiveName = ref("");

    function setMainTabs(tab: ITab) {
        mainTabs.value = [...mainTabs.value.filter(item => item.name !== tab.name), tab];
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
