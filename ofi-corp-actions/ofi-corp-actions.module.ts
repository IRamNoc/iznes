/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Pipes. */
import { SetlPipesModule, SelectModule } from '@setl/utils';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';

/* Components. */
import { CouponPaymentComponent } from './coupon-payment/coupon-payment.component';

/* Services. */
import { OfiCorpActionService } from '../ofi-req-services/ofi-corp-actions/service';

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
        SetlPipesModule,
        RouterModule,
    ],
    providers: [
        OfiCorpActionService,
    ],
})

/* Class. */
export class OfiCorpActionsModule {

}
