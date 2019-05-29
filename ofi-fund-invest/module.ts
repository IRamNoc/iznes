// vendor imports
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Local components
import { OfiInvestorFundListComponent } from './investor-fund-list/component';
import { InvestFundComponent } from './invest-fund/component';
import { FundViewComponent } from './fund-view/component';
import { SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule, DpDatePickerModule } from '@setl/utils';
import { CommonService } from './common-service/service';
import { FileViewerModule } from '@setl/core-fileviewer';
import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        CommonModule,
        SelectModule,
        SetlPipesModule,
        DpDatePickerModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        FileViewerModule,
        RouterModule,
        DatagridListModule,
    ],
    exports: [OfiInvestorFundListComponent],
    declarations: [
        OfiInvestorFundListComponent,
        InvestFundComponent,
        FundViewComponent,
    ],
    providers: [CommonService],
})
export class OfiFundInvestModule {
}
