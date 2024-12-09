import store from "../store";

/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param permsVal
 */

export function hasPermission(permsVal: any) {
  let hasPermission = false;
  const { perms } = store.useUserStore();
  for (let i = 0, len = perms.length; i < len; i++) {
    if (perms[i] === permsVal) {
      hasPermission = true;
      break;
    }
  }
  return hasPermission;
}
