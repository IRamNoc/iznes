import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';
import {SetlIssueComponent} from './issue/issue.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule
    ],
    declarations: [
        SetlBalancesComponent,
        SetlIssueComponent
    ],
    exports: [
        SetlBalancesComponent,
        SetlIssueComponent
    ]
})
export class SetlBalancesModule {
}
