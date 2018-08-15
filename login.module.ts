/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Login view. */
import { SetlLoginComponent } from './login.component';
import { SetlLogoutComponent } from './logout.component';

/* Signup */
import { SignupComponent } from './signup/component';

/* Notifications. */
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual';
import { SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

@NgModule({
    declarations: [
        SetlLoginComponent,
        SetlLogoutComponent,
        SignupComponent,
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
    ],
    exports: [
        SetlLoginComponent,
        SignupComponent,
    ],
    providers: [
        ToasterService,
    ],
})

export class SetlLoginModule {

}
