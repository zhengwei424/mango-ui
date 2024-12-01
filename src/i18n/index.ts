import {createI18n} from 'vue-i18n'
import zh from "../assets/languages/zh_cn.json"
import en from "../assets/languages/en_us.json"

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = createI18n({
    legacy: false,
    locale: 'zh_cn',
    messages: {
        'zh_cn': zh,
        'en_us': en
    }
})

export default i18n