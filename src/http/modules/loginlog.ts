import axios from '../axios'

/* 
 * 操作日志模块
 */

// 删除
export const batchDelete = (data: any) => {
    return axios({
        url: '/loginlog/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data: any) => {
    return axios({
        url: '/loginlog/findPage',
        method: 'post',
        data
    })
}