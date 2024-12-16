export interface IConfig {
    id?: number,
    createBy?: any,
    createTime?: string,
    lastUpdateBy?: any,
    lastUpdateTime?: string,
    value?: string,
    label?: string,
    type?: string,
    description?: string,
    sort?: number,
    remarks?: string,
    delFlag?: number
}

export function createIConfig(): IConfig {
    return {
        id: undefined,
        createBy: sessionStorage.getItem('user'),
        createTime: new Date().toISOString(),
        lastUpdateBy: '',
        lastUpdateTime: '',
        value: '',
        label: '',
        type: '',
        description: '',
        sort: 0,
        remarks: '',
        delFlag: 0
    }
}