export interface IDept {
    id?: number;
    createBy?: any;
    createTime?: string;
    lastUpdateBy?: any;
    lastUpdateTime?: string;
    name?: string;
    parentId?: number;
    orderNum?: number;
    delFlag?: number;
    parentName?: string;
    level?: number;
    children?: IDept[]
}

export function createIDept():IDept {
    return {
        id: undefined,
        createBy: sessionStorage.getItem('user'),
        createTime: new Date().toISOString(),
        lastUpdateBy: '',
        lastUpdateTime: '',
        name: '',
        parentId: undefined,
        orderNum: undefined,
        delFlag: undefined,
        parentName: '顶级菜单',
        level: undefined,
        children: []
    }
}