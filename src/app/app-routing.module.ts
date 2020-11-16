import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                children: [
                    // {
                    //     path: 'widget',
                    //     loadChildren: './cboard/widget/widget.module#WidgetModule'
                    // }
                    // , {
                    //     path: 'dashboard',
                    //     loadChildren: './cboard/dashboard/dashboard.module#DashboardModule'
                    // }
                    {
                        path: 'login',
                        loadChildren: () => import('./login/login.module').then(md => md.LoginModule)
                    }
                ]
            }
        ], { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
