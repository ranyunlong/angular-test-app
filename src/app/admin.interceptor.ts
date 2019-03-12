import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AdminState, AdminUserState } from './store/admin.reducer';

@Injectable()
export class AdminHttpInterceptor implements HttpInterceptor {
    public user: AdminUserState = {};
    constructor(public router: Router, public store: Store<{admin: AdminState}>) {
        store.subscribe((state) => {
            this.user = state.admin.user;
        })
    }
    public intercept(request: HttpRequest<any>, next: HttpHandler) {
        console.log(this.user.token)
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: this.user.token
        });
        const clonedRequest  = request.clone({
            url: `/proxyapi${request.url}`,
            headers
        });
        const http = next.handle(clonedRequest);
        http.subscribe((response: HttpResponse<{ code: number }>) => {
            const { body } = response;
            console.log(body);
            if (body && body.code === 401) {
                this.router.navigateByUrl('admin/login.html');
            }
        });
        return http;
    }
}
