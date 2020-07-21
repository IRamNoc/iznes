/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';

/* 3rd party modules. */
import { SelectModule, DpDatePickerModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

/* Multilingual coolness. */
import { MultilingualModule } from '@setl/multilingual';

/* Components. */
import { ShareHoldersComponent } from './share-holders/component';

/* Am Dashboard service. */
@NgModule({
    declarations: [
        ShareHoldersComponent,
    ],
    exports: [
        ShareHoldersComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        DpDatePickerModule,
        SetlDirectivesModule,
        MultilingualModule,
        RouterModule,
    ],
    providers: [],
})

export class OfiAmDashboardModule {

}
