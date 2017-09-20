import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SetlFundComponent} from './fund/fund.component';
import {ShareComponent} from './fund/share.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';
import {SetlPipesModule} from '@setl/utils';
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SetlPipesModule,
        SelectModule,
        ClarityModule,
    ],
    declarations: [
        SetlFundComponent,
        ShareComponent,
    ],
    exports: [
        SetlFundComponent,
        ShareComponent,
    ]
})
export class SetlProductModule {}
