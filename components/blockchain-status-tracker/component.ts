import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'blockchain-status-tracker',
    templateUrl: './component.html',
})

export class BlockchainStatusTracker implements OnInit, OnDestroy {

    @select(['walletNode', 'transactionStatus']) transactionStatus;

    public pendingUpdate: Boolean = false;
    public successUpdate: Boolean = false;
    public pendingCount: number = 0;
    public successCount: number = 0;
    public showStatusModal: boolean = false;
    public txList: {};
    subscriptions: Subscription[] = [];
    public pageSize: number;
    objectKeys = Object.keys;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.subscriptions.push(this.transactionStatus.subscribe((transaction) => {
            // Got new data, so set txList, reset counts and update CSS classes
            this.txList = transaction;
            const oldPendingCount = this.pendingCount = 0;
            const oldSuccessCount = this.successCount = 0;
            this.pendingUpdate = false;
            this.successUpdate = false;

            // Loop over transactions and count pending and successful
            for (const hash in transaction) {
                if (!transaction[hash].success) {
                    // TX Pending
                    this.pendingCount += 1;
                } else {
                    // TX Success
                    this.successCount += 1;
                }
            }

            // Apply update CSS class if new TXs
            if (this.pendingCount > oldPendingCount) this.pendingUpdate = true;
            if (this.successCount > oldSuccessCount) this.successUpdate = true;
        }));
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsubscribe from subscriptions */
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
