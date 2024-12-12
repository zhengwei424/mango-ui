export interface IUserRole {
    id?: any;
    roleId?: any;
    userId?: any;
    createBy?: any;
    createTime?: any;
    lastUpdateBy?: any;
    lastUpdateTime?: any;
}


export interface IUserRoleManagement {
    id?: any;
    createBy?: any;
    createTime?: any;
    lastUpdateBy?: any;
    lastUpdateTime?: any;
    name?: any;
    nickName?: any;
    avatar?: any;
    password?: any;
    salt?: any;
    email?: any;
    mobile?: any;
    status?: any;
    deptId?: any;
    delFlag?: any;
    deptName?: any;
    roleNames?: any;
    userRoles?: IUserRole[];
}
