import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validation } from 'src/app/lib/Validation';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

    public iRoleName: string;
    public get roleName() {
        return this.iRoleName;
    }
    public set roleName(val: string) {
        this.iRoleName = val;
    }

    public modalTitle: string | null | undefined;

    public OkLoading: boolean;

    public validateForm: FormGroup;

    public list: List[] = [];

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder
    ) {
        const formGroup: { [K in keyof RoleForm]?: any } = {
            roleName: new FormControl(null, [
                Validation.required('角色名称必须'),
                Validation.isLength({min: 1, max: 16}, '账号长度必须1-16位')
            ]),
            remark: new FormControl(null, [
                Validation.required('描述必须'),
                Validation.isLength({min: 3, max: 255}, '密码长度必须5-16位')
            ])
        };
        this.validateForm = formBuilder.group(formGroup);
    }

    ngOnInit() {
        this.http.get('/sys/role/select').subscribe((data: ResponseData) => {
            if (data.code === 0) {
                this.list = data.list;
            }
        });
    }

    /**
     * 获取表单错误
     * @param key 表单的字段名称
     */
    public getFormError(key: string): string {
        return this.validateForm.get(key).errors.message;
    }

    /**
     * 验证表单
     * @param key 表单的字段名称
     */
    public validate(key: string) {
        return this.validateForm.get(key).errors && this.validateForm.get(key).dirty;
    }

    /**
     * 模态框点击取消
     */
    handleModalCancel() {
        this.modalTitle = null;
    }

    /**
     * 模态框点击确定
     */
    handleModalOk() {
        for (const item in  this.validateForm.controls) {
            this.validateForm.controls[item].markAsDirty();
            this.validateForm.controls[item].updateValueAndValidity();
        }

        if (this.validateForm.valid) {
            // console.log(this.validateForm.value)
            const role =  this.validateForm.value as RoleForm;
            if (!role.roleId) {
                role.roleId = 0;
            }

            if (!role.menuIdList) {
                role.menuIdList = []
            }

            this.http.post('/sys/role/save', role).subscribe(res => {
                console.log(res)
            })
        }
    }

}

interface RoleForm {
  roleId?: number;
  roleName: string;
  remark: string;
  menuIdList?: number[];
}


interface ResponseData {
  code: number;
  msg?: string;
  list: List[];
}

interface List {
  roleId: number;
  roleName: string;
  remark: string;
  menuIdList: number[];
  createUserId: number;
  createTime: string;
}