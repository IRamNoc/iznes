import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { NumberConverterService } from '@setl/utils';
import { FundShareAuditDetail } from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-audit';
import * as Models from '../models';

@Injectable()
export class FundShareAuditService {

    private static modelsArr: any[] = [
        new Models.ShareCalendarSubscriptionMandatory(),
        new Models.ShareCalendarRedemptionMandatory(),
        new Models.ShareCharacteristicMandatory(),
        new Models.ShareFeesMandatory(),
        new Models.ShareFeesOptional(),
        new Models.ShareKeyFactsMandatory(),
        new Models.ShareKeyFactsOptional(),
        new Models.ShareListingOptional(),
        new Models.SharePRIIPOptional(),
        new Models.ShareProfileMandatory(),
        new Models.ShareProfileOptional(),
        new Models.ShareRepresentationOptional(),
        new Models.ShareSolvencyOptional(),
        new Models.ShareTaxationOptional(),
    ];

    constructor(private numberConverterService: NumberConverterService) {}

    processAuditData(data: FundShareAuditDetail[]): FundShareAuditDetail[] {
        _.forEach(data, (item: FundShareAuditDetail) => {
            this.checkForBlockchainNumbers(item);
            this.getRealFieldName(item);
        });

        return data;
    }

    private getRealFieldName(item: FundShareAuditDetail): void {
        _.forEach(FundShareAuditService.modelsArr, (model) => {
            let found = false;

            _.forEach(Object.keys(model), (key: string) => {
                if (key.toLowerCase() === item.field.toLowerCase()) {
                    //item.mltag = model[item.field].mltag;
                    //item.field = model[item.field].label;
                    found = true;
                    return false;
                }
            });

            if (found) return false;
        });
    }

    private checkForBlockchainNumbers(item: FundShareAuditDetail): void {
        _.forEach(FundShareAuditService.modelsArr, (model) => {
            let found = false;

            _.forEach(Object.keys(model), (key: string) => {
                if ((key.toLowerCase() === item.field.toLowerCase()) &&
                    ((model[key]) && model[key].isBlockchainValue === true)) {

                    item.oldValue = this.numberConverterService.toFrontEnd(item.oldValue);
                    item.newValue = this.numberConverterService.toFrontEnd(item.newValue);

                    found = true;

                    return false;
                }
            });

            if (found) return false;
        });
    }
}
