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
import { OfiFundShareFormService } from './fund-share/form/service';
import { FundShareTradeCycleComponent } from './fund-share/form/trade-cycle/component';
import { AddNewFundShareComponent } from './fund-share/add-new/component';
import { FundShareAuditComponent } from './fund-share/audit/component';
import { FundShareAuditService } from './fund-share/audit/service';
import { FundComponent } from './fund/component';
import { ProductCharacteristicComponent } from './characteristic/product-characteristic.component';
import { UmbrellaAuditComponent } from './umbrella-audit/umbrella-audit.component';
import {
    UmbrellaAuditDatagridComponent,
} from './umbrella-audit/umbrella-audit-datagrid/umbrella-audit-datagrid.component';
import { FundAuditComponent } from './fund-audit/fund-audit.component';
import {
    FundAuditDatagridComponent,
} from './fund-audit/fund-audit-datagrid/fund-audit-datagrid.component';
import { OfiManagementCompanyComponent } from './management-company/management-company.component';
import { ManagagementCompanyService } from './management-company/management-company.service';

/* Graphs. */
import { OfiKYCModule } from '@ofi/ofi-main/ofi-kyc/module';

/* Files */
import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';

import {
    ProductCharacteristicsService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/product-characteristics/service';
import { LeiService } from '@ofi/ofi-main/ofi-req-services/ofi-product/lei/lei.service';
import productConfig from './productConfig';
import { phoneCodeList } from '../shared/phone-codes.values';
import { WalletSwitchService } from './fund-share/service/wallet-switch.service';

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
        UmbrellaAuditComponent,
        UmbrellaAuditDatagridComponent,
        FundAuditComponent,
        FundAuditDatagridComponent,
        OfiManagementCompanyComponent,
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
        UmbrellaAuditComponent,
        UmbrellaAuditDatagridComponent,
        FundAuditComponent,
        FundAuditDatagridComponent,
        OfiManagementCompanyComponent,
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
        OfiKYCModule,
        DynamicFormsModule,
        SetlComponentsModule,
        FileViewerModule,
        FileDropModule,
    ],
    providers: [
        FundShareAuditService,
        ProductCharacteristicsService,
        OfiFundShareFormService,
        LeiService,
        ManagagementCompanyService,
        WalletSwitchService,
        { provide: 'product-config', useValue: productConfig },
        { provide: 'phoneCodeList', useValue: phoneCodeList },
    ],
})

export class OfiAmProductHomeModule {
}
