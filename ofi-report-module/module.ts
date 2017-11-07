// vendor imports
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from '@setl/utils';

// Local components
import {OfiTaxReportComponent} from './ofi-tax-report/component';
import {OfiPnlReportComponent} from './ofi-pnl-report/component';
import {OfiCollectiveArchiveComponent} from './ofi-collective-archive/component';
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';
import {ActionDirection} from './pnlHelper/class';
import {OfiManageCsvComponent} from "./ofi-csv-report/component";

@Pipe({name: 'txType'})
export class TxTypePipe implements PipeTransform {
    transform(value: number): string {
        if (value === ActionDirection.REDEMPTION) {
            return 'Redemption';
        } else if (value === ActionDirection.SUBSCRIPTION) {
            return 'Subscription';
        } else {
            return 'Unknown';
        }
    }
}

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
    declarations: [OfiTaxReportComponent, OfiPnlReportComponent, OfiCollectiveArchiveComponent, TxTypePipe, OfiManageCsvComponent],
    providers: [],
})
export class OfiReportModule {
}
