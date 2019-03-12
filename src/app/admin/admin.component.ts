import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState } from '../store/admin.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  constructor(
      private store: Store<{admin: AdminState}>,
      private router: Router
  ) {

    this.store.select('admin').subscribe((state) => {
        if (!state.user.token) {
            router.navigateByUrl('admin/login.html', { replaceUrl: true });
        }
    });
  }

  ngOnInit() {
  }

}
