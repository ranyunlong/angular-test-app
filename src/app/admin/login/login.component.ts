import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    constructor() { }

    submitForm(e: Event) {
        // e.preventDefault();
        // console.log(e);
        e.stopPropagation();
        e.preventDefault();
    }

    ngOnInit() {
    }

}
