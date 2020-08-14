import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor';


import { LayoutModule } from '@ism/angular-admin-lte';

import { adminLteConf } from './admin-lte.conf';
import { SharedModule } from './modal/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateHttpLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule.forRoot(adminLteConf),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateHttpLoader),
                deps: [HttpClient]
            },
            isolate: true // 隔离服务
        }),
        HttpClientModule,
        MonacoEditorModule.forRoot()
    ],
    exports: [
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
