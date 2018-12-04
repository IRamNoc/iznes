import { Injectable } from '@angular/core';
import { FundCharacteristic } from './model';
import { immutableHelper, mDateHelper, NumberConverterService } from '@setl/utils';

@Injectable()
export class CommonService {
    constructor(private numberConverterService: NumberConverterService) {
    }

    getFundCharacteristic(shareData): FundCharacteristic {
        const currentTimeStamp = mDateHelper.getCurrentUnixTimestamp();

        // Cutoff
        const sCutOffOffset = Number(immutableHelper.get(shareData, ['metaData', 'subscriptionCutOff', '0', 'id'], 0));
        const sCutoffDate = mDateHelper.addDay(new Date(), sCutOffOffset);
        const sCutoffTime = immutableHelper.get(shareData, ['metaData', 'subscriptionCutOffHour', '0', 'id'], '00:00');
        const sCutoffDateStr = mDateHelper.unixTimestampToDateStr(sCutoffDate, 'YYYY-MM-DD');
        let sCutoffDateTimeStr = sCutoffDateStr + ' ' + sCutoffTime;
        let sCutoffDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(sCutoffDateTimeStr, 'YYYY-MM-DD HH:mm');
        // if current time is pass the cutoff of today. use tomorrow's cutoff.
        if (sCutoffDateTimeNumber < currentTimeStamp) {
            sCutoffDateTimeNumber = mDateHelper.addDay(new Date(sCutoffDateTimeNumber), 1);
            sCutoffDateTimeStr = mDateHelper.unixTimestampToDateStr(sCutoffDateTimeNumber, 'YYYY-MM-DD HH:mm');
        }

        const rCutOffOffset = Number(immutableHelper.get(shareData, ['metaData', 'redemptionCutOff', '0', 'id'], 0));
        const rCutoffDate = mDateHelper.addDay(new Date(), rCutOffOffset);
        const rCutoffTime = immutableHelper.get(shareData, ['metaData', 'redemptionCutOffHour', '0', 'id'], '00:00');
        const rCutoffDateStr = mDateHelper.unixTimestampToDateStr(rCutoffDate, 'YYYY-MM-DD');
        let rCutoffDateTimeStr = rCutoffDateStr + ' ' + rCutoffTime;
        let rCutoffDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(rCutoffDateTimeStr, 'YYYY-MM-DD HH:mm');
        // if current time is pass the cutoff of today. use tomorrow's cutoff.
        if (rCutoffDateTimeNumber < currentTimeStamp) {
            rCutoffDateTimeNumber = mDateHelper.addDay(new Date(rCutoffDateTimeNumber), 1);
            rCutoffDateTimeStr = mDateHelper.unixTimestampToDateStr(rCutoffDateTimeNumber, 'YYYY-MM-DD HH:mm');
        }

        // known nav
        const knownNav = immutableHelper.get(shareData, ['metaData', 'knownNav', '0', 'id'], '0') === '1';

        // Valuation
        let sValuationDate = 0;
        let rValuationDate = 0;
        if (!knownNav) {
            const defaultValuationOffset = 1;
            sValuationDate = mDateHelper.addDay(new Date(sCutoffDateTimeNumber), defaultValuationOffset);
            rValuationDate = mDateHelper.addDay(new Date(rCutoffDateTimeNumber), defaultValuationOffset);
        } else {
            sValuationDate = (new Date()).getTime();
            rValuationDate = (new Date()).getTime();
        }
        const sValuationTime = '00:00';
        const sValuationDateStr = mDateHelper.unixTimestampToDateStr(sValuationDate, 'YYYY-MM-DD');
        const sValuationDateTimeStr = sValuationDateStr + ' ' + sValuationTime;
        const sValuationDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(sValuationDateTimeStr, 'YYYY-MM-DD HH:mm');

        const rValuationTime = '00:00';
        const rValuationDateStr = mDateHelper.unixTimestampToDateStr(rValuationDate, 'YYYY-MM-DD');
        const rValuationDateTimeStr = rValuationDateStr + ' ' + rValuationTime;
        const rValuationDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(rValuationDateTimeStr, 'YYYY-MM-DD HH:mm');

        // settlement
        const settlementDateOffset = immutableHelper.get(shareData, ['metaData', 'settlementDate', '0', 'id'], 0);
        const sSettlementDate = mDateHelper.addDay(new Date(sCutoffDateTimeNumber), settlementDateOffset);

        const rSettlementDate = mDateHelper.addDay(new Date(sCutoffDateTimeNumber), settlementDateOffset);

        const sSettlementTime = '00:00';
        const rSettlementTime = '00:00';

        const sSettlementDateStr = mDateHelper.unixTimestampToDateStr(sSettlementDate, 'YYYY-MM-DD');
        const sSettlementDateTimeStr = sSettlementDateStr + ' ' + sSettlementTime;
        const sSettlementDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(sSettlementDateTimeStr, 'YYYY-MM-DD HH:mm');

        const rSettlementDateStr = mDateHelper.unixTimestampToDateStr(rSettlementDate, 'YYYY-MM-DD');
        const rSettlementDateTimeStr = rSettlementDateStr + ' ' + rSettlementTime;
        const rSettlementDateTimeNumber = mDateHelper.dateStrToUnixTimestamp(rSettlementDateTimeStr, 'YYYY-MM-DD HH:mm');

        // fee percentage
        // Force fee to be 0, for november go live
        // const entryFee = Number(immutableHelper.get(shareData, ['entryFee'], 0)) || 0;
        // const sAcquiredFee = Number(immutableHelper.get(shareData, ['metaData', 'acquired_subscription_fee'], 0));
        const entryFee = 0;
        const sAcquiredFee = 0;

        // Force fee to be 0, for november go live
        // const exitFee = Number(immutableHelper.get(shareData, ['exitFee'], 0)) || 0;
        // const rAcquiredFee = Number(immutableHelper.get(shareData, ['metaData', 'acquired_redemption_fee'], 0));
        const exitFee = 0;
        const rAcquiredFee = 0;

        // platform fee
        // Force fee to be 0, for november go live
        // const platformFee = 1;
        const platformFee = 0;

        // allow type
        const typeDef = {
            1: 'quantity',
            2: 'amount',
            3: 'both',
        };

        const sAllowTypeNum = Number(immutableHelper.get(shareData, ['metaData', 'formOfsubscription', '0', 'id'], '3'));
        const sAllowType = typeDef[sAllowTypeNum];

        const rAllowTypeNum = Number(immutableHelper.get(shareData, ['metaData', 'formOfRedemption', '0', 'id'], '3'));
        const rAllowType = typeDef[rAllowTypeNum];

        // decimalisation
        const decimalisation = Number(immutableHelper.get(shareData, ['metaData', 'decimalisation', '0', 'id'], '0'));

        // min value
        const sMinValue = Number(immutableHelper.get(shareData, ['metaData', 'minSubscriptionvalue'], 0));

        // min unit
        const sMinUnit = Number(immutableHelper.get(shareData, ['metaData', 'minInitSubscription'], 0));

        // nav
        const nav = this.numberConverterService.toFrontEnd(Number(immutableHelper.get(shareData, ['price'], 0)));

        return {
            sCutOffOffset,
            sCutoffTime,
            sCutoffDateTimeStr,
            sCutoffDateTimeNumber,
            rCutOffOffset,
            rCutoffTime,
            rCutoffDateTimeStr,
            rCutoffDateTimeNumber,
            sValuationTime,
            sValuationDateTimeStr,
            sValuationDateTimeNumber,
            rValuationTime,
            rValuationDateTimeStr,
            rValuationDateTimeNumber,
            settlementDateOffset,
            sSettlementTime,
            sSettlementDateTimeStr,
            sSettlementDateTimeNumber,
            rSettlementTime,
            rSettlementDateTimeStr,
            rSettlementDateTimeNumber,
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
            nav,
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
