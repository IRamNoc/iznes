import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsComponent } from './contracts.component';
import { ContractsDvpComponent } from './dvp/dvp.component';
import { BilateralTransferComponent } from './bilateral-transfer/bilateral-transfer.component';
import { ClarityModule } from '@clr/angular';
import {
    SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule, DatePickerExtendedModule,
    DpDatePickerModule,
} from '@setl/utils';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ContractService } from './services';
import { DVPContractService } from './dvp/dvp.service';
import { BilateralTransferService } from './bilateral-transfer/bilateral-transfer.service';

@NgModule({
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        DatePickerExtendedModule,
        DpDatePickerModule,
    ],
    declarations: [
        ContractsComponent,
        ContractsDvpComponent,
        BilateralTransferComponent,
    ],
    exports: [
        ContractsComponent,
        ContractsDvpComponent,
    ],
    providers: [
        ContractService,
        DVPContractService,
        BilateralTransferService,
    ],
})

export class ContractsModule {
}
