// Vendor imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { SelectModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

// Local components
import { ManageChainMembershipComponent } from './manage-chain-membership/component';
import { ManageAccountComponent } from './manage-account/component';
import { ManageMemberComponent } from './manage-member/component';
import { ManageChainsComponent } from './manage-chains/chains.component';
import { ManageWalletNodesComponent } from './manage-wallet-nodes/component';
import { MultilingualModule } from '@setl/multilingual';
import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

@NgModule({
    imports: [
        // Vendor modules
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        CommonModule,
        SelectModule,
        MultilingualModule,
        SetlPipesModule,
        SetlDirectivesModule,
        DatagridListModule,
    ],
    exports: [],
    declarations: [
        // Local components
        ManageAccountComponent,
        ManageMemberComponent,
        ManageChainMembershipComponent,
        ManageChainsComponent,
        ManageWalletNodesComponent,
    ],
    providers: [],
})
export class CoreManageMemberModule {
}
