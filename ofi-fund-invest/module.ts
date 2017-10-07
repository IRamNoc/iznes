// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from '@setl/utils';

// Local components
import {OfiInvestorFundListComponent} from './investor-fund-list/component';
import {RedeemFundComponent} from './redeem-fund/component';
import {SubscribeFundComponent} from './subscribe-fund/component';
import {SelectModule, SetlPipesModule, SetlComponentsModule, MoneyValuePipe, SetlDirectivesModule} from '@setl/utils';


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
        RedeemFundComponent,
        SubscribeFundComponent
    ],
    providers: [MoneyValuePipe],
})
export class OfiFundInvestModule {
}
