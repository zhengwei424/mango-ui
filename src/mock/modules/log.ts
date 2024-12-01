/* 
 * 操作日志模块
 */

// 分页查询
export function findPage(params: any) {
    const findPageData = {
        "code": 200,
        "msg": null,
        "data": {
            pageNum: 0,
            pageSize: 0,
            totalSize: 0,
            content: [{}]
        }
    }
    const pageNum = 1
    const pageSize = 8
    if (params !== null) {
        // pageNum = params.pageNum
    }
    if (params !== null) {
        // pageSize = params.pageSize
    }
    const content = getContent(pageNum, pageSize)
    findPageData.data.pageNum = pageNum
    findPageData.data.pageSize = pageSize
    findPageData.data.totalSize = 50
    findPageData.data.content = content
    return {
        url: 'log/findPage',
        type: 'post',
        data: findPageData
    }
}

export function getContent(pageNum: number, pageSize: number) {
    const content = []
    for (let i = 0; i < pageSize; i++) {
        const obj = {
            id: 0,
            userName: '',
            operation: '',
            method: '',
            params: {},
            time: 0,
            ip: '',
            remark: '',
            createBy: '',
            createTime: ''
        }
        const index = ((pageNum - 1) * pageSize) + i + 1
        obj.id = index
        obj.userName = 'admin' + index
        obj.operation = 'operation'
        obj.method = 'com.louis.controller.SysUserController.findPage'
        obj.params = '{"pageNum":"1","pageSize":"8"}'
        obj.time = 12
        obj.ip = '127.0.0.1'
        obj.remark = 'remark log' + index
        if (i % 2 === 0) {

        }
        obj.createBy = 'admin'
        obj.createTime = '2018-08-14 11:11:11'
        obj.createBy = 'admin'
        obj.createTime = '2018-09-14 12:12:12'
        content.push(obj)
    }
    return content
}
