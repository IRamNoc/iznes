// vendor imports
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Local components
import { OfiTaxReportComponent } from './ofi-tax-report/component';
import { OfiPnlReportComponent } from './ofi-pnl-report/component';
import { SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule, DpDatePickerModule } from '@setl/utils';
import { ActionDirection } from './pnlHelper/class';
import { OfiManageCsvComponent } from './ofi-csv-report/component';
import { MultilingualModule } from '@setl/multilingual';
import { CentralisationReportComponent } from './centralisation/component';
import { PrecentralisationReportComponent } from './precentralisation/component';
import { MyHoldingsComponent } from './my-holdings/component';

@Pipe({ name: 'txType' })
export class TxTypePipe implements PipeTransform {
    transform(value: number): string {
        if (value === ActionDirection.REDEMPTION) {
            return 'Redemption';
        }

        if (value === ActionDirection.SUBSCRIPTION) {
            return 'Subscription';
        }

        return 'Unknown';
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
        NgxChartsModule,
    ],
    exports: [],
    declarations: [
        OfiTaxReportComponent,
        OfiPnlReportComponent,
        TxTypePipe,
        OfiManageCsvComponent,
        CentralisationReportComponent,
        PrecentralisationReportComponent,
        MyHoldingsComponent,
        TxTypePipe,
    ],
    providers: [],
})
export class OfiReportModule {
}
