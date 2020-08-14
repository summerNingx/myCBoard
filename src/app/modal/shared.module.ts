import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ng2-dnd';
import { TranslateModule } from '@ngx-translate/core';
import { NgCoresModule, ConfigService, DialogService } from '@ism/ng-cores';
import { TreeModule } from 'angular-tree-component';


import { ExpComponent } from './exp/exp.component';
import { FilterGroupComponent } from './filterGroup/filterGroup.component';
import { ParamComponent } from './param/param.component';
import { VfilterComponent } from './vfilter/vfilter.component';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        DndModule.forRoot(),
        TranslateModule.forRoot(),
        NgCoresModule,
        TreeModule.forRoot()
    ],
    declarations: [
        ExpComponent,
        FilterGroupComponent,
        ParamComponent,
        VfilterComponent
    ],
    providers: [
        ConfigService,
        DialogService,
        ParamComponent,
        NgbActiveModal,
        HttpClient
    ],
    entryComponents: [
        ExpComponent,
        FilterGroupComponent,
        ParamComponent,
        VfilterComponent
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        NgbModule,
        DndModule,
        TranslateModule,
        NgCoresModule,
        TreeModule,
        ExpComponent,
        FilterGroupComponent,
        ParamComponent,
        VfilterComponent
    ]
})
export class SharedModule {

}
