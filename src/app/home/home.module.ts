import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [IndexComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot([
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'admin'
        }
    ])
  ]
})
export class HomeModule { }
