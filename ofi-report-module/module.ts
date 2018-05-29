// vendor imports
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DpDatePickerModule} from '@setl/utils';
import {RouterModule} from '@angular/router';

// Local components
import {OfiTaxReportComponent} from './ofi-tax-report/component';
import {OfiPnlReportComponent} from './ofi-pnl-report/component';
import {OfiCollectiveArchiveComponent} from './ofi-collective-archive/component';
import {OfiCentralizationHistoryComponent} from './centralization-history/component';
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';
import {ActionDirection} from './pnlHelper/class';
import {OfiManageCsvComponent} from './ofi-csv-report/component';
import {MultilingualModule} from '@setl/multilingual';
import {CentralizationReportComponent} from './centralization/component';
import {CentralizationSelectComponent} from './centralization-select/component';

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
        SetlDirectivesModule,
        MultilingualModule,
        RouterModule,
    ],
    exports: [],
    declarations: [
        OfiTaxReportComponent,
        OfiPnlReportComponent,
        OfiCollectiveArchiveComponent,
        TxTypePipe,
        OfiManageCsvComponent,
        CentralizationReportComponent,
        OfiCentralizationHistoryComponent,
        CentralizationSelectComponent,
        TxTypePipe,
    ],
    providers: [],
})
export class OfiReportModule {
}
