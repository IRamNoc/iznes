/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Components. */
import {CouponPaymentComponent} from './coupon-payment/coupon-payment.component';

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
        ClarityModule
    ],
    providers: []
})

/* Class. */
export class OfiCorpActionsModule {

}
