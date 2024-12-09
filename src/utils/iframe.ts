/**
 * 嵌套页面IFrame模块
 */

import { baseUrl } from "../utils/global";

/**
 * 嵌套页面路由路径
 * @param {*} url
 */
export function getIFramePath(url: string): string {
  let iframeRoutePath = "";
  if (/^iframe:.*/.test(url)) {
    iframeRoutePath = url.replace("iframe:", "");
  } else if (/^http[s]?:\/\/.*/.test(url)) {
    iframeRoutePath = url.replace("http://", "");
    if (iframeRoutePath.indexOf(":") != -1) {
      iframeRoutePath = iframeRoutePath.substring(
        iframeRoutePath.lastIndexOf(":") + 1,
      ); // 截取冒号之后的字符串
    }
  }
  return iframeRoutePath;
}

/**
 * 嵌套页面URL地址
 * @param {*} url
 */
export function getIFrameUrl(url: string): string {
  let iframeRequestUrl = "";
  if (/^iframe:.*/.test(url)) {
    iframeRequestUrl = baseUrl + url.replace("iframe:", "");
  } else if (/^http[s]?:\/\/.*/.test(url)) {
    iframeRequestUrl = url;
  }
  return iframeRequestUrl;
}
