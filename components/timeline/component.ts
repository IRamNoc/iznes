import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'timeline',
    templateUrl: './component.html',
})

export class TimelineComponent implements OnInit, OnDestroy {
    @Input() statusList: any[] = [];
    @Input() currentStatus: string = '';

    private matchedKey: Number;

    objectKeys = Object.keys;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {

    }

    ngOnInit() {
        // Get the key of the currentStatus in the statusList
        if (!this.matchedKey) {
            for (let i = 0; i < this.statusList.length; i += 1) {
                if (this.currentStatus === Object.keys(this.statusList[i])[0]) {
                    this.matchedKey = i;
                }
            }
        }

        // Set status to active after delay if key is less than or equal to matchedKey
        for (let i = 0; i < this.statusList.length; i += 1) {
            this.statusList[i].active = false;

            if (this.matchedKey >= i) {
                setTimeout(
                    () => {
                        this.statusList[i].active = true;
                        if (!this.changeDetectorRef['destroyed']) {
                            this.changeDetectorRef.detectChanges();
                        }
                    },
                    400 * i,
                );
            }
        }
    }

    ngOnDestroy() {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
