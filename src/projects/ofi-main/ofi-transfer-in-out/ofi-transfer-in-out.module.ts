import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTransferComponent } from './create-transfer/create-transfer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CreateTransferComponent],
  exports : [CreateTransferComponent]
})
export class OfiTransferInOutModule { }
