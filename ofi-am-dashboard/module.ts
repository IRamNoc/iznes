/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* 3rd party modules. */
import {SelectModule, SetlPipesModule} from '@setl/utils';

/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {FundHoldingsComponent} from './fund-holdings/component'
import {MyDashboardComponent} from './my-dashboard/component'

/* Graphs. */
import {ChartsModule} from 'ng2-charts';

/* Am Dashboard service. */
@NgModule({
    declarations: [
        FundHoldingsComponent,
        MyDashboardComponent
    ],
    exports: [
        FundHoldingsComponent,
        MyDashboardComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        MultilingualModule,
        ChartsModule,
    ],
    providers: []
})

export class OfiAmDashboardModule {

}
