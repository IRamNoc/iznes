import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output, ElementRef, HostListener,
    EventEmitter } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { ClrDatagridSortOrder } from '@clr/angular';
import { Router } from '@angular/router';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'blockchain-status-tracker',
    templateUrl: './component.html',
})

export class BlockchainStatusTracker implements OnInit, OnDestroy {

    @Input() display: string = 'modal';
    @Input() alternate: boolean = false;
    @Output() dropdownClosed = new EventEmitter<boolean>();
    @select(['walletNode', 'transactionStatus']) transactionStatus;

    public failUpdate: Boolean = false;
    public pendingUpdate: Boolean = false;
    public successUpdate: Boolean = false;
    public pendingCount: number = 0;
    public successCount: number = 0;
    public failCount: number = 0;
    public showStatusView: boolean = false;
    public maxTransactions: boolean = false;
    public txList: {}[];
    public descSort = ClrDatagridSortOrder.DESC;
    public objectKeys = Object.keys;
    public pageSize: number = 5;

    private subscriptions: Subscription[] = [];
    private pendingTimeout: any;
    private successTimeout: any;
    private failTimeout: any;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private el: ElementRef,
        public router: Router,
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(this.transactionStatus.subscribe(
            (transaction) => {
                // Ensure transaction volume is less than 10,000 to keep UI tidy
                if (Object.keys(transaction).length > 9999) {
                    this.maxTransactions = true;
                    return;
                }

                // Got new data so clear txList, save old counts for diffs and reset counters
                this.txList = [];
                const oldFailCount = this.failCount;
                const oldPendingCount = this.pendingCount;
                const oldSuccessCount = this.successCount;
                this.failCount = 0;
                this.pendingCount = 0;
                this.successCount = 0;

                // Loop over transactions and count pending and successful
                for (const hash in transaction) {

                    // Work out counts
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

                // Apply update CSS class if new TXs detected and set 5sec timeout to remove
                if (this.failCount > oldFailCount) {
                    this.failUpdate = true;
                    clearTimeout(this.failTimeout);
                    this.failTimeout = setTimeout(
                        () => {
                            this.failUpdate = false;
                        },
                        5000,
                    );
                }
                if (this.pendingCount > oldPendingCount) {
                    this.pendingUpdate = true;
                    clearTimeout(this.pendingTimeout);
                    this.pendingTimeout = setTimeout(
                        () => {
                            this.pendingUpdate = false;
                        },
                        5000,
                    );
                }
                if (this.successCount > oldSuccessCount) {
                    this.successUpdate = true;
                    clearTimeout(this.successTimeout);
                    this.successTimeout = setTimeout(
                        () => {
                            this.successUpdate = false;
                        },
                        5000,
                    );
                }
            },
        ));
    }

    @HostListener('document:click', ['$event']) clickOutside(event) {
        if (this.display === 'dropdown') {
            if (this.el.nativeElement.contains(event.target)) return this.showStatusView = true;
            this.showStatusView = false;
        }
    }

    navigateToReport() {
        setTimeout(
            () => {
                this.showStatusView = false;
                this.dropdownClosed.emit(false);
                this.changeDetectorRef.detectChanges();
            },
            50);

        this.router.navigateByUrl('/reports/transaction-status');
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
