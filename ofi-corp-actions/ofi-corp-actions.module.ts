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
import {CouponPaymentComponent} from './coupon-payment/coupon-payment.component';

/* Services. */
import {OfiCorpActionService} from '../ofi-req-services/ofi-corp-actions/service';

/* Decorator. */
@NgModule({
    declarations: [
        CouponPaymentComponent,
    ],
    exports: [
        CouponPaymentComponent,
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
        OfiCorpActionService
    ]
})

/* Class. */
export class OfiCorpActionsModule {

}
