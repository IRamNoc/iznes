/* Core imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';
import {DpDatePickerModule, SetlDirectivesModule, SetlPipesModule} from '@setl/utils';
import {SelectModule} from 'ng2-select';
import {CoreDynamicFormsModule} from '@setl/core-dynamic-forms';
import {RouterModule} from '@angular/router';

/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {ProductHomeComponent} from './home/component';
import {UmbrellaFundComponent} from './umbrella-fund/component';
import {FundShareComponent} from './fund-share/form/component';
import {AddNewFundShareComponent} from './fund-share/add-new/component';
import {FundComponent} from './fund/component';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';
import {OfiKYCModule} from '@ofi/ofi-main/ofi-kyc/module';

/* fundItems config ( should be served by backend TT ) */
import fundItems from './fundConfig';


/* Am Dashboard service. */
@NgModule({
    declarations: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        AddNewFundShareComponent,
        FundComponent
    ],
    exports: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
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
        SelectModule,
        DpDatePickerModule,
        SetlDirectivesModule,
        SetlPipesModule,
        MultilingualModule,
        ChartsModule,
        CoreDynamicFormsModule,
        OfiKYCModule
    ],
    providers: [
        { provide: 'fund-items', useValue: fundItems },
    ]
})

export class OfiAmProductHomeModule {

}
