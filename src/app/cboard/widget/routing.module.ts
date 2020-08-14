import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WidgetComponent } from './widget.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WidgetComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class RoutingModule { }
