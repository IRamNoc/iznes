// vendor imports
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Local components
import { OfiNavFundsList } from './ofi-nav-funds-list/component';
import { OfiNavFundView } from './ofi-nav-fund-view/component';
import { OfiNavAuditComponent } from './ofi-nav-audit/component';
import { OfiNavAuditService } from './ofi-nav-audit/service';
import { OfiManageNavPopup } from './ofi-manage-nav-popup/component';
import { OfiManageNavPopupService } from './ofi-manage-nav-popup/service';
import { DpDatePickerModule, SelectModule, SetlPipesModule, SetlDirectivesModule, SetlServicesModule } from '@setl/utils';
import { MultilingualModule } from '@setl/multilingual';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        CommonModule,
        DpDatePickerModule,
        SelectModule,
        SetlPipesModule,
        SetlDirectivesModule,
        SetlServicesModule,
        MultilingualModule,
    ],
    exports: [
        OfiNavFundsList,
        OfiNavFundView,
        OfiManageNavPopup,
    ],
    declarations: [
        OfiNavFundsList,
        OfiNavFundView,
        OfiNavAuditComponent,
        OfiManageNavPopup,
    ],
    providers: [
        OfiNavAuditService,
        OfiManageNavPopupService,
    ],
})
export class OfiNavModule {
}
