import axios from '../axios'

/* 
 * 菜单管理模块
 */

// 保存
export const save = (data: any) => {
    return axios({
        url: '/menu/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data: any) => {
    return axios({
        url: '/menu/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = (data: any) => {
    return axios({
        url: '/menu/findNavTree',
        method: 'get',
        data
    })
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/menu/findMenuTree',
        method: 'get'
    })
}