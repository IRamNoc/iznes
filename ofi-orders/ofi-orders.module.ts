/* Core/Angular imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule, DpDatePickerModule, SetlDirectivesModule} from '@setl/utils';
import {RouterModule} from '@angular/router';

/* Pipes. */
import {SetlPipesModule} from '@setl/utils';

/* Clarity module. */
import {ClarityModule} from '@clr/angular';

/* Components. */
import {ManageOrdersComponent} from './manage-orders/manage-orders.component';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {PlaceOrdersComponent} from './place-orders/place-orders.component';

/* Services. */
import {OfiOrdersService} from '../ofi-req-services/ofi-orders/service';

/* Multilingual module. */
import {MultilingualModule} from '@setl/multilingual';

/* Decorator. */
@NgModule({
    declarations: [
        ManageOrdersComponent,
        MyOrdersComponent,
        PlaceOrdersComponent
    ],
    exports: [
        ManageOrdersComponent,
        MyOrdersComponent,
        PlaceOrdersComponent
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
        RouterModule,
        DpDatePickerModule,
        SetlDirectivesModule
    ],
    providers: [
        OfiOrdersService
    ]
})

/* Class. */
export class OfiOrdersModule {

}
