
/* Core imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';
import {SetlPipesModule, DpDatePickerModule, SetlDirectivesModule} from '@setl/utils';
import {SelectModule} from 'ng2-select';

/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {ProductHomeComponent} from './home/component';
import {UmbrellaFundComponent} from './umbrella-fund/component';
import {FundShareComponent} from './fund-share/component';

import {DynamicFormComponent} from './fund-share/dynamic-form/component';
import {DynamicFormService} from './fund-share/dynamic-form/service';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';

/* Am Dashboard service. */
@NgModule({
    declarations: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        DynamicFormComponent
    ],
    exports: [
        ProductHomeComponent,
        UmbrellaFundComponent,
        FundShareComponent,
        DynamicFormComponent
    ],
    imports: [
        CommonModule,
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
    ],
    providers: []
})

export class OfiAmProductHomeModule {

}
