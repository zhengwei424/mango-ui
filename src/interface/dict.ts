export interface IDict {
  id?: number;
  label?: string;
  value?: string;
  type?: string;
  sort?: number;
  description?: string;
  remarks?: string;
  delFlag?: number;
  createBy?: any;
  createTime?: string;
  lastUpdateBy?: any;
  lastUpdateTime?: string;
}

export function createIDict(): IDict {
  return {
    id: undefined,
    label: '',
    value: '',
    type: '',
    sort: 0,
    description: '',
    remarks: '',
    delFlag: 0,
    createBy: sessionStorage.getItem('user'),
    createTime: new Date().toISOString(),
    lastUpdateBy: '',
    lastUpdateTime: '',
  }
}