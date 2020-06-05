import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Multilingual module. */
import { MultilingualModule } from '@setl/multilingual';

/* Utils */
import { SelectModule, DpDatePickerModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';

import { CreateTransferComponent } from './create-transfer/create-transfer.component';
import { ManageTransfersComponent } from './manage-transfers/manage-transfers.component';

@NgModule({
    imports: [
        CommonModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        ClarityModule,
        SelectModule,
        DpDatePickerModule,
        SetlDirectivesModule,
        SetlPipesModule,
        MultilingualModule,
        RouterModule,
        DpDatePickerModule,
        SetlDirectivesModule,
    ],
    declarations: [
        CreateTransferComponent,
        ManageTransfersComponent,
    ],
    exports : [
        CreateTransferComponent,
        ManageTransfersComponent,
    ],
})
export class OfiTransferInOutModule { }
