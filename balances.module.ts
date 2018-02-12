import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';
import {SetlIssueComponent} from './issue/issue.component';
import {SetlTransactionsComponent} from './transactions/transactions.component';
import { ReportingService } from './reporting.service';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';
import {SetlPipesModule, SetlComponentsModule} from '@setl/utils';
import {MultilingualModule} from '@setl/multilingual';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        MultilingualModule
    ],
    declarations: [
        SetlBalancesComponent,
        SetlIssueComponent,
        SetlTransactionsComponent
    ],
    exports: [
        SetlBalancesComponent,
        SetlIssueComponent,
        SetlTransactionsComponent
    ],
    providers: [
        ReportingService
    ]
})
export class SetlBalancesModule {
}
