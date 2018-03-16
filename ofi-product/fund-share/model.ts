import * as _ from 'lodash';

import {FormItem, FormItemDropdown} from '@setl/core-dynamic-forms';
import {OfiFundShare} from '@ofi/ofi-main';
import {ShareCharacteristicMandatory, ShareCharacteristicOptional} from './models/characteristic';
import {ShareCalendarMandatory, ShareCalendarOptional} from './models/calendar';
import {ShareFeesMandatory, ShareFeesOptional} from './models/fees';
import {ShareKeyFactsMandatory, ShareKeyFactsOptional} from './models/keyFacts';
import {ShareListingOptional} from './models/listing';
import {SharePRIIPOptional} from './models/priip';
import {ShareProfileMandatory, ShareProfileOptional} from './models/profile';
import {ShareRepresentationOptional} from './models/representation';
import {ShareSolvencyOptional} from './models/solvency';
import {ShareTaxationOptional} from './models/taxation';

export class FundShare {
    fundID: number;
    accountId: number;

    calendar = {
        mandatory: new ShareCalendarMandatory(),
        optional: new ShareCalendarOptional()
    }
    characteristic = {
        mandatory: new ShareCharacteristicMandatory(),
        optional: new ShareCharacteristicOptional()
    }
    fees = {
        mandatory: new ShareFeesMandatory(),
        optional: new ShareFeesOptional()
    }
    keyFacts = {
        mandatory: new ShareKeyFactsMandatory(),
        optional: new ShareKeyFactsOptional()
    }
    listing = {
        optional: new ShareListingOptional()
    }
    priip = {
        optional: new SharePRIIPOptional()
    }
    profile = {
        mandatory: new ShareProfileMandatory(),
        optional: new ShareCharacteristicOptional()
    }
    representation = {
        optional: new ShareRepresentationOptional()
    }
    solvency = {
        optional: new ShareSolvencyOptional()
    }
    taxation = {
        optional: new ShareTaxationOptional()
    }

    constructor() {}

    isValid(): boolean {
        return this.characteristic.mandatory.isValid() && this.calendar.mandatory.isValid() &&
            this.fees.mandatory.isValid() && this.keyFacts.mandatory.isValid() && this.profile.mandatory.isValid();
    }

    getRequest(): OfiFundShare {
        const portfolioCurrencyHedgeRaw = this.characteristic.optional.portfolioCurrencyHedge.value();
        const portfolioCurrencyHedge = portfolioCurrencyHedgeRaw ? portfolioCurrencyHedgeRaw[0].id : null;
        return {
            accountId: this.accountId,
            fundShareName: this.keyFacts.mandatory.fundShareName.value(),
            fundID: this.fundID,
            isin: this.keyFacts.mandatory.isin.value(),
            shareClassCode: this.keyFacts.mandatory.shareClassCode.value()[0].id,
            shareClassInvestmentStatus: this.keyFacts.mandatory.shareClassInvestmentStatus.value()[0].id,
            shareClassCurrency: this.keyFacts.mandatory.shareClassCurrency.value()[0].id,
            valuationFrequency: this.keyFacts.mandatory.valuationFrequency.value()[0].id,
            historicOrForwardPricing: this.keyFacts.mandatory.historicOrForwardPricing.value()[0].id,
            hasCoupon: this.keyFacts.mandatory.hasCoupon.value(),
            couponType: this.keyFacts.mandatory.couponType.value()[0].id,
            freqOfDistributionDeclaration: this.keyFacts.mandatory.freqOfDistributionDeclaration.value()[0].id,
            maximumNumDecimal: this.characteristic.mandatory.maximumNumDecimal.value(),
            subscriptionCategory: this.characteristic.mandatory.subscriptionCategory.value()[0].id,
            subscriptionCurrency: this.characteristic.mandatory.subscriptionCurrency.value()[0].id,
            minInitialSubscriptionInShare: this.characteristic.mandatory.minInitialSubscriptionInShare.value(),
            minInitialSubscriptionInAmount: this.characteristic.mandatory.minInitialSubscriptionInAmount.value(),
            minSubsequentSubscriptionInShare: this.characteristic.mandatory.minSubsequentSubscriptionInShare.value(),
            minSubsequentSubscriptionInAmount: this.characteristic.mandatory.minSubsequentSubscriptionInAmount.value(),
            redemptionCategory: this.characteristic.mandatory.redemptionCategory.value()[0].id,
            redemptionCurrency: this.characteristic.mandatory.redemptionCurrency.value()[0].id,
            minInitialRedemptionInShare: this.characteristic.mandatory.minInitialRedemptionInShare.value(),
            minInitialRedemptionInAmount: this.characteristic.mandatory.minInitialRedemptionInAmount.value(),
            minSubsequentRedemptionInShare: this.characteristic.mandatory.minSubsequentRedemptionInShare.value(),
            minSubsequentRedemptionInAmount: this.characteristic.mandatory.minSubsequentRedemptionInAmount.value(),
            portfolioCurrencyHedge: portfolioCurrencyHedge,
            tradeDay: this.calendar.mandatory.tradeDay.value()[0].id,
            subscriptionCutOffTime: this.calendar.mandatory.subscriptionCutOffTime.value(),
            subscriptionCutOffTimeZone: this.calendar.mandatory.subscriptionCutOffTimeZone.value()[0].id,
            subscriptionSettlementPeriod: this.calendar.mandatory.subscriptionSettlementPeriod.value()[0].id,
            redemptionCutOffTime: this.calendar.mandatory.redemptionCutOffTime.value(),
            redemptionCutOffTimeZone: this.calendar.mandatory.redemptionCutOffTimeZone.value()[0].id,
            redemptionSettlementPeriod: this.calendar.mandatory.redemptionSettlementPeriod.value(),
            subscriptionRedemptionCalendar: this.calendar.mandatory.subscriptionRedemptionCalendar.value(),
            maxManagementFee: this.fees.mandatory.maxManagementFee.value(),
            maxSubscriptionFee: this.fees.mandatory.maxSubscriptionFee.value(),
            maxRedemptionFee: this.fees.mandatory.maxRedemptionFee.value(),
            investorProfile: this.profile.mandatory.investorProfile.value()[0].id,
            keyFactOptionalData: this.generateJSONString(this.keyFacts.optional),
            characteristicOptionalData: this.generateJSONString(this.characteristic.optional),
            calendarOptionalData: this.generateJSONString(this.calendar.optional),
            profileOptionalData: this.generateJSONString(this.profile.optional),
            priipOptionalData: this.generateJSONString(this.priip.optional),
            listingOptionalData: this.generateJSONString(this.listing.optional),
            taxationOptionalData: this.generateJSONString(this.taxation.optional),
            solvencyIIOptionalData: this.generateJSONString(this.solvency.optional),
            representationOptionalData: this.generateJSONString(this.representation.optional)
        }
    }

    private generateJSONString(model): string {
        const json = {};

        _.forEach(model, (item: FormItem, index: string) => {
            json[index] = item.value();
        });

        return JSON.stringify(json);
    }
}

export enum FundShareMode {
    Create,
    Update
}