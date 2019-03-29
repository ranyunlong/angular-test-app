import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpResponse } from '../admin.interceptor';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit, OnChanges {
    private iPage = 1;
    private iLimit = 8;
    private iUsername = '';

    public get page() {
        return this.iPage;
    }
    public set page(val: number) {
        if (this.iPage !== val) {
            this.iPage = val;
            this.getUserList();
        }
    }

    public get limit() {
        return this.iLimit;
    }
    public set limit(value: number) {
        if (this.iLimit !== value) {
            this.iLimit = value;
            this.getUserList();
        }
    }

    public get username() {
        return this.iUsername;
    }
    public set username(value: string) {
        if (this.iUsername !== value) {
            this.iUsername = value;
            this.getUserList();
        }
    }

    public sidx = 'userId';
    public order = 'desc';
    public total = 1;
    public list: Array<{ [K in keyof List]?: List[K] }> = [];
    public loading = false;
    constructor(
        private http: HttpClient,
        private notification: NzNotificationService
    ) { }

    ngOnInit() {
        this.getUserList();
    }

    ngOnChanges(arg) {
        console.log(arg);
    }

    private getUserList() {
        this.loading = true;
        const { page, limit, sidx, order, username } = this;
        this.http.get('/sys/user/list', {
            params: {
                page: page.toString(),
                limit: limit.toString(),
                sidx,
                order,
                username
            }
        }).subscribe((res: UserListResponse) => {
            console.log(res)
            const { code, msg } = res;
            if (code !== undefined && code === 0 && res.page.list) {
                this.list = res.page.list;
                this.total = res.page.totalCount;
                this.page = res.page.currPage;
            } else {
                this.notification.error(
                    '提示',
                    msg
                );
            }
            this.loading = false;
        });
    }

}

interface UserListResponse extends BaseHttpResponse {
  page: Page;
}

interface Page {
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
  list: List[];
}

interface List {
  userId: number;
  username: string;
  password: string;
  email: string;
  mobile: string;
  status: number;
  roleIdList: number[];
  createUserId: number;
  createTime: string;
}