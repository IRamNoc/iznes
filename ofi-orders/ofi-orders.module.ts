/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from '@setl/utils';
import {RouterModule} from '@angular/router';

/* Pipes. */
import {SetlPipesModule} from '@setl/utils';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Components. */
import {ManageOrdersComponent} from './manage-orders/manage-orders.component';
import {MyOrdersComponent} from './my-orders/my-orders.component';

/* Services. */
import {OfiOrdersService} from '../ofi-req-services/ofi-orders/service';

/* Multilingual module. */
import {MultilingualModule} from '@setl/multilingual';

/* Decorator. */
@NgModule({
    declarations: [
        ManageOrdersComponent,
        MyOrdersComponent,
    ],
    exports: [
        ManageOrdersComponent,
        MyOrdersComponent,
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
        RouterModule
    ],
    providers: [
        OfiOrdersService
    ]
})

/* Class. */
export class OfiOrdersModule {

}
