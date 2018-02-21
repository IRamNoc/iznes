import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContractsComponent} from '@setl/core-contracts/contracts.component';
import {ContractsDvpComponent} from '@setl/core-contracts/dvp/dvp.component';
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
