export interface IRole {
  id?: number;
  createBy?: any;
  createTime?: string;
  lastUpdateBy?: any;
  lastUpdateTime?: string;
  name?: string;
  remark?: string;
  delFlag?: number;
}

export function createIRole():IRole {
  return {
    id: undefined,
    createBy: sessionStorage.getItem('user'),
    createTime: new Date().toISOString(),
    lastUpdateBy: '',
    lastUpdateTime: '',
    name: '',
    remark: '',
    delFlag: 0,
  }
}