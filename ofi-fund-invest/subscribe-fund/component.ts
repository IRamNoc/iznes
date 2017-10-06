import {Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'app-subscribe-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SubscribeFundComponent implements OnInit {
    @Input() fundData;

    // 0: quantity, 1: amount
    _subscribeBy: number;

    selectedDate = '12-10-2017';

    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',

    };

    set subscribeBy(value) {
        this._subscribeBy = value;
    }

    get subscribeBy() {
        return this._subscribeBy;
    }


    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this._subscribeBy = 0;
    }

    ngOnInit() {
    }

}
