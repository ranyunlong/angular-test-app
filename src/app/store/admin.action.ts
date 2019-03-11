/**
 * admin action types
 */

import { Action } from '@ngrx/store';
import { AdminUserState } from './admin.reducer';

export enum AdminActionTypes {
    SetUser = 'SET_USER'
}

export class AdminSetUserAction implements Action {
    constructor(
        public readonly type: AdminActionTypes.SetUser,
        public readonly data: AdminUserState
    ) {}
}