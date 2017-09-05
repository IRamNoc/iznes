import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlMyAccountComponent} from './myaccount/myaccount.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';
import {SetlPipesModule} from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule
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
