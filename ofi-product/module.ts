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
import {FundComponent} from './fund/component';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';
import {OfiKYCModule} from '@ofi/ofi-main/ofi-kyc/module';

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
        FundComponent
    ],
    exports: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        FundShareTradeCycleComponent,
        AddNewFundShareComponent,
        FundComponent
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
        { provide: 'product-config', useValue: productConfig },
    ]
})

export class OfiAmProductHomeModule {

}
