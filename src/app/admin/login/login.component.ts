import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import uuid from 'uuid';
import { Store } from '@ngrx/store';
import { AdminSetUserTokenAction } from 'src/app/store/admin.action';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
    private validateForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private notification: NzNotificationService
    ) {
        this.validateForm = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(3)]],
            password: [null, [Validators.required, Validators.minLength(5)]],
            captcha: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
        });
    }

    public uuid: string = uuid();

    public loading: boolean;

    validator(key: 'username' | 'password' | 'captcha') {
        return this.validateForm.get(key).errors && this.validateForm.get(key).dirty;
    }

    getState(key: 'username' | 'password' | 'captcha') {
        return this.validateForm.controls[key];
    }

    submitForm(e: Event, f: any) {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }

        if (this.validateForm.valid) {
            this.http.post('/sys/login', {...this.validateForm.value, uuid: this.uuid }).subscribe((data: LoginResponse) => {
                if (data.code === 0) {
                    this.setToken(data.token);
                    this.router.navigateByUrl('admin', { replaceUrl: true });
                } else {
                    this.notification.error('错误', data.msg);
                    this.updateUuid();
                }
            });
        }
    }

    updateUuid() {
        this.uuid = uuid();
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        this.store.dispatch(
            new AdminSetUserTokenAction(token)
        )
    }

    ngOnInit() {
    }

}

interface LoginResponse {
    code: number;
    expire: number;
    msg: string;
    token: string;
}
