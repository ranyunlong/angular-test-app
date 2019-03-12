import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState, AdminUserState } from 'src/app/store/admin.reducer';
import { AdminSetUserAction, AdminActionTypes } from 'src/app/store/admin.action';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {
    public user: AdminUserState;
    constructor(
        private store: Store<{ admin: AdminState }>
    ) {
        this.store.select('admin').subscribe((state) => {
            this.user = state.user;
        });
    }

    public setUser() {
        this.store.dispatch(
            new AdminSetUserAction(
                {
                    username: '张三',
                    password: '12312'
                }
            )
        );
    }

    ngOnInit() {
    }

}
