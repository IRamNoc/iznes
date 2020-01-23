import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetlBalancesComponent } from './balances/balances.component';
import { SetlIssueComponent } from './issue/issue.component';
import { SetlTransactionsComponent } from './transactions/transactions.component';
import { ReportingService } from './reporting.service';
import { EncumbranceReportComponent } from './encumbrance-report/component';
import { TransactionsStatusComponent } from './transaction-status/component';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';
import { SetlPipesModule, SetlComponentsModule, SetlDirectivesModule } from '@setl/utils';
import { MultilingualModule } from '@setl/multilingual';
import { FileViewerModule } from '@setl/core-fileviewer';
import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        MultilingualModule,
        FileViewerModule,
        SetlDirectivesModule,
        DatagridListModule,
    ],
    declarations: [
        SetlBalancesComponent,
        SetlIssueComponent,
        SetlTransactionsComponent,
        EncumbranceReportComponent,
        TransactionsStatusComponent,
    ],
    exports: [
        SetlBalancesComponent,
        SetlIssueComponent,
        SetlTransactionsComponent,
        EncumbranceReportComponent,
        TransactionsStatusComponent,
    ],
    providers: [
        ReportingService,
    ],
})
export class SetlBalancesModule {
}
