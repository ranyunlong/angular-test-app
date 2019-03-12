/**
 * admin action types
 */

import { Action } from '@ngrx/store';
import { AdminUserInfo } from './admin.reducer';

export enum AdminActionTypes {
    SetUser = 'SET_USER',
    SetUserToken = 'SET_USER_TOKEN'
}

export class AdminSetUserAction implements Action {
    public readonly type = AdminActionTypes.SetUser;
    constructor(
        public readonly userInfo: AdminUserInfo
    ) {}
}

export class AdminSetUserTokenAction implements Action {
    public readonly type = AdminActionTypes.SetUserToken;
    constructor(
        public readonly token: string
    ) {}
}