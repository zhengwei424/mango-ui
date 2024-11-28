export default {
    state: {
        // 主入口标签页
        mainTabs: [],
        // 当前标签页名
        mainTabsActiveName: ''
    },
    mutations: {
        updateMainTabs(state: any, tabs: string[]) {
            state.mainTabs = tabs
        },
        updateMainTabsActiveName(state: any, name: string) {
            state.mainTabsActiveName = name
        }
    }
}