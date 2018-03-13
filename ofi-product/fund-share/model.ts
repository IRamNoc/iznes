import * as _ from 'lodash';

import {FormItem, FormItemDropdown} from '@setl/core-dynamic-forms';
import {ShareCharacteristicMandatory, ShareCharacteristicOptional} from './models/characteristic';
import {ShareCalendarMandatory} from './models/calendar';
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

    calendar = {
        mandatory: new ShareCalendarMandatory()
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

    getRequest(): FundShareRequestResponse {
        return {
            fundShareName: this.keyFacts.mandatory.fundShareName.value(),
            fundID: this.fundID,
            isin: this.keyFacts.mandatory.isin.value(),
            shareClassCode: this.keyFacts.mandatory.shareClassCode.value(),
            shareClassInvestmentStatus: this.keyFacts.mandatory.shareClassInvestmentStatus.value(),
            shareClassCurrency: this.keyFacts.mandatory.shareClassCurrency.value(),
            valuationFrequency: this.keyFacts.mandatory.valuationFrequency.value(),
            historicOrForwardPricing: this.keyFacts.mandatory.historicOrForwardPricing.value(),
            hasCoupon: this.keyFacts.mandatory.hasCoupon.value(),
            couponType: this.keyFacts.mandatory.couponType.value(),
            freqOfDistributionDeclaration: this.keyFacts.mandatory.freqOfDistributionDeclaration.value(),
            maximumNumDecimal: this.characteristic.mandatory.maximumNumDecimal.value(),
            subscriptionCategory: this.characteristic.mandatory.subscriptionCategory.value(),
            subscriptionCurrency: this.characteristic.mandatory.subscriptionCurrency.value(),
            minInitialSubscriptionInShare: this.characteristic.mandatory.minInitialSubscriptionInShare.value(),
            minInitialSubscriptionInAmount: this.characteristic.mandatory.minInitialSubscriptionInAmount.value(),
            minSubsequentSubscriptionInShare: this.characteristic.mandatory.minSubsequentSubscriptionInShare.value(),
            minSubsequentSubscriptionInAmount: this.characteristic.mandatory.minSubsequentSubscriptionInAmount.value(),
            redemptionCategory: this.characteristic.mandatory.redemptionCategory.value(),
            redemptionCurrency: this.characteristic.mandatory.redemptionCurrency.value(),
            minInitialRedemptionInShare: this.characteristic.mandatory.minInitialRedemptionInShare.value(),
            minInitialRedemptionInAmount: this.characteristic.mandatory.minInitialRedemptionInAmount.value(),
            minSubsequentRedemptionInShare: this.characteristic.mandatory.minSubsequentRedemptionInShare.value(),
            minSubsequentRedemptionInAmount: this.characteristic.mandatory.minSubsequentRedemptionInAmount.value(),
            portfolioCurrencyHedge: this.characteristic.optional.portfolioCurrencyHedge.value(),
            tradeDay: this.calendar.mandatory.tradeDay.value(),
            subscriptionCutOffTime: this.calendar.mandatory.subscriptionCutOffTime.value(),
            subscriptionCutOffTimeZone: this.calendar.mandatory.subscriptionCutOffTimeZone.value(),
            subscriptionSettlementPeriod: this.calendar.mandatory.subscriptionSettlementPeriod.value(),
            redemptionCutOffTime: this.calendar.mandatory.redemptionCutOffTime.value(),
            redemptionCutOffTimeZone: this.calendar.mandatory.redemptionCutOffTimeZone.value(),
            redemptionSettlementPeriod: this.calendar.mandatory.redemptionSettlementPeriod.value(),
            subscriptionRedemptionCalendar: this.calendar.mandatory.subscriptionRedemptionCalendar.value(),
            maxManagementFee: this.fees.mandatory.maxManagementFee.value(),
            maxSubscriptionFee: this.fees.mandatory.maxSubscriptionFee.value(),
            maxRedemptionFee: this.fees.mandatory.maxRedemptionFee.value(),
            investorProfile: this.profile.mandatory.investorProfile.value(),
            keyFactOptionalData: this.generateJSONString(this.keyFacts.optional),
            characteristicOptionalData: this.generateJSONString(this.characteristic.optional),
            calendarOptionalData: '',
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

interface FundShareRequestResponse {
    fundShareName: string;
    fundID: number;
    isin: string;
    shareClassCode: number;
    shareClassInvestmentStatus: number;
    shareClassCurrency: number;
    valuationFrequency: number;
    historicOrForwardPricing: number;
    hasCoupon: number;
    couponType: number;
    freqOfDistributionDeclaration: number;
    maximumNumDecimal: number;
    subscriptionCategory: number;
    subscriptionCurrency: number;
    minInitialSubscriptionInShare: number;
    minInitialSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    redemptionCategory: number;
    redemptionCurrency: number;
    minInitialRedemptionInShare: number;
    minInitialRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    portfolioCurrencyHedge: number;
    tradeDay: number;
    subscriptionCutOffTime: string;
    subscriptionCutOffTimeZone: number;
    subscriptionSettlementPeriod: number;
    redemptionCutOffTime: string;
    redemptionCutOffTimeZone: number;
    redemptionSettlementPeriod: number;
    subscriptionRedemptionCalendar: string;
    maxManagementFee: number;
    maxSubscriptionFee: number;
    maxRedemptionFee: number;
    investorProfile: number;
    keyFactOptionalData: string;
    characteristicOptionalData: string;
    calendarOptionalData: string;
    profileOptionalData: string;
    priipOptionalData: string;
    listingOptionalData: string;
    taxationOptionalData: string;
    solvencyIIOptionalData: string;
    representationOptionalData: string;
}