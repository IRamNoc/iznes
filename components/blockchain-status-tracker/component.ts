import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { ClrDatagridSortOrder } from '@clr/angular';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'blockchain-status-tracker',
    templateUrl: './component.html',
})

export class BlockchainStatusTracker implements OnInit, OnDestroy {

    @select(['walletNode', 'transactionStatus']) transactionStatus;

    public failUpdate: Boolean = false;
    public pendingUpdate: Boolean = false;
    public successUpdate: Boolean = false;
    public pendingCount: number = 0;
    public successCount: number = 0;
    public failCount: number = 0;
    public showStatusModal: boolean = false;
    public txList: {}[];
    subscriptions: Subscription[] = [];
    public descSort = ClrDatagridSortOrder.DESC;
    public objectKeys = Object.keys;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.subscriptions.push(this.transactionStatus.subscribe((transaction) => {
            // Ensure transaction volume is less than 10,000
            if (Object.keys(transaction).length > 9999) return;

            // Got new data so clear txList, reset counts and update CSS classes
            this.txList = [];
            const oldFailCount = this.failCount = 0;
            const oldPendingCount = this.pendingCount = 0;
            const oldSuccessCount = this.successCount = 0;
            this.failUpdate = false;
            this.pendingUpdate = false;
            this.successUpdate = false;

            // Loop over transactions and count pending and successful
            for (const hash in transaction) {
                if (!transaction[hash].success && !transaction[hash].fail) this.pendingCount += 1; // TX Pending
                if (transaction[hash].success) this.successCount += 1; // TX Success
                if (transaction[hash].fail) this.failCount += 1; // TX Fail

                // Tidy request obj
                delete transaction[hash].request.updated;
                delete transaction[hash].request.height;

                // Push to the txList
                this.txList.push({
                    hash,
                    success: transaction[hash].success,
                    fail: transaction[hash].fail,
                    request: transaction[hash].request,
                    date: transaction[hash].dateRequested,
                });
            }

            // Apply update CSS class if new TXs
            if (this.failCount > oldFailCount) this.failUpdate = true;
            if (this.pendingCount > oldPendingCount) this.pendingUpdate = true;
            if (this.successCount > oldSuccessCount) this.successUpdate = true;
        }));
    }

    ngOnInit() {
    }

    formatText(text) {
        const string = String(text);
        if (String(text).length > 18) {
            return `${string.substring(0, 15)}...`;
        }
        return string;
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
