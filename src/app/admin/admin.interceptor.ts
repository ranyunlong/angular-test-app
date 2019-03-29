import { HttpInterceptor } from '@angular/common/http/src/interceptor';
import { HttpRequest, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
<<<<<<< HEAD
import { catchError } from 'rxjs/operators';
=======
>>>>>>> 04
import { Observable, ObservableInput } from 'rxjs';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState } from '../store/admin.reducer';
import { AdminSetUserTokenAction } from '../store/admin.action';
<<<<<<< HEAD
import { tap } from 'rxjs/operators';
=======
import { tap, catchError } from 'rxjs/operators';
>>>>>>> 04

@Injectable()
export class AdminHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private notification: NzNotificationService,
        private store: Store<{admin: AdminState}>
    ) {
        this.store.select('admin').subscribe((state) => {
            if (state && state.user && state.user.token) {
                this.token = state.user.token;
            }
        });
    }

    public token: string;

    public intercept(request: HttpRequest<any>, next: HttpHandler) {
        const baseHeaders = {
            'Content-Type': 'application/json'
        };
        const localToken = localStorage.getItem('token');
        if (this.token || localToken) {
            baseHeaders['token'] = this.token || localToken;
        }
        const headers: HttpHeaders = new HttpHeaders(baseHeaders);
        const cloneRequest = request.clone({
            url: `/proxyapi${request.url}`,
            headers
        });

        return next.handle(cloneRequest).pipe(
<<<<<<< HEAD
=======
            // catchError(this.handleError),
>>>>>>> 04
            tap((res: HttpResponse<BaseHttpResponse>) => {
                const{ body } = res;
                if (body) {
                    const { code, msg } = body;
                    // 如果返回401 token 失效了
                    if (code === 401) {
                        // 清理token
                        localStorage.removeItem('token');
                        this.store.dispatch(new AdminSetUserTokenAction(null));

                        // 跳转登录
                        this.router.navigateByUrl('admin/login.html', {
                            replaceUrl: true
                        });
                        this.notification.error('提示', msg);
                    } else if (code && code !== 0) {
                        this.notification.error('提示', msg);
                    }
                }
            })
        );
    }

    public handleError(err: any, caught: Observable<any>): ObservableInput<any> {
        return;
    }
}

export interface BaseHttpResponse {
    code: number;
    msg: string;
}