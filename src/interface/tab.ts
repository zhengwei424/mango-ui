export interface ITab {
    name: string,
     routePath: string,
    icon: string
}

export function createITab():ITab {
    return {
        name: '',
        routePath: '',
        icon: '',
    }
}