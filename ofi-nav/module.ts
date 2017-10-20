// vendor imports
import {NgModule} from '@angular/core';
import {ClarityModule} from 'clarity-angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Local components
import {OfiManageOfiNavComponent} from './ofi-mangage-nav-list/component';
import {DpDatePickerModule, SelectModule, SetlPipesModule, SetlDirectivesModule, SetlServicesModule} from '@setl/utils';


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
        SetlServicesModule
    ],
    exports: [OfiManageOfiNavComponent],
    declarations: [
        OfiManageOfiNavComponent
    ],
    providers: [],
})
export class OfiNavModule {
}
