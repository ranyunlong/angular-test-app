/**
 * admin reducer
 */

import { AdminSetUserAction, AdminActionTypes } from './admin.action';

const initstate: AdminState = {
    user: {
        userId: null,
        token: '123456',
        username: 'test',
        password: '',
        email: '',
        mobile: '',
        status: null,
        roleIdList: [],
        createUserId: null,
        createTime: ''
    }
};

export function adminReducer(state = initstate, action: AdminSetUserAction) {
    switch (action.type) {
        case AdminActionTypes.SetUser:
        return { ...state, user: action.data };
        default:
        return state;
    }
}

export interface AdminUserState {
    userId?: number;
    token?: string;
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
