import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WidgetComponent } from './widget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/modal/shared.module';
import { RoutingModule } from './routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateHttpLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [WidgetComponent],
    imports: [
        SharedModule,
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateHttpLoader),
                deps: [HttpClient]
            },
            isolate: true // 隔离服务
        }),
        RoutingModule
    ],
    exports: [
        WidgetComponent
    ],
    entryComponents: [
        WidgetComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class WidgetModule { }
