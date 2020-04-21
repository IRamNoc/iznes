/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Login view. */
import { SetlLoginComponent } from './login.component';
import { SetlLogoutComponent } from './logout.component';

/* SSO Login Engie view. */
import { LoginSSOEngieComponent } from './login-ssoengie/login-ssoengie.component';

/* Signup */
import { SignupComponent } from './signup/component';

/* Notifications. */
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual';
import { SetlDirectivesModule, SetlPipesModule, SetlComponentsModule } from '@setl/utils';
import { EnrollComponent } from './two-factor/enroll/enroll.component';
import { AuthenticateComponent } from './two-factor/authenticate/authenticate.component';
import { LoginService } from './login.service';

@NgModule({
    declarations: [
        SetlLoginComponent,
        SetlLogoutComponent,
        SignupComponent,
        EnrollComponent,
        AuthenticateComponent,
        LoginSSOEngieComponent,
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
        SetlComponentsModule,
    ],
    exports: [
        SetlLoginComponent,
        SignupComponent,
        EnrollComponent,
        AuthenticateComponent,
        LoginSSOEngieComponent,
    ],
    providers: [
        ToasterService,
        LoginService,
    ],
})

export class SetlLoginModule {
}
