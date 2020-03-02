// vendor imports
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Local components
import { SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule, DpDatePickerModule } from '@setl/utils';
import { OfiManageCsvComponent } from './ofi-csv-report/component';
import { MultilingualModule } from '@setl/multilingual';
import { CentralisationReportComponent } from './centralisation/component';
import { PrecentralisationReportComponent } from './precentralisation/component';
import { MyHoldingsComponent } from './my-holdings/component';

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
        OfiManageCsvComponent,
        CentralisationReportComponent,
        PrecentralisationReportComponent,
        MyHoldingsComponent,
    ],
    providers: [],
})
export class OfiReportModule {
}
