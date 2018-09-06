import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'blockchain-status-tracker',
    templateUrl: './component.html',
})

export class BlockchainStatusTracker implements OnInit, OnDestroy {

    public pendingUpdate: Boolean = false;
    public successUpdate: Boolean = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        setTimeout(
            () => {
                this.pendingUpdate = true;
            },
            500,
        );
        this.successUpdate = true;

        setTimeout(
            () => {
                this.pendingUpdate = false;
                this.successUpdate = true;
            },
            3000,
        );
    }

    ngOnDestroy() {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
