import {baseUrl} from '../utils/global'
import * as login from './modules/login.js'
import * as user from './modules/user.js'
import * as role from './modules/role.js'
import * as dept from './modules/dept.js'
import * as menu from './modules/menu.js'
import * as dict from './modules/dict.js'
import * as config from './modules/config.js'
import * as log from './modules/log.js'
import * as loginlog from './modules/loginlog.js'

const Mock = require('mockjs')

// 1. 开启/关闭[所有模块]拦截, 通过调[openMock参数]设置.
// 2. 开启/关闭[业务模块]拦截, 通过调用fnCreate方法[isOpen参数]设置.
// 3. 开启/关闭[业务模块中某个请求]拦截, 通过函数返回对象中的[isOpen属性]设置.
// let openMock = true
const openMock = false
fnCreate(user, openMock)
fnCreate(role, openMock)
fnCreate(dept, openMock)
fnCreate(menu, openMock)
fnCreate(dict, openMock)
fnCreate(config, openMock)
fnCreate(log, openMock)
fnCreate(loginlog, openMock)
fnCreate(login, openMock)

/**
 * 创建mock模拟数据
 * @param {*} mod 模块
 * @param {*} isOpen 是否开启?
 */
function fnCreate(mod: any, isOpen = true) {

    if (isOpen) {
        for (const key in mod) {
            ((res) => {
                if (res.isOpen !== false) {
                    let url = baseUrl
                    if (!url.endsWith("/")) {
                        url = url + "/"
                    }
                    url = url + res.url
                    Mock.mock(new RegExp(url), res.type, (opts: any) => {
                        opts['data'] = opts.body ? JSON.parse(opts.body) : null
                        delete opts.body
                        console.log('\n')
                        console.log('%cmock拦截, 请求: ', 'color:blue', opts)
                        console.log('%cmock拦截, 响应: ', 'color:blue', res.data)
                        return res.data
                    })
                }
            })(mod[key]() || {})
        }
    }
}
