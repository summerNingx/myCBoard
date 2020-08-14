import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DndModule, DragDropService, DragDropConfig, DragDropSortableService } from 'ng2-dnd';
import { TreeModule, TreeDraggedElement } from 'angular-tree-component';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';


@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forRoot(),
        NgbModule,
        DndModule.forRoot(),
        TreeModule.forRoot(),
        RouterModule.forChild([{
            path: '',
            component: DashboardComponent
        }])
    ],
    exports: [
        DashboardComponent
    ],
    providers: [
        DragDropService,
        DragDropConfig,
        DragDropSortableService,
        TreeDraggedElement
    ],
    entryComponents: [DashboardComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class DashboardModule { }
