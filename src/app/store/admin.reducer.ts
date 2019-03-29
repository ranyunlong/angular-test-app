/**
 * admin reducer
 */

import { AdminSetUserAction, AdminActionTypes, AdminSetUserTokenAction, AdminSetMenuAction } from './admin.action';

const initstate: AdminState = {
    menu: null,
    user: {
        token: localStorage.getItem('token'),
        userInfo: {
            userId: null,
            username: null,
            password: null,
            email: null,
            mobile: null,
            status: null,
            roleIdList: null,
            createUserId: null,
            createTime: null
        }
    }
};

export function adminReducer(
    state = initstate,
    action: AdminSetUserAction | AdminSetUserTokenAction | AdminSetMenuAction
) {
    const { user, ...more } = state;
    switch (action.type) {
        case AdminActionTypes.SetUser:
        return { ...more, user: { ...user, userInfo: action.userInfo }};
        case AdminActionTypes.SetUserToken:
        return {...more, user: { ...user,  token: action.token}};
        case AdminActionTypes.SetMenu:
        return { ...more, menu: action.menu };
        default:
        return state;
    }
}

export interface AdminUserState {
    token?: string;
    userInfo?: AdminUserInfo;
}

export interface AdminUserInfo {
    userId?: number;
    username?: string;
    password?: string;
    email?: string;
    mobile?: string;
    status?: number;
    roleIdList?: number[];
    createUserId?: number;
    createTime?: string;
}

export interface AdminState {
    user: AdminUserState;
    menu: AdminMenuState | null;
}

export type AdminMenuState = AdminMenu[];

export interface AdminMenu {
  menuId: number;
  name: string;
  parentId: number;
  parentName: string;
  url: string;
  perms: string;
  type: number;
  icon: string;
  orderNum: number;
  open: boolean;
  children?: AdminMenu[];
}
