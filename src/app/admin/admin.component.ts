import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState, AdminUserInfo, AdminMenu } from '../store/admin.reducer';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BaseHttpResponse } from './admin.interceptor';
import { AdminSetUserAction, AdminSetUserTokenAction, AdminSetMenuAction } from '../store/admin.action';

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
            if (state) {
                if (state.user) {
                    if (!state.user.token) {
                        router.navigateByUrl('admin/login.html', { replaceUrl: true });
                    }
                    if (state.user.userInfo) {
                        this.userInfo = state.user.userInfo;
                    }
                } else if (state.menu) {
                    if (Array.isArray(state.menu)) {
                       this.menu = this.pipeMenu(state.menu, 0);
                    }
                }
            }
        });
    }

    public menu: AdminMenu[] = [];
    public collapsed: boolean;
    public userInfo: AdminUserInfo = {
        username: ''
    };

    public navigator(url) {
        this.router.navigateByUrl(url);
    }

    public pipeMenu(menu: AdminMenu[], parentId: number): AdminMenu[] {
        return menu.filter((item) => item.parentId === parentId).map((item) => {
            if (item.url) {
                if (/^http/.test(item.url)) {
                    item.url = 'admin';
                } else {
                    // 防止重复添加
                    if (!(/\.html$/.test(item.url))) {
                        item.url = item.url.replace(/(sys|job|oss)/, 'admin') + '.html';
                    }
                }

                if (/^http/.test(item.url)) {
                    item.url = '/';
                }
            }
            item.children = this.pipeMenu(menu, item.menuId);
            return item;
        });
    }

    ngOnInit() {
        this.getUserInfo();
        this.getMenuList();
    }

    public getUserInfo() {
        this.http.get('/sys/user/info').subscribe((res: UserResponse) => {
            if (res.code === 0) {
                this.store.dispatch(new AdminSetUserAction(res.user));
            }
        });
    }

    public getMenuList() {
        this.http.get('/sys/menu/list').subscribe((res: AdminMenu)  => {
            if (Array.isArray(res)) {
                this.store.dispatch(new AdminSetMenuAction(res))
            }
        });
    }

    logOut() {
        localStorage.removeItem('token');
        this.store.dispatch(new AdminSetUserTokenAction(undefined));
        this.router.navigateByUrl('admin/login.html', { replaceUrl: true });
    }

}


interface UserResponse extends BaseHttpResponse {
    user: AdminUserInfo;
}
