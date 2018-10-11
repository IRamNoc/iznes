import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetlMyAccountComponent } from './myaccount/myaccount.component';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { RouterModule } from '@angular/router';
import { SetlLoginModule } from '@setl/core-login';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';
import { SetlPipesModule } from '@setl/utils';
import { SelectModule } from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        MultilingualModule,
        RouterModule,
        SetlLoginModule,
    ],
    declarations: [
        SetlMyAccountComponent,
    ],
    exports: [
        SetlMyAccountComponent,
    ],
})
export class SetlAccountModule {
}
