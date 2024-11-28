import {createI18n} from 'vue-i18n'


// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = createI18n({
    locale: 'zh_cn',
    messages: {
        'zh_cn': require('../assets/languages/zh_cn.json'),
        'en_us': require('../assets/languages/en_us.json')
    }
})

export default i18n