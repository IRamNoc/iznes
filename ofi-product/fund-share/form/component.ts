import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import {FundShare} from '../model';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit {

    model: FundShare = new FundShare();

    constructor() {}

    ngOnInit() {}

    test() {
        console.log("getRequest()", this.model.getRequest());
    }

}