import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminState, AdminUserState, AdminUserInfo } from '../store/admin.reducer';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AdminSetUserAction } from '../store/admin.action';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

    constructor(
        private router: Router,
        private store: Store<{ admin: AdminState }>,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.http.get('/sys/user/info').subscribe((res: ResponseUserInfo) => {
            if (res.code === 0) {
                this.setUser(res.user);
            }
        });
    }

    setUser(user: AdminUserInfo) {
        this.store.dispatch(
            new AdminSetUserAction(user)
        );
    }
}

export interface ResponseUserInfo {
    code: number;
    msg: string;
    user: AdminUserInfo;
}
