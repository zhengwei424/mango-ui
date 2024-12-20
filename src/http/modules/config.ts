import axios from '../axios'

/* 
 * 系统配置模块
 */

// 保存
export const save = (data: any) => {
    return axios({
        url: '/config/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data: any) => {
    return axios({
        url: '/config/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data: any) => {
    return axios({
        url: '/config/findPage',
        method: 'post',
        data
    })
}