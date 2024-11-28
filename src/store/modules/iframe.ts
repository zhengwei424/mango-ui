export default {
    state: {
        iframeUrl: [],   // 当前嵌套页面路由路径
        iframeUrls: []   // 所有嵌套页面路由路径访问URL
    },
    getters: {},
    mutations: {
        setIFrameUrl(state: any, iframeUrl: string[]) {  // 设置iframeUrl
            state.iframeUrl = iframeUrl
        },
        addIFrameUrl(state: any, iframeUrl: string[]) {  // iframeUrls
            state.iframeUrls.push(iframeUrl)
        }
    },
    actions: {}
}