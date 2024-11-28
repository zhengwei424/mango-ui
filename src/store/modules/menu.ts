export default {
    state: {
        navTree: [],  // 导航菜单树
    },
    getters: {
   
    },
    mutations: {
        setNavTree(state:any, navTree:string[]){  // 设置导航菜单树
            state.navTree = navTree;
        }
    },
    actions: {
        
    }
}