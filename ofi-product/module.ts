/* Core imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';
import {DpDatePickerModule, SetlDirectivesModule, SetlPipesModule} from '@setl/utils';
import {SelectModule} from 'ng2-select';
import {RouterModule} from '@angular/router';
import {OfiKYCModule} from '@ofi/ofi-main/ofi-kyc/module';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';


/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {ProductHomeComponent} from './home/component';
import {UmbrellaFundComponent} from './umbrella-fund/component';
import {FundCreateComponent} from './fundCreate/component';
// import {FundEditComponent} from './fundEdit/component';

/* fundItems config ( should be served by backend TT ) */
import fundItems from './fundConfig';


/* Am Dashboard service. */
@NgModule({
    declarations: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundCreateComponent,
        // FundEditComponent,
    ],
    exports: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundCreateComponent,
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
        OfiKYCModule,
    ],
    providers: [
        { provide: 'fund-items', useValue: fundItems },
    ]
})

export class OfiAmProductHomeModule {

}
