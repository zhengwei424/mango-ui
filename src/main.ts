import {createApp} from "vue";
// @ts-ignore
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import global from "./utils/global.ts";
import ElementUI from "element-plus";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faUserSecret, faPerson, faKey} from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import {createPinia} from "pinia";
import api from "./http/index.ts"

// @ts-ignore
library.add(faUserSecret, faPerson, faKey);

const piniaStore = createPinia()
const app = createApp(App);
// 全局属性（使用时需要用this.haha,无论是在setup中还是在template中）
// app.config.globalProperties.haha = global
// 引入global全局变量
app.provide("global", global); // ts或js中inject后使用
//引入各种插件
app.use(router);
app.use(piniaStore);
app.use(i18n);
app.use(api)
app.use(ElementUI);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
