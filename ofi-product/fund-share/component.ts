import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import { ShareListing } from './models/listing';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit {

    listing = new ShareListing();

    constructor() {}

    ngOnInit() {}

}