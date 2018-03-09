import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import * as models from './models';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit {

    keyFactsMandatory = new models.ShareKeyFactsMandatory();
    keyFactsOptional = new models.ShareKeyFactsOptional();
    characteristicsMandatory = new models.ShareCharacteristicMandatory();
    characteristicsOptional = new models.ShareCharacteristicOptional();
    // calendar = new models.S();
    feesMandatory = new models.ShareFeesMandatory();
    feesOptional = new models.ShareFeesOptional();
    listing = new models.ShareListing();

    constructor() {}

    ngOnInit() {}

}