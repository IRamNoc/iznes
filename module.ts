// Vendor imports
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {SelectModule} from '@setl/utils';

// Local components
import {ManageChainMembershipComponent} from './manage-chain-membership/component';
import {ManageAccountComponent} from './manage-account/component';
import {ManageMemberComponent} from './manage-member/component';

@NgModule({
    imports: [
        // Vendor modules
        FormsModule, ReactiveFormsModule, ClarityModule, CommonModule, SelectModule],
    exports: [],
    declarations: [
        // Local components
        ManageAccountComponent, ManageMemberComponent, ManageChainMembershipComponent],
    providers: [],
})
export class CoreManageMemberModule {
}
