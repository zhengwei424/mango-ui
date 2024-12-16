export interface IMenu {
  id?: any;
  createBy?: any;
  createTime?: any;
  lastUpdateBy?: any;
  lastUpdateTime?: any;
  name?: any;
  parentId?: any;
  url?: any;
  perms?: any;
  type?: any;
  icon?: any;
  orderNum?: any;
  delFlag?: any;
  parentName?: any;
  level?: any;
  children?: IMenu[];
}

export function createIMenu(): IMenu {
  return {
    id: undefined,
    createBy: sessionStorage.getItem("user"),
    createTime: new Date().toISOString(),
    lastUpdateBy: "",
    lastUpdateTime: "",
    name: "",
    parentId: undefined,
    url: "",
    perms: "",
    type: undefined,
    icon: "",
    orderNum: undefined,
    delFlag: 0,
    parentName: "",
    level: undefined,
    children: [],
  };
}
