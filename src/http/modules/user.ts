import axios from '../axios'

/* 
 * 用户管理模块
 */

// 保存
export const save = (data: any) => {
    return axios({
        url: '/user/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data: any) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data: any) => {
    return axios({
        url: '/user/findPage',
        method: 'post',
        data
    })
}
// 导出Excel用户信息
export const exportUserExcelFile = (data: any) => {
    return axios({
        url: '/user/exportUserExcelFile',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (data: any) => {
    return axios({
        url: '/user/findPermissions',
        method: 'get',
        data
    })
}
// 根据用户名查找
export const findByName = (data: any) => {
    return axios({
        url: '/user/findByName',
        method: 'get',
        data
    })
}
// 更新用户密码
export const updatePassword = (data: any) => {
    return axios({
        url: '/user/updatePassword',
        method: 'get',
        data
    })
}