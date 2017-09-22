import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';
import {SetlIssueComponent} from './issue/issue.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';
import {SetlPipesModule, SetlComponentsModule} from '@setl/utils';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule
    ],
    declarations: [
        SetlBalancesComponent,
        SetlIssueComponent,
    ],
    exports: [
        SetlBalancesComponent,
        SetlIssueComponent
    ]
})
export class SetlBalancesModule {
}
