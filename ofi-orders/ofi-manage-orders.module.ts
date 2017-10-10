/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from '@setl/utils';

/* Pipes. */
import {SetlPipesModule} from '@setl/utils';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Components. */
import {ManageOrdersComponent} from './manage-orders/manage-orders.component';

/* Services. */
import {OfiManageOrdersService} from '../ofi-req-services/ofi-manage-orders/service';

/* Decorator. */
@NgModule({
    declarations: [
        ManageOrdersComponent,
    ],
    exports: [
        ManageOrdersComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        SetlPipesModule
    ],
    providers: [
        OfiManageOrdersService
    ]
})

/* Class. */
export class OfiManageOrdersModule {

}
