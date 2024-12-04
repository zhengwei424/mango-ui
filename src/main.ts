import { createApp } from "vue";
// @ts-ignore
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import global from "./utils/global.ts";
import ElementUI from "element-plus";
import { createPinia } from "pinia";
import api from "./http/api.ts";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./style.css";
import "element-plus/dist/index.css";

const piniaStore = createPinia();
const app = createApp(App);
// 引入global全局变量
app.provide("global", global); // ts或js中inject后使用
app.provide("api", api);
//引入各种插件
app.use(router);
app.use(piniaStore);
app.use(i18n);
app.use(ElementUI);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
