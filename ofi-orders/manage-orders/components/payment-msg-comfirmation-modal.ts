import {Component, EventEmitter, Input, Output} from "@angular/core";


@Component({
   selector: 'payment-msg-confirmation',
   template: `
       <clr-modal [(clrModalOpen)]="opened" [clrModalSize]="'lg'" [clrModalClosable]="false">
           <h3 class="modal-title"><span>{{ 'Send Payment message' | translate }}</span></h3>

           <div class="modal-body">
               <p>{{'Are you sure that you want to sending payment message for the following orders?' }}</p>

               <table class="table">
                   <thead>
                   <tr>
                       <th>{{'Order Reference' | translate}}</th>
                       <th>{{'Order Type' | translate}}</th>
                       <th>{{'ISIN' | translate}}</th>
                       <th>{{'Trade Amount' | translate}}</th>
                   </tr>
                   </thead>
                   <tbody>
                   <tr *ngFor="let order of paymentOrdersList">
                       <td>{{order.orderRef}}</td>
                       <td>{{order.orderTypeStr}}</td>
                       <td>{{order.isin}}</td>
                       <td>{{order.amountWithCost | moneyValue: 2}}</td>
                   </tr>
                   </tbody>
               </table>
               
           </div>

           <div class="modal-footer">
               <button id='cancelModalBackButton' type="button" class="btn btn-outline" (click)="closeModal()">
                   {{ 'Close' | translate }}
               </button>

               <button id='cancelModalConfirmButton' type="button" class="btn btn-primary" (click)="confirm()">
                   {{ 'Confirm' | translate }}
               </button>
           </div>
       </clr-modal>
   `
})
export class PaymentMsgComfirmationModal {
    @Input() ordersList = [];

    @Output() confirmToSend = new EventEmitter<number[]>();

    @Input() opened: boolean;
    @Output() openedChange = new EventEmitter<boolean>();

    get paymentOrdersList() {
      return this.ordersList.filter(o => o.markedForPayment.value);
    }

    closeModal() {
        this.opened = false;
        this.openedChange.emit(this.opened);
    }

    confirm(): void {
       const orderIds = this.paymentOrdersList.map(o => o.orderID);
       this.confirmToSend.next(orderIds);
    }

}
