// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from '@setl/utils';

// Local components
import {OfiInvestorFundListComponent} from './investor-fund-list/component';
import {InvestFundComponent} from './invest-fund/component';
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';
import {CommonService} from './common-service/service';


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
        SetlDirectivesModule
    ],
    exports: [OfiInvestorFundListComponent],
    declarations: [
        OfiInvestorFundListComponent,
        InvestFundComponent
    ],
    providers: [CommonService],
})
export class OfiFundInvestModule {
}
