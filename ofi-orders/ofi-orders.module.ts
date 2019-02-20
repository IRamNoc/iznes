/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Utils */
import { SelectModule, DpDatePickerModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';

/* Components. */
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { PlaceOrdersComponent } from './place-orders/place-orders.component';

/* Services. */
import { OfiOrdersService } from '../ofi-req-services/ofi-orders/service';
import { SearchFilters, IFilterStore } from './manage-orders/search-filters';

/* Multilingual module. */
import { MultilingualModule } from '@setl/multilingual';
import { ManageOrdersService } from './manage-orders/manage-orders.service';
import { PaymentMsgComfirmationModal } from "./manage-orders/components/payment-msg-comfirmation-modal";

/* Decorator. */
@NgModule({
    declarations: [
        ManageOrdersComponent,
        PlaceOrdersComponent,
        PaymentMsgComfirmationModal,
    ],
    exports: [
        ManageOrdersComponent,
        PlaceOrdersComponent,
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
        RouterModule,
        DpDatePickerModule,
        SetlDirectivesModule,
    ],
    providers: [
        OfiOrdersService,
        ManageOrdersService,
        { provide: IFilterStore, useExisting: ManageOrdersService },
    ],
})

/* Class. */
export class OfiOrdersModule {
}
