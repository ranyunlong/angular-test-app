import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { IndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

const routes: Routes = [
    {
        path: 'admin/login.html',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: IndexComponent
            },
            {
                path: 'menu.html',
                component: MenuComponent
            },
            {
                path: '404.html',
                component: NotfoundComponent
            },
            {
                path: 'role.html',
                component: RoleComponent
            },
            {
                path: 'user.html',
                component: UserComponent
            },
            {
                path: '**',
                redirectTo: '404.html'
            }
        ]
    }
];

@NgModule({
    declarations: [AdminComponent, IndexComponent, UserComponent, RoleComponent, MenuComponent, LoginComponent, NotfoundComponent],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forRoot(routes)
    ],
    bootstrap: [
        AdminComponent
    ]
})
export class AdminModule { }
