/* Core imports. */
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

/* Login view. */
import {SetlLoginComponent} from './login.component';

/* Notifications. */
import {ToasterModule, ToasterService} from 'angular2-toaster';

import {ClarityModule} from 'clarity-angular';
import {MultilingualModule} from '@setl/multilingual';

/**
 * Login guard service
 */
import {LoginGuardService} from './login-guard.service';


@NgModule({
    declarations: [
        SetlLoginComponent
    ],
    imports: [
        ToasterModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ClarityModule,
        MultilingualModule
    ],
    exports: [
        SetlLoginComponent
    ],
    providers: [
        ToasterService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})

export class SetlLoginModule {

}
