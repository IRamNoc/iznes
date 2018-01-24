import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';
import {SetlIssueComponent} from './issue/issue.component';
import {SetlTransactionsComponent} from './transactions/transactions.component';
import { ReportingService } from './reporting.service';
import { RouterModule } from '@angular/router';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';
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
