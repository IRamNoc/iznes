import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ContractsComponent} from '@setl/core-contracts/contracts.component';
import {ContractsDvpComponent} from '@setl/core-contracts/dvp/dvp.component';
import {ClarityModule} from 'clarity-angular';
import {SelectModule, SetlPipesModule, SetlComponentsModule} from '@setl/utils';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule.forRoot(),
        SetlPipesModule,
        SetlComponentsModule
    ],
    declarations: [
        ContractsComponent,
        ContractsDvpComponent
    ],
    exports: [
        ContractsComponent,
        ContractsDvpComponent
    ],
    providers: [
    ]
})
export class ContractsModule {
}
