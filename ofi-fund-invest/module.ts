// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Local components
import {OfiInvestorFundListComponent} from './investor-fund-list/component';
import {SelectModule} from '@setl/utils';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        CommonModule,
        SelectModule
    ],
    exports: [OfiInvestorFundListComponent],
    declarations: [OfiInvestorFundListComponent],
    providers: [],
})
export class OfiFundInvestModule {
}
