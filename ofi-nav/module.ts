// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Local components
import {OfiNavFundsList} from './ofi-nav-funds-list/component';
import {OfiManageNavView} from './ofi-manage-nav-view-mock/component';
import {OfiManageNavPopup} from './ofi-manage-nav-popup/component';
import {DpDatePickerModule, SelectModule, SetlPipesModule, SetlDirectivesModule, SetlServicesModule} from '@setl/utils';
import {MultilingualModule} from '@setl/multilingual';

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
        MultilingualModule
    ],
    exports: [
        OfiNavFundsList,
        OfiManageNavView,
        OfiManageNavPopup
    ],
    declarations: [
        OfiNavFundsList,
        OfiManageNavView,
        OfiManageNavPopup
    ],
    providers: [],
})
export class OfiNavModule {
}
