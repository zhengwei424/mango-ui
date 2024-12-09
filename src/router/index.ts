// import { defineAsyncComponent } from "vue";
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from "vue-router";
// @ts-ignore
import Login from "../views/Login.vue";
// @ts-ignore
import NotFound from "../views/404.vue";
// @ts-ignore
import Home from "../views/Home.vue";
// @ts-ignore
import Intro from "../views/Intro/Intro.vue";
import store from "../store";
import { getIFramePath, getIFrameUrl } from "../utils/iframe";
import api from "../http/api.ts";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "首页",
      component: Home,
      children: [
        {
          path: "",
          name: "系统介绍",
          // @ts-ignore
          component: () => import("../views/Intro/Intro.vue"),
          meta: {
            icon: "fa fa-home fa-lg",
            index: 0,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "登录",
      component: Login,
    },
    {
      path: "/404",
      name: "notFound",
      component: NotFound,
    },
  ],
});
// 没有使用的变量可以在变量名前面加上下划线_
router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    // 登录界面登录成功之后，会把用户信息保存在会话
    // 存在时间为会话生命周期，页面关闭即失效。
    const userName = sessionStorage.getItem("user");
    if (to.path === "/login") {
      // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
      if (userName) {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      if (!userName) {
        // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
        next({ path: "/login" });
      } else {
        // 加载动态菜单和路由
        addDynamicMenuAndRoutes(userName, to);
        next();
      }
    }
  },
);

/**
 * 加载动态菜单和路由
 */
function addDynamicMenuAndRoutes(userName: string, to: any) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path);
  if (store.useAppStore().menuRouteLoaded) {
    console.log("动态菜单和路由已经存在.");
    return;
  }
  api.menu
    .findNavTree({ userName: userName })
    .then((res: any) => {
      // 添加动态路由
      let dynamicRoutes = addDynamicRoutes(res.data);
      // 处理静态组件绑定路由
      // @ts-ignore
      router.options.routes[0].children =
        // @ts-ignore
        router.options.routes[0].children.concat(dynamicRoutes);

      // @ts-ignore
      router.addRoute(router.options.routes);
      router.options.routes.map((route: RouteRecordRaw) => {
        router.addRoute(route);
      });

      // 保存加载状态
      store.useAppStore().changeMenuRouteLoaded(true);
      // 保存菜单树
      store.useMenuStore().setNavTree(res.data);
    })
    .then(() => {
      api.user.findPermissions({ name: userName }).then((res: any) => {
        // 保存用户权限标识集合
        store.useUserStore().setPerms(res.data);
      });
    })
    .catch(function () {});
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path: string) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path;
  const length = store.useIframeStore().iframeUrls.length;
  for (let i = 0; i < length; i++) {
    const iframe = store.useIframeStore().iframeUrls[i];
    if (path != null && path.endsWith(iframe.path)) {
      url = iframe.url;
      store.useIframeStore().setIFrameUrl(url);
      break;
    }
  }
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
// @ts-ignore
function addDynamicRoutes(menuList: any[] = [], routes: any[] = []) {
  let temp: any[] = [];
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children);
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, "");

      // 创建路由配置
      const route = {
        path: menuList[i].url,
        component: Promise.resolve({}),
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id,
        },
      };
      const path = getIFramePath(menuList[i].url);
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route["path"] = path;
        // @ts-ignore
        route["component"] = () => import("../views/IFrame/IFrame.vue");

        // 存储嵌套页面路由路径和访问URL
        const url = getIFrameUrl(menuList[i].url);
        const iFrameUrl = { path: path, url: url };
        store.useIframeStore().addIFrameUrl(iFrameUrl);
      } else {
        try {
          // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
          // 如url="Sys/user"，则组件路径应是"@/views/Sys/user.vue",否则组件加载不到
          const array = menuList[i].url.split("/");
          let url = "";
          for (let i = 0; i < array.length; i++) {
            url +=
              array[i].substring(0, 1).toUpperCase() +
              array[i].substring(1) +
              "/";
          }
          url = url.substring(0, url.length - 1);
          // @ts-ignore
          // route["component"] = () => import(`"./views/${url}.vue"`);  // 不使用这种方式，解析不到组件地址！！！！！
          route["component"] = Promise.resolve(
            () => import("../views/" + url + ".vue"),
          );
        } catch (e) {}
      }
      routes.push(route);
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes);
  } else {
    console.log("动态路由加载...");
    console.log(routes);
    console.log("动态路由加载完成.");
  }
  return routes;
}
export default router;
