import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
    customLayout: boolean;

    constructor(
        private translate: TranslateService
    ) {}

    public menuStates: boolean;

    ngOnInit() {
        this.translate.addLangs(['en', 'zh-cn']);
        this.translate.setDefaultLang('zh-cn');
        this.translate.use('zh-cn');
    }

    menuState() {
        this.menuStates = $('mk-layout-wrapper').hasClass('sidebar-collapse');
    }

    ngAfterViewInit() { }
}
