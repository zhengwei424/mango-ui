import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const useIframeStore = defineStore("iframe", () => {
    // 当前嵌套页面路由路径
    const iframeUrl = ref('')
    // 所有嵌套页面路由路径访问URL
    const iframeUrls = reactive<any[]>([])

    // 设置iframeUrl
    function setIFrameUrl(val: string) {
        iframeUrl.value = val
    }

    // iframeUrls
    function addIFrameUrl(val: {path: string, url: string}) {
        iframeUrls.push(val)
    }

    return {
        iframeUrl,
        iframeUrls,
        setIFrameUrl,
        addIFrameUrl,
    }
});

