/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Pipes. */
import { SelectModule, SetlComponentsModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';
/* Clarity module. */
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual';
/* Components. */
import { OfiLoginComponent } from './login/component';
import { OfiTwoFactorComponent } from './two-factor/component';
import { SetlLayoutModule } from '@setl/core-layout';
import { SetlLoginModule } from '@setl/core-login';

/* Decorator. */
@NgModule({
    declarations: [
        OfiLoginComponent,
        OfiTwoFactorComponent,
    ],
    exports: [
        OfiLoginComponent,
        OfiTwoFactorComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterModule,
        MultilingualModule,
        SelectModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        SetlLayoutModule,
        SetlLoginModule,
    ],
    providers: [],
})

/* Class. */
export class OfiLoginModule {

}
