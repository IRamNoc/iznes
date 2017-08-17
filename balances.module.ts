import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule
    ],
    declarations: [
        SetlBalancesComponent
    ],
    exports: [
        SetlBalancesComponent
    ]
})
export class SetlBalancesModule {
}
