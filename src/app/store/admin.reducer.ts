/**
 * admin reducer
 */

import { AdminSetUserAction, AdminActionTypes, AdminSetUserTokenAction } from './admin.action';

const initstate: AdminState = {
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

export function adminReducer(state = initstate, action: AdminSetUserAction | AdminSetUserTokenAction) {
    const { user, ...more } = state;
    switch (action.type) {
        case AdminActionTypes.SetUser:
        return { ...more, user: { ...user, userInfo: action.userInfo }};
        case AdminActionTypes.SetUserToken:
        return {...more, user: { ...user,  token: action.token}};
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
}
