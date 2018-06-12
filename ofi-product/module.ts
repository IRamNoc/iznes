/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';
import {
    DpDatePickerModule,
    SetlDirectivesModule,
    SetlPipesModule,
    DynamicFormsModule,
    SetlComponentsModule,
} from '@setl/utils';
import { RouterModule } from '@angular/router';

/* Multilingual coolness. */
import { MultilingualModule } from '@setl/multilingual';

/* Components. */
import { ProductHomeComponent } from './home/component';
import { ProductConfigurationComponent } from './configuration/component';
import { UmbrellaFundComponent } from './umbrella-fund/component';
import { FundShareComponent } from './fund-share/form/component';
import { FundShareTradeCycleComponent } from './fund-share/form/trade-cycle/component';
import { AddNewFundShareComponent } from './fund-share/add-new/component';
import { FundShareAuditComponent } from './fund-share/audit/component';
import { FundShareAuditService } from './fund-share/audit/service';
import { FundComponent } from './fund/component';
import { ProductCharacteristicComponent } from './characteristic/product-characteristic.component';

/* Graphs. */
import { ChartsModule } from 'ng2-charts';
import { OfiKYCModule } from '@ofi/ofi-main/ofi-kyc/module';

/* Files */
import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';

import {
    ProductCharacteristicsService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/product-characteristics/service';
import productConfig from './productConfig';

/* Am Dashboard service. */
@NgModule({
    declarations: [
        ProductHomeComponent,
        ProductConfigurationComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        FundShareTradeCycleComponent,
        AddNewFundShareComponent,
        FundShareAuditComponent,
        FundComponent,
        ProductCharacteristicComponent,
    ],
    exports: [
        ProductHomeComponent,
        ProductConfigurationComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        FundShareTradeCycleComponent,
        AddNewFundShareComponent,
        FundShareAuditComponent,
        FundComponent,
        ProductCharacteristicComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        DpDatePickerModule,
        SetlDirectivesModule,
        SetlPipesModule,
        MultilingualModule,
        ChartsModule,
        OfiKYCModule,
        DynamicFormsModule,
        SetlComponentsModule,
        FileViewerModule,
        FileDropModule,
    ],
    providers: [
        FundShareAuditService,
        ProductCharacteristicsService,
        { provide: 'product-config', useValue: productConfig },
    ],
})

export class OfiAmProductHomeModule {

}
