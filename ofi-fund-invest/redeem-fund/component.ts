import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
    selector: 'app-redeem-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RedeemFundComponent implements OnInit {
    @Input() fundData;

    constructor() {
    }

    ngOnInit() {
    }
}
