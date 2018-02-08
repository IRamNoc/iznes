import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ContractsComponent} from './contracts.component';
import {ContractsDvpComponent} from './dvp/dvp.component';
import {ClarityModule} from '@clr/angular';
import {SelectModule, SetlPipesModule, SetlComponentsModule} from '@setl/utils';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {ContractService} from './services';
import {DVPContractService} from './dvp/dvp.service';

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
        ContractService,
        DVPContractService
    ]
})

export class ContractsModule {
}
