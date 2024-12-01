import {defineStore} from "pinia";
import { ref} from "vue";

export const useAppStore = defineStore("app", () => {
    const appName = ref("Mango Platform")  // 应用名称
    const themeColor = ref("#14889A")  // 主题颜色
    const oldThemeColor = ref("#14889A")   // 上一次主题颜色
    const collapse = ref(false)  // 导航栏收缩状态
    const menuRouteLoaded = ref(false)    // 菜单和路由是否已经加载

    // 改变收缩状态
    function onCollapse() {
        collapse.value = !collapse.value
    }

    // 改变主题颜色
    function setThemeColor(val: string) {
        oldThemeColor.value = themeColor.value
        themeColor.value = val
    }

    // 改变菜单和路由的加载状态
    function changeMenuRouteLoaded(val: boolean) {
        menuRouteLoaded.value = val
    }
    return {
        appName,
        themeColor,
        oldThemeColor,
        collapse,
        menuRouteLoaded,
        onCollapse,
        setThemeColor,
        changeMenuRouteLoaded,
    }
});