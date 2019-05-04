import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpResponse } from '../admin.interceptor';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { isMobilePhone } from 'validator';
import { Validation } from 'src/app/lib/Validation';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit, OnChanges {
    private iPage = 1;
    private iLimit = 8;
    private iUsername = '';
    private isModalVisible = false;
    private modalTitle = '';
    private OkLoading = false;
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
            this.iPage = 1;
            this.getUserList();
        }
    }

    public get isCheckAll() {
        return  this.list.filter((item) => {
            return item.selected;
         }).length === this.list.length;
    }

    public set isCheckAll(val: boolean) {
        this.list = this.list.map((item) => {
            item.selected = val;
            return item;
        });
    }

    public get checkedList() {
        return this.list.filter((item) => item.selected);
    }

    public get isCheck() {
        const resuslt = this.list.filter((item) => {
            return item.selected;
        });
        return resuslt.length > 0 && resuslt.length !== this.list.length;
    }

    public sidx = 'userId';
    public order = 'desc';
    public total = 1;
    public list: Array<{ [K in keyof List]?: List[K] }> = [];
    public loading = false;
    public editData: List | null = null;

    // 表单组的验证规则
    private validateForm: FormGroup;
    constructor(
        private http: HttpClient,
        private notification: NzNotificationService,
        private formBuilder: FormBuilder
    ) {

        const formGroup: { [K in keyof UserForm]?: any } = {
            username: new FormControl(null, [
                Validation.required('密码必须'),
                Validation.isLength({min: 5, max: 16}, '账号长度必须5-16位')
            ]),
            password: new FormControl(null, [
                Validation.required('密码必须'),
                Validation.isLength({min: 5, max: 16}, '密码长度必须5-16位')
            ]),
            mobile: new FormControl(null, [
                Validation.required('手机必须'),
                    Validation.isMobile('手机号码格式不正确')
            ]),
            email: new FormControl(null, [
                Validation.required('邮箱必须'),
                Validation.isEmail('邮箱格式不正确')
            ]),
            status: new FormControl(true)
        };
        this.validateForm = formBuilder.group(formGroup);
    }

    /**
     * 获取表单错误
     * @param key 表单的字段名称
     */
    public getFormError(key: string): string {
        return this.validateForm.get(key).errors.message;
    }

    ngOnInit() {
        this.getUserList();
    }

    ngOnChanges(arg) {
        console.log(arg);
    }

    /**
     * 验证表单
     * @param key 表单的字段名称
     */
    public validate(key: string) {
        return this.validateForm.get(key).errors && this.validateForm.get(key).dirty;
    }

    /**
     * 获取用户列表
     */
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

    /**
     * 处理模态框ok事件
     */
    private handleModalOk() {
        // this.isModalVisible = false;
        // this.OkLoading = true;
        // 更新验证
        for (const item in  this.validateForm.controls) {
            this.validateForm.controls[item].markAsDirty();
            this.validateForm.controls[item].updateValueAndValidity();
        }

        if (this.validateForm.valid) {
            const userInfo = this.validateForm.value as UserForm;
            userInfo.status = userInfo.status ? 0 : 1;
            if (this.modalTitle === '新增管理员') {
                userInfo.userId = userInfo.userId ? userInfo.userId : 0;
                userInfo.roleIdList = [];
                this.OkLoading = true;
                return this.http.post('/sys/user/save', userInfo).subscribe((res: BaseHttpResponse) => {
                    const { code, msg } = res;
                    if (code === 0) {
                        this.notification.success('成功', '已添加');
                        this.OkLoading = false;
                        this.isModalVisible = false;
                        this.getUserList();
                    } else {
                        // this.notification.error('失败', msg);
                        this.OkLoading = false;
                    }
                });
            } else {
                this.OkLoading = true;
                if (this.editData.password.substr(0, 6) === userInfo.password) {
                    delete this.editData.password;
                    delete userInfo.password;
                }
                return this.http.post('/sys/user/update', {
                    ...this.editData,
                    ...userInfo
                }).subscribe((res: BaseHttpResponse) => {
                    const { code, msg } = res;
                    if (code === 0) {
                        this.notification.success('成功', '已更新');
                        this.OkLoading = false;
                        this.isModalVisible = false;
                        this.getUserList();
                    } else {
                        // this.notification.error('失败', msg);
                        this.OkLoading = false;
                    }
                });
            }
        }
    }

    handleEdit(data: List) {
        this.editData = data;
        // console.log(data)
        this.isModalVisible = true;
        this.modalTitle = '修改用户';
        this.validateForm.setValue({
            username: data.username,
            password: data.password.substr(0, 6),
            mobile: data.mobile,
            status: data.status === 0 ? true : false,
            email: data.email
        });

        // this.validateForm
    }

    private deleteMany() {
        console.log(1, this.checkedList);
    }

    /**
     * 处理模态框的取消事件
     */
    private handleModalCancel() {
        this.isModalVisible = false;
        this.validateForm.reset();
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
    selected?: boolean;
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

interface UserForm {
  userId: number;
  username: string;
  password: string;
  email: string;
  mobile: string;
  status: number;
  roleIdList: number[];
}
