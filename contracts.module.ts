import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ContractsComponent} from '@setl/core-contracts/contracts.component';
import {ClarityModule} from 'clarity-angular';

@NgModule({
    declarations: [
        ContractsComponent
    ],
    exports: [
        ContractsComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule
    ],
    providers: [
    ]
})
export class ContractsModule {
}
