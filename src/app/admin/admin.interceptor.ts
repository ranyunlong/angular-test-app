import { HttpInterceptor } from '@angular/common/http/src/interceptor';
import { HttpRequest, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, ObservableInput } from 'rxjs';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private notification: NzNotificationService
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler) {
        const headers: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json;utf-8'
        });

        const cloneRequest = request.clone({
            url: `/proxyapi${request.url}`,
            headers
        });

        const result = next.handle(cloneRequest);
        result.pipe(
            catchError(this.handleError)
        ).subscribe((res: HttpResponse<BaseHttpResponse>) => {
            const{ body } = res;
            if (body) {
                const { code, msg } = body;
                // 如果返回401 token 失效了
                if (code === 401) {
                    // 跳转登录
                    this.router.navigateByUrl('admin/login.html', {
                        replaceUrl: true
                    });
                    this.notification.error('提示', msg);
                } else if (code !== 0) {
                    this.notification.error('提示', msg);
                }
            }
        });
        return result;
    }

    public handleError(err: any, caught: Observable<any>): ObservableInput<any> {
        return;
    }
}

export interface BaseHttpResponse {
    code: number;
    msg: string;
}