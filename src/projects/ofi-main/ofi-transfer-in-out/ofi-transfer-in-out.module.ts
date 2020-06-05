import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTransferComponent } from './create-transfer/create-transfer.component';
import { ManageTransfersComponent } from './manage-transfers/manage-transfers.component';

@NgModule({
    imports: [
        CommonModule,
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
