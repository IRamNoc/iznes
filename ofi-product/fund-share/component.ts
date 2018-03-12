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
    calendarMandatory = new models.ShareCalendarMandatory();
    feesMandatory = new models.ShareFeesMandatory();
    feesOptional = new models.ShareFeesOptional();
    listingOptional = new models.ShareListingOptional();
    priipOptional = new models.SharePRIIPOptional();
    profileMandatory = new models.ShareProfileMandatory();
    profileOptional = new models.ShareProfileOptional();
    representationOptional = new models.ShareRepresentationOptional();
    solvencyOptional = new models.ShareSolvencyOptional();
    taxationOptional = new models.ShareTaxationOptional();

    constructor() {}

    ngOnInit() {}

}