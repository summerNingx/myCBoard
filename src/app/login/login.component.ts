import { Component, OnInit } from '@angular/core';
import { ILogininfo } from './interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    constructor() { }

    frmLogin: ILogininfo;

    login(form) {

    }

    ngOnInit() {
    }

}
