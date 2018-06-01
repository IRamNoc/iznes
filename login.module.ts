/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

/* Login view. */
import {SetlLoginComponent} from './login.component';
import {SetlLogoutComponent} from './logout.component';

/* Notifications. */
import {ToasterModule, ToasterService} from 'angular2-toaster';

import {ClarityModule} from '@clr/angular';
import {MultilingualModule} from '@setl/multilingual';
import {SetlDirectivesModule, SetlPipesModule} from '@setl/utils';

@NgModule({
    declarations: [
        SetlLoginComponent,
        SetlLogoutComponent
    ],
    imports: [
        ToasterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        MultilingualModule,
        SetlDirectivesModule,
        SetlPipesModule,
        RouterModule.forChild([
            {
                path: 'login',
                component: SetlLoginComponent,
            },
            {
                path: 'logout',
                component: SetlLogoutComponent,
            },
            {
                path: 'reset/:token',
                component: SetlLoginComponent,
            },
        ]),
    ],
    exports: [
        SetlLoginComponent
    ],
    providers: [
        ToasterService
    ],
})

export class SetlLoginModule {

}
