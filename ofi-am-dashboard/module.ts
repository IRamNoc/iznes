/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';

/* 3rd party modules. */
import {SelectModule, DpDatePickerModule, SetlDirectivesModule, SetlPipesModule} from '@setl/utils';

/* Multilingual coolness. */
import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {FundHoldingsComponent} from './fund-holdings/component';
import {MyDashboardComponent} from './my-dashboard/component';
import {ShareHoldersComponent} from './share-holders/component';

/* Graphs. */
import {ChartsModule} from 'ng2-charts';

/* Am Dashboard service. */
@NgModule({
    declarations: [
        FundHoldingsComponent,
        MyDashboardComponent,
        ShareHoldersComponent,
    ],
    exports: [
        FundHoldingsComponent,
        MyDashboardComponent,
        ShareHoldersComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        DpDatePickerModule,
        SetlDirectivesModule,
        MultilingualModule,
        ChartsModule,
        RouterModule,
    ],
    providers: []
})

export class OfiAmDashboardModule {

}
