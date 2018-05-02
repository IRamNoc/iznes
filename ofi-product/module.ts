/* Core imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';
import {DpDatePickerModule, SetlDirectivesModule, SetlPipesModule, DynamicFormsModule, SetlComponentsModule} from '@setl/utils';
import {RouterModule} from '@angular/router';

/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {ProductHomeComponent} from './home/component';
import {UmbrellaFundComponent} from './umbrella-fund/component';
import {FundShareComponent} from './fund-share/form/component';
import {FundShareTradeCycleComponent} from './fund-share/form/trade-cycle/component';
import {AddNewFundShareComponent} from './fund-share/add-new/component';
import {FundShareAuditComponent} from './fund-share/audit/component';
import {FundShareAuditService} from './fund-share/audit/service';
import {FundComponent} from './fund/component';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';
import {OfiKYCModule} from '@ofi/ofi-main/ofi-kyc/module';

/* Files */
import {FileDropModule} from '@setl/core-filedrop';
import {FileViewerModule} from '@setl/core-fileviewer';

/* product config: select items, validators, countries, currencies ( should be served by backend :( ) */
import productConfig from './productConfig';


/* Am Dashboard service. */
@NgModule({
    declarations: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        FundShareTradeCycleComponent,
        AddNewFundShareComponent,
        FundShareAuditComponent,
        FundComponent
    ],
    exports: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        FundShareTradeCycleComponent,
        AddNewFundShareComponent,
        FundShareAuditComponent,
        FundComponent,
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
        SetlComponentsModule
    ],
    providers: [
        FundShareAuditService,
        { provide: 'product-config', useValue: productConfig },
    ]
})

export class OfiAmProductHomeModule {

}
