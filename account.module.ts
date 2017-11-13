import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SetlMyAccountComponent} from './myaccount/myaccount.component';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';
import {SetlPipesModule} from '@setl/utils';
import {SelectModule} from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        MultilingualModule
    ],
    declarations: [
        SetlMyAccountComponent,
    ],
    exports: [
        SetlMyAccountComponent,
    ]
})
export class SetlAccountModule {
}
