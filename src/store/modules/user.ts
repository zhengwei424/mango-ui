import {defineStore} from "pinia";
import {reactive} from "vue";

export const useUserStore = defineStore('user', () => {
    // 用户权限标识集合
    let perms = reactive<string[]>([])

    // 用户权限标识集合
    function setPerms(val: string[]) {
        perms = val
    }

    return {
        perms,
        setPerms
    }
})
