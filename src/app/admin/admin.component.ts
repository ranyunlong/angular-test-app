import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState, AdminUserInfo } from '../store/admin.reducer';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BaseHttpResponse } from './admin.interceptor';
import { AdminSetUserAction, AdminSetUserTokenAction } from '../store/admin.action';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

    constructor(
        private store: Store<{ admin: AdminState }>,
        private http: HttpClient,
        private router: Router
    ) {

        this.store.select('admin').subscribe((state) => {
            if (state && state.user) {
                if (!state.user.token) {
                    router.navigateByUrl('admin/login.html', { replaceUrl: true });
                }
                if (state.user.userInfo) {
                    this.userInfo = state.user.userInfo;
                }
            }
        });
    }

    public collapsed: boolean;
    public userInfo: AdminUserInfo = {
        username: ''
    };

    ngOnInit() {
        this.http.get('/sys/user/info').subscribe((res: UserResponse) => {
            if (res.code === 0) {
                // this.userInfo = res.user;
                this.store.dispatch(new AdminSetUserAction(res.user));
            }
        });
        // this.http.get('/sys/menu/list').subscribe(res: )
    }

    logOut() {
        localStorage.removeItem('token');
        this.store.dispatch(new AdminSetUserTokenAction(undefined));
        this.router.navigateByUrl('admin/login.html', { replaceUrl: true });
    }

}


interface UserResponse extends BaseHttpResponse {
    user: AdminUserInfo;
};
