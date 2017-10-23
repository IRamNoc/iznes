// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from '@setl/utils';

// Local components
import {OfiTaxReportComponent} from './ofi-tax-report/component';
import {OfiPnlReportComponent} from './ofi-pnl-report/component';
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';


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
    exports: [],
    declarations: [OfiTaxReportComponent, OfiPnlReportComponent],
    providers: [],
})
export class OfiReportModule {
}
