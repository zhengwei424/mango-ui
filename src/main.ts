import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from './utils/global.ts'
import ElementUI from 'element-plus'
import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)
// 引入global全局变量
app.config.globalProperties.$global = global  // 在模板中直接使用{{ $global.xxx }}
app.provide('globalValue', global)  // ts或js中inject后使用

//引入各种插件
app.use(router)
app.use(store)
app.use(i18n)
app.use(api)
app.use(ElementUI)
app.mount('#app')
