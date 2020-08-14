import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                children: [
                    {
                        path: 'widget',
                        loadChildren: './cboard/widget/widget.module#WidgetModule'
                    }
                    // , {
                    //     path: 'dashboard',
                    //     loadChildren: './cboard/dashboard/dashboard.module#DashboardModule'
                    // }
                ]
            }
        ], { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
