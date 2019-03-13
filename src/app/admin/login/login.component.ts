import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import uuid from 'uuid';
import { Store } from '@ngrx/store';
import { AdminState } from 'src/app/store/admin.reducer';
import { AdminSetUserTokenAction } from 'src/app/store/admin.action';
import { BaseHttpResponse } from '../admin.interceptor';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
    private validateForm: FormGroup;
    private uuid: string = uuid();
    private captchaSpinning: boolean;
    private loading: boolean;
    constructor(
        private http: HttpClient,
        private store: Store<{admin: AdminState}>,
        private formBuilder: FormBuilder,
        private router: Router,
        private notification: NzNotificationService
    ) {

        store.select('admin').subscribe((res) => {
            if (res && res.user && res.user.token) {
                router.navigateByUrl('admin', {
                    replaceUrl: true
                });
            }
        });
        // 创建表单组 包含的验证规则
        this.validateForm = formBuilder.group({
            username: [null, [ Validators.required, Validators.minLength(3), Validators.maxLength(16) ]],
            password: [null, [ Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
            captcha: [ null, [ Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
        });
    }

    public updateUUID() {
        this.uuid = uuid();
    }

    public getStatus(key: string) {
        return this.validateForm.controls[key];
    }

    public validate(key: string) {
        return this.validateForm.get(key).errors && this.validateForm.get(key).dirty;
    }

    public getErrors(name: string, key: string): string {
        const { errors } =  this.validateForm.get(key);
        if (errors.minlength) {
            return `${name}: 长度不够`;
        } else if (errors.maxlength) {
            return `${name}: 长度超出限制`;
        } else if (errors.required) {
            return `${name}: 必须填写`;
        }
        return '';
    }

    submitForm(e: Event) {
        if (this.loading) {
            return;
        }
        // 更新验证
        for (const item in  this.validateForm.controls) {
            this.validateForm.controls[item].markAsDirty();
            this.validateForm.controls[item].updateValueAndValidity();
        }
        // console.log()
        // 是否验证通过
        if (this.validateForm.valid) {
           const { value } = this.validateForm;
           this.http.post('/sys/login', {
               ...value,
               uuid: this.uuid
           }).subscribe((res: LoginResponse) => {
                if (res.code === 0) {
                    this.setUserToken(res.token);
                    this.router.navigateByUrl('admin', {
                        replaceUrl: true
                    });
                } else {
                    this.notification.error('提示', res.msg);
                }
                this.loading = false;
           });
        }
    }

    setUserToken(token: string) {
        localStorage.setItem('token', token);
        this.store.dispatch(
            new AdminSetUserTokenAction(token)
        );
    }

    ngOnInit() {
    }

}

interface LoginResponse extends BaseHttpResponse {
    token: string;
    expire: string;
}