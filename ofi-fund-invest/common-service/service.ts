import {Injectable} from '@angular/core';
import {FundCharacteristic} from './model';
import {immutableHelper, mDateHelper} from '@setl/utils';

@Injectable()
export class CommonService {
    static getFundCharacteristic(shareData): FundCharacteristic {

        // Cutoff
        const sCutOffOffset = immutableHelper.get(shareData, ['metaData', 'subscription_cut-off'], 0);
        const sCutoffDate = mDateHelper.addDay(new Date(), sCutOffOffset);
        const sCutoffTime = immutableHelper.get(shareData, ['metaData', 'subscription_cut-off_hour'], 0) + ':00';

        const rCutOffOffset = immutableHelper.get(shareData, ['metaData', 'redemption_cut-off'], 0);
        const rCutoffDate = mDateHelper.addDay(new Date(), rCutOffOffset);
        const rCutoffTime = immutableHelper.get(shareData, ['metaData', 'redemption_cut-off_hour'], 0) + ':00';

        // known nav
        const knownNav = Number(immutableHelper.get(shareData, ['metaData', 'known_nav'], 0)) === 1;

        // Valuation
        let sValuationDate = 0;
        let rValuationDate = 0;
        if (!knownNav) {
            const defaultValuationOffset = 1;
            sValuationDate = mDateHelper.addDay(new Date(sCutoffDate), defaultValuationOffset);
            rValuationDate = mDateHelper.addDay(new Date(rCutoffDate), defaultValuationOffset);
        } else {
            sValuationDate = (new Date()).getTime();
            rValuationDate = (new Date()).getTime();
        }
        const sValuationTime = sCutoffTime;
        const rValuationTime = rCutoffTime;


        // settlement
        const settlementDateOffset = immutableHelper.get(shareData, ['metaData', 'settlement_date'], 0);
        const sSettlementDate = mDateHelper.addDay(new Date(sCutoffDate), settlementDateOffset);

        const rSettlementDate = mDateHelper.addDay(new Date(sCutoffDate), settlementDateOffset);

        const sSettlementTime = sCutoffTime;
        const rSettlementTime = rCutoffTime;

        // fee percentage
        const entryFee = Number(immutableHelper.get(shareData, ['entryFee'], 0)) || 0;
        const sAcquiredFee = Number(immutableHelper.get(shareData, ['metaData', 'acquired_subscription_fee'], 0));

        const exitFee = Number(immutableHelper.get(shareData, ['exitFee'], 0)) || 0;
        const rAcquiredFee = Number(immutableHelper.get(shareData, ['metaData', 'acquired_redemption_fee'], 0));

        // platform fee
        const platformFee = 1;

        // allow type
        const typeDef = {
            '1': 'quantity',
            '2': 'amount',
            '3': 'both'
        };

        const sAllowTypeNum = immutableHelper.get(shareData, ['metaData', 'form_of_subscription_select'], 3);
        const sAllowType = typeDef[sAllowTypeNum];

        const rAllowTypeNum = immutableHelper.get(shareData, ['metaData', 'form_of_redemption_select'], 3);
        const rAllowType = typeDef[rAllowTypeNum];

        // decimalisation
        const decimalisation = Number(immutableHelper.get(shareData, ['metaData', 'decimalisation_select'], 0));

        // min value
        const sMinValue = Number(immutableHelper.get(shareData, ['metaData', 'min_subscription_value'], 0));

        // min unit
        const sMinUnit = Number(immutableHelper.get(shareData, ['metaData', 'min_init_subscription'], 0));

        // nav
        const nav = Number(immutableHelper.get(shareData, ['price'], 0));

        return {
            sCutoffDate,
            sCutoffTime,
            rCutoffDate,
            rCutoffTime,
            sValuationDate,
            sValuationTime,
            rValuationDate,
            rValuationTime,
            sSettlementDate,
            sSettlementTime,
            rSettlementDate,
            rSettlementTime,
            knownNav,
            entryFee,
            sAcquiredFee,
            exitFee,
            rAcquiredFee,
            platformFee,
            sAllowType,
            rAllowType,
            decimalisation,
            sMinValue,
            sMinUnit,
            nav
        };
    }

    /**
     * Calculate subscription/redemption fee.
     *
     * @param nonRequiredFee
     * @param requiredFee
     * @param platformFee
     */
    calculateInvestmentFee(amount, nonRequiredFee, requiredFee, platformFee): number {
        return amount * (nonRequiredFee + requiredFee) / 100 + platformFee;
    }

}

