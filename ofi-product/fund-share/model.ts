import * as _ from 'lodash';

import {FormItem, FormItemDropdown, FormItemType} from '@setl/utils';
import {OfiFundShare, OfiFundShareDocuments} from '@ofi/ofi-main';
import * as FundShareEnum from './FundShareEnum';
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
import {ShareDocumentsMandatory, ShareDocumentsOptional} from './models/documents';
import {FundShareTradeCycleModel} from './form/trade-cycle/model';

export {PanelData} from './models/panelData';

export class FundShare {
    fundID: number;
    fundShareId: number;
    accountId: number;

    calendar = {
        mandatory: new ShareCalendarMandatory(),
        subscriptionTradeCycle: null,
        redemptionTradeCycle: null,
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
    documents = {
        mandatory: new ShareDocumentsMandatory(),
        optional: new ShareDocumentsOptional()
    }

    constructor() {}

    isValid(): boolean {
        return this.characteristic.mandatory.isValid() && this.calendar.mandatory.isValid() &&
            this.calendar.subscriptionTradeCycle.isValid() && this.calendar.redemptionTradeCycle.isValid() &&
            this.fees.mandatory.isValid() && this.keyFacts.mandatory.isValid() && this.profile.mandatory.isValid();
    }

    getRequest(): OfiFundShare {
        const portfolioCurrencyHedgeRaw = this.characteristic.optional.portfolioCurrencyHedge.value();
        const portfolioCurrencyHedge = portfolioCurrencyHedgeRaw ? portfolioCurrencyHedgeRaw[0].id : null;
        
        return {
            accountId: this.accountId,
            fundShareName: this.keyFacts.mandatory.fundShareName.value(),
            fundShareID: this.fundShareId,
            fundID: this.fundID,
            isin: this.keyFacts.mandatory.isin.value(),
            shareClassCode: this.keyFacts.mandatory.shareClassCode.value()[0].id,
            shareClassInvestmentStatus: this.keyFacts.mandatory.shareClassInvestmentStatus.value()[0].id,
            subscriptionStartDate: this.keyFacts.mandatory.subscriptionStartDate.value(),
            launchDate: this.keyFacts.mandatory.launchDate.value(),
            shareClassCurrency: this.keyFacts.mandatory.shareClassCurrency.value()[0].id,
            valuationFrequency: this.keyFacts.mandatory.valuationFrequency.value()[0].id,
            historicOrForwardPricing: this.keyFacts.mandatory.historicOrForwardPricing.value()[0].id,
            hasCoupon: this.keyFacts.mandatory.hasCoupon.value(),
            couponType: this.keyFacts.mandatory.couponType.value()[0].id,
            freqOfDistributionDeclaration: this.keyFacts.mandatory.freqOfDistributionDeclaration.value()[0].id,
            status: this.keyFacts.mandatory.status.value()[0].id,
            master: this.getStatusMasterValue(),
            feeder: this.getStatusFeederValue(),
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
            subscriptionCutOffTime: this.calendar.mandatory.subscriptionCutOffTime.value(),
            subscriptionCutOffTimeZone: this.calendar.mandatory.subscriptionCutOffTimeZone.value()[0].id,
            subscriptionSettlementPeriod: this.calendar.mandatory.subscriptionSettlementPeriod.value()[0].id,
            redemptionCutOffTime: this.calendar.mandatory.redemptionCutOffTime.value(),
            redemptionCutOffTimeZone: this.calendar.mandatory.redemptionCutOffTimeZone.value()[0].id,
            redemptionSettlementPeriod: this.calendar.mandatory.redemptionSettlementPeriod.value()[0].id,
            subscriptionRedemptionCalendar: this.calendar.mandatory.subscriptionRedemptionCalendar.value(),
            maxManagementFee: this.fees.mandatory.maxManagementFee.value(),
            maxSubscriptionFee: this.fees.mandatory.maxSubscriptionFee.value(),
            maxRedemptionFee: this.fees.mandatory.maxRedemptionFee.value(),
            investorProfile: this.profile.mandatory.investorProfile.value()[0].id,
            mifiidChargesOngoing: this.fees.mandatory.miFIDIIOngoingCharges.value(),
            mifiidChargesOneOff: this.fees.mandatory.miFIDIIOneOffCharges.value(),
            mifiidTransactionCosts: this.fees.mandatory.miFIDIITransactionsCosts.value(),
            mifiidServicesCosts: this.fees.mandatory.miFIDIIAncillaryCharges.value(),
            mifiidIncidentalCosts: this.fees.mandatory.miFIDIIIncidentalCosts.value(),
            subscriptionTradeCyclePeriod: (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleSubscriptionsWithinPeriod: (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklySubscriptionDealingDays: (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays,
            monthlySubscriptionDealingDays: this.convertArrayToJSON((this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlySubscriptionDealingDays: this.convertArrayToJSON((this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            redemptionTradeCyclePeriod: (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleRedemptionsWithinPeriod: (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklyRedemptionDealingDays: (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays,
            monthlyRedemptionDealingDays: this.convertArrayToJSON((this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlyRedemptionDealingDays: this.convertArrayToJSON((this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            navPeriodForSubscription: this.calendar.mandatory.navPeriodForSubscription.value()[0].id,
            navPeriodForRedemption: this.calendar.mandatory.navPeriodForRedemption.value()[0].id,
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

    setFundShare(fundShare: OfiFundShare): void {
        this.keyFacts.mandatory.fundShareName.preset = fundShare.fundShareName;
        this.keyFacts.mandatory.isin.preset = fundShare.isin;
        this.setListItemPreset(this.keyFacts.mandatory.shareClassCode, fundShare.shareClassCode);
        this.setListItemPreset(this.keyFacts.mandatory.shareClassInvestmentStatus, fundShare.shareClassInvestmentStatus);
        this.keyFacts.mandatory.subscriptionStartDate.preset = fundShare.subscriptionStartDate;
        this.keyFacts.mandatory.launchDate.preset = fundShare.launchDate;
        this.setListItemPreset(this.keyFacts.mandatory.shareClassCurrency, fundShare.shareClassCurrency);
        this.setListItemPreset(this.keyFacts.mandatory.valuationFrequency, fundShare.valuationFrequency);
        this.setListItemPreset(this.keyFacts.mandatory.historicOrForwardPricing, fundShare.historicOrForwardPricing);
        this.keyFacts.mandatory.hasCoupon.preset = fundShare.hasCoupon;
        this.setListItemPreset(this.keyFacts.mandatory.couponType, fundShare.couponType);
        this.setListItemPreset(this.keyFacts.mandatory.freqOfDistributionDeclaration, fundShare.freqOfDistributionDeclaration);
        this.setListItemPreset(this.keyFacts.mandatory.status, fundShare.status);
        this.setListItemPreset(this.keyFacts.mandatory.master, fundShare.master);
        this.setListItemPreset(this.keyFacts.mandatory.feeder, fundShare.feeder);
        this.characteristic.mandatory.maximumNumDecimal.preset = fundShare.maximumNumDecimal;
        this.setListItemPreset(this.characteristic.mandatory.subscriptionCategory, fundShare.subscriptionCategory);
        this.setListItemPreset(this.characteristic.mandatory.subscriptionCurrency, fundShare.subscriptionCurrency);
        this.characteristic.mandatory.minInitialSubscriptionInShare.preset = fundShare.minInitialSubscriptionInShare;
        this.characteristic.mandatory.minInitialSubscriptionInAmount.preset = fundShare.minInitialSubscriptionInAmount;
        this.characteristic.mandatory.minSubsequentSubscriptionInShare.preset = fundShare.minSubsequentRedemptionInShare;
        this.characteristic.mandatory.minSubsequentSubscriptionInAmount.preset = fundShare.minSubsequentSubscriptionInAmount;
        this.setListItemPreset(this.characteristic.mandatory.redemptionCategory, fundShare.redemptionCategory);
        this.setListItemPreset(this.characteristic.mandatory.redemptionCurrency, fundShare.redemptionCurrency);
        this.characteristic.mandatory.minInitialRedemptionInShare.preset = fundShare.minInitialRedemptionInShare;
        this.characteristic.mandatory.minInitialRedemptionInAmount.preset = fundShare.minInitialRedemptionInAmount;
        this.characteristic.mandatory.minSubsequentRedemptionInShare.preset = fundShare.minSubsequentRedemptionInShare;
        this.characteristic.mandatory.minSubsequentRedemptionInAmount.preset = fundShare.minSubsequentRedemptionInAmount;
        this.setListItemPreset(this.characteristic.optional.portfolioCurrencyHedge, fundShare.portfolioCurrencyHedge);
        this.calendar.mandatory.subscriptionCutOffTime.preset = fundShare.subscriptionCutOffTime;
        this.setListItemPreset(this.calendar.mandatory.subscriptionCutOffTimeZone, fundShare.subscriptionCutOffTimeZone);
        this.setListItemPreset(this.calendar.mandatory.subscriptionSettlementPeriod, fundShare.subscriptionSettlementPeriod);
        this.calendar.mandatory.redemptionCutOffTime.preset = fundShare.redemptionCutOffTime;
        this.setListItemPreset(this.calendar.mandatory.redemptionCutOffTimeZone, fundShare.redemptionCutOffTimeZone);
        this.setListItemPreset(this.calendar.mandatory.redemptionSettlementPeriod, fundShare.redemptionSettlementPeriod);
        this.calendar.mandatory.subscriptionRedemptionCalendar.preset = fundShare.subscriptionRedemptionCalendar;
        this.fees.mandatory.maxManagementFee.preset = fundShare.maxManagementFee;
        this.fees.mandatory.maxSubscriptionFee.preset = fundShare.maxSubscriptionFee;
        this.fees.mandatory.maxRedemptionFee.preset = fundShare.maxRedemptionFee;
        this.setListItemPreset(this.profile.mandatory.investorProfile, fundShare.investorProfile);
        this.fees.mandatory.miFIDIIOngoingCharges.preset = fundShare.mifiidChargesOngoing;
        this.fees.mandatory.miFIDIIOneOffCharges.preset = fundShare.mifiidChargesOneOff;
        this.fees.mandatory.miFIDIITransactionsCosts.preset = fundShare.mifiidTransactionCosts;
        this.fees.mandatory.miFIDIIAncillaryCharges.preset = fundShare.mifiidServicesCosts;
        this.fees.mandatory.miFIDIIIncidentalCosts.preset = fundShare.mifiidIncidentalCosts;
        
        this.applyOptionalData((this.keyFacts.optional as any), JSON.parse(fundShare.keyFactOptionalData));
        this.applyOptionalData((this.characteristic.optional as any), JSON.parse(fundShare.characteristicOptionalData));
        this.applyOptionalData((this.calendar.optional as any), JSON.parse(fundShare.calendarOptionalData));
        this.applyOptionalData((this.profile.optional as any), JSON.parse(fundShare.profileOptionalData));
        this.applyOptionalData((this.priip.optional as any), JSON.parse(fundShare.priipOptionalData));
        this.applyOptionalData((this.listing.optional as any), JSON.parse(fundShare.listingOptionalData));
        this.applyOptionalData((this.taxation.optional as any), JSON.parse(fundShare.taxationOptionalData));
        this.applyOptionalData((this.solvency.optional as any), JSON.parse(fundShare.solvencyIIOptionalData));
        this.applyOptionalData((this.representation.optional as any), JSON.parse(fundShare.representationOptionalData));
        
        this.fundID = fundShare.fundID;
    }

    setSubscriptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod = fundShare.numberOfPossibleSubscriptionsWithinPeriod;
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays = fundShare.weeklySubscriptionDealingDays;
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays = JSON.parse(fundShare.monthlySubscriptionDealingDays);
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays = JSON.parse(fundShare.yearlySubscriptionDealingDays);
        this.setListItemPreset(this.calendar.mandatory.navPeriodForSubscription, fundShare.navPeriodForSubscription);
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod = fundShare.subscriptionTradeCyclePeriod;
    }

    setRedemptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod = fundShare.numberOfPossibleRedemptionsWithinPeriod;
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays = fundShare.weeklyRedemptionDealingDays;
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays = JSON.parse(fundShare.monthlyRedemptionDealingDays);
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays = JSON.parse(fundShare.yearlyRedemptionDealingDays);
        this.setListItemPreset(this.calendar.mandatory.navPeriodForRedemption, fundShare.navPeriodForRedemption);
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod = fundShare.redemptionTradeCyclePeriod;
    }

    getDocumentsRequest(fundShareId: number): OfiFundShareDocuments {
        return {
            fundShareId: fundShareId,
            prospectus: this.documents.mandatory.prospectus.value(),
            kiid: this.documents.mandatory.kiid.value(),
            annualActivityReport: this.documents.optional.annualActivityReport.value(),
            semiAnnualSummary: this.documents.optional.semiAnnualSummary.value(),
            sharesAllocation: this.documents.optional.sharesAllocation.value(),
            sriPolicy: this.documents.optional.sriPolicy.value(),
            transparencyCode: this.documents.optional.transparencyCode.value(),
            businessLetter: this.documents.optional.businessLetter.value(),
            productSheet: this.documents.optional.productSheet.value(),
            monthlyFinancialReport: this.documents.optional.monthlyFinancialReport.value(),
            monthlyExtraFinancialReport: this.documents.optional.monthlyExtraFinancialReport.value(),
            quarterlyFinancialReport: this.documents.optional.quarterlyFinancialReport.value(),
            quarterlyExtraFinancialReport: this.documents.optional.quarterlyExtraFinancialReport.value(),
            letterToShareholders: this.documents.optional.letterToShareholders.value(),
            kid: this.documents.optional.kid.value(),
            statutoryAuditorsCertification: this.documents.optional.statutoryAuditorsCertification.value(),
            ept: this.documents.optional.ept.value(),
            emt: this.documents.optional.emt.value(),
            tpts2: this.documents.optional.tpts2.value()
        }
    }

    private generateJSONString(model): string {
        const json = {};

        _.forEach(model, (item: FormItem, index: string) => {
            json[index] = item.value();
        });

        return JSON.stringify(json);
    }

    private applyOptionalData(target: { [key: string]: FormItem }, optionalData: { [key: string]: any }): void {
        _.forEach(optionalData, (val: any, index: string) => {
            this.applyValueToExistingFormItem(target[index], val);
        });
    }

    private applyValueToExistingFormItem(field: FormItem, value: any): void {
        if(field.type === FormItemType.list) {
            this.setListItemPreset(field, value);
        } else {
            field.preset = value;
        }
    }

    private setListItemPreset(field: FormItem, value: any): void {
        if(value == undefined) return;
        (field.preset as any) = [_.find(field.listItems, (item) => {
            return item.id == value;
        })];
    }

    private convertArrayToJSON(arr: any[]): string {
        if((!arr) || arr.length === 0) return null;

        return JSON.stringify(arr);
    }

    private getStatusMasterValue(): number {
        if(parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Master) {
            return this.keyFacts.mandatory.master.value()[0].id;
        } else {
            return null;
        }
    }

    private getStatusFeederValue(): number {
        if(parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Feeder) {
            return this.keyFacts.mandatory.feeder.value()[0].id;
        } else {
            return null;
        }
    }
}

export enum FundShareMode {
    Create,
    Update
}