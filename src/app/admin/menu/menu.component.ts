import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AdminState, AdminMenu } from 'src/app/store/admin.reducer';
import { NzTreeNode, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Validation } from 'src/app/lib/Validation';
import * as Icons from '@ant-design/icons-angular/icons';
import { IconService, IconDefinition  } from '@ant-design/icons-angular';
import { AdminSetMenuAction } from 'src/app/store/admin.action';
import { NzModalControlService } from 'ng-zorro-antd/modal/nz-modal-control.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
    public modalTitle?: '添加顶级菜单' | '添加菜单' | '修改菜单' | null;
    public OkLoading?: boolean | null;

    public iconList?: IconDefinition[];

    public form!: MenuInfo;
    public menuList: MenuInfo[] = [];
    public menuListCopy: MenuInfo[] = [];
    public validateForm: FormGroup;
    public updateMenuId: number;
    constructor(
        private store: Store<{ admin: AdminState }>,
        private http: HttpClient,
        private formBuild: FormBuilder,
        private notification: NzNotificationService,
        private modal: NzModalService
    ) {
        this.validateForm = formBuild.group({
            name: new FormControl(null, [
                Validation.required('菜单名称必须')
            ]),
            url: new FormControl(null, []),
            perms: new FormControl(null, []),
            type: new FormControl(null, [
                Validation.required('菜单类型必须'),
                Validation.isNumeric('必须是数字')
            ]),
            icon: new FormControl(null, []),
            orderNum: new FormControl(0, [
                Validation.required('排序必须'),
                Validation.isNumeric('必须是数字')
            ]),
            parentId: new FormControl(null, [
                Validation.isNumeric('必须是数字')
            ])
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


    deepMenu(parentId: number, originMenu: MenuInfo[]) {
        return originMenu.filter(item => item.parentId === parentId).map((item) => {
            item.title = item.name;
            item.key = item.menuId;
            item.children = this.deepMenu(item.menuId, originMenu);
            return item;
        });
    }

    handleMenu( e: Event, item: NzTreeNode, itype: 'save' | 'update' | 'delete') {
        e.stopPropagation();
        const { menuId, icon, name, orderNum, perms, url, type, parentId }  = item.origin as MenuInfo;
        if (itype === 'save') {
            this.handleSaveMenu(menuId);
        } else if (itype === 'update') {
            this.modalTitle = '修改菜单';
            this.updateMenuId = menuId;
            this.validateForm.setValue({
                icon, name, orderNum, perms, url, type, parentId
            });
        } else if (itype === 'delete') {
            this.modal.warning({
                nzTitle: '提示',
                nzContent: `您正在删除菜单${name},是否继续?`,
                nzOnOk: () => {
                    console.log(111);
                }
            });
        }
    }

    ngOnInit() {
        this.store.select('admin').subscribe((state) => {
            if (state && state.menu) {
                const list = this.deepMenu(0, JSON.parse(JSON.stringify(state.menu)));
                this.menuList = list;
                this.menuListCopy.push({
                    key: -1,
                    menuId: 0,
                    title: '顶级菜单',
                    parentId: -1,
                    name: '顶级菜单',
                    orderNum: 0,
                    type: 0,
                    children: list
                });
            }
        });
        const iconList = Object.keys(Icons).map((key: string) => {
            return Icons[key] as IconDefinition;
        }).filter(item => item.theme === 'outline');

        this.iconList = iconList;
    }

    // 更新store 里的菜单列表
    public getMenuList() {
        this.http.get('/sys/menu/list').subscribe((res: AdminMenu)  => {
            if (Array.isArray(res)) {
                this.store.dispatch(new AdminSetMenuAction(res));
            }
        });
    }

    handleSaveMenu(parentId?: number) {
        if (isNaN(parentId)) {
            this.modalTitle = '添加顶级菜单';
            this.validateForm.setValue({
                type: 0,
                name: null,
                url: null,
                perms: null,
                icon: null,
                orderNum: 0,
                parentId: -1
            });
        } else {
            this.modalTitle = '添加菜单';
            this.validateForm.setValue({
                type: 0,
                name: null,
                url: null,
                perms: null,
                icon: null,
                orderNum: 0,
                parentId
            });
        }
    }

    handleModalCancel() {
        this.modalTitle = null;
        this.validateForm.reset();
    }

    handleModalOk() {
        if (this.modalTitle === '添加菜单' || this.modalTitle === '添加顶级菜单') {
            if (this.validateForm.valid) {
                // 模态框的ok按钮开始加载
                this.OkLoading = true;
                const { value } = this.validateForm;
                if (value.parentId === -1) {
                    value.parentId = 0;
                }
                const data: SaveMenuParams = {
                    menuId: 0,
                    ...value
                };
                this
                    .http
                    .post('/sys/menu/save', data)
                    .subscribe((res: { code: number, msg: string }) => {
                        if (res.code === 0) {
                            // this.notification.success('提示', res.msg);
                            this.getMenuList();
                            this.OkLoading = false;
                            this.modalTitle = null;
                        }
                    });
            }
        } else if (this.modalTitle === '修改菜单') {
            // 模态框的ok按钮开始加载
            this.OkLoading = true;
            const { value } = this.validateForm;
            if (value.parentId === -1) {
                value.parentId = 0;
            }
            const data: SaveMenuParams = {
                menuId: this.updateMenuId,
                ...value
            };
            this
                .http
                .post('/sys/menu/update', data)
                .subscribe((res: { code: number, msg: string }) => {
                    if (res.code === 0) {
                        // this.notification.success('提示', res.msg);
                        this.getMenuList();
                        this.OkLoading = false;
                        this.modalTitle = null;
                    }
                });
        }
    }
}

interface MenuInfo {
  menuId: number;
  parentId: number;
  parentName?: string;
  name: string;
  url?: string;
  perms?: string;
  type: number;
  icon?: string;
  orderNum: number;
  open?: any;
  list?: any;
  children?: MenuInfo[];
  title: string;
  key: number;
}


interface SaveMenuParams {
  menuId?: number;
  name: string;
  parentId: number;
  url: string;
  perms?: string;
  type: number;
  icon?: string;
  orderNum?: number;
}