import api from './api';
import { App } from 'vue';

/**
 * 自定义插件，可以在main.ts中用app.use(xx)使用它
 */
export default {
    install(app: App) {
        app.config.globalProperties.$api = api
        app.provide('api', api)
    }
}