// 引入子模块
import app from './modules/app.js'
import tab from './modules/tab.js'
import iframe from './modules/iframe.js'
import user from './modules/user.js'
import menu from './modules/menu.js'

const createStore = require('vuex')

const store = createStore({
    modules: {
        app: app,
        tab: tab,
        iframe: iframe,
        user: user,
        menu: menu
    }
})

export default store