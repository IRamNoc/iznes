import * as _ from 'lodash';

import {FormItem, FormItemDropdown, FormItemType, NumberConverterService} from '@setl/utils';
import { OfiFundShare, OfiFundShareDocuments } from '@ofi/ofi-main';
import * as FundShareEnum from './FundShareEnum';
import { ShareCharacteristicMandatory } from './models/characteristic';
import { ShareCalendarSubscriptionMandatory, ShareCalendarRedemptionMandatory  } from './models/calendar';
import { ShareFeesMandatory, ShareFeesOptional } from './models/fees';
import { ShareKeyFactsStatus, ShareKeyFactsMandatory, ShareKeyFactsOptional } from './models/keyFacts';
import { ShareListingOptional } from './models/listing';
import { SharePRIIPOptional } from './models/priip';
import { ShareProfileMandatory, ShareProfileOptional } from './models/profile';
import { ShareRepresentationOptional } from './models/representation';
import { ShareSolvencyOptional } from './models/solvency';
import { ShareTaxationOptional } from './models/taxation';
import { ShareFund, ShareFundHolidayManagement, ShareFundOptionnal } from './models/fund';
import { ShareUmbrellaFund, ShareUmbrellaFundOptionnal } from './models/umbrella';
import { ShareDocumentsMandatory, ShareDocumentsOptional } from './models/documents';
import { FundShareTradeCycleModel } from './form/trade-cycle/model';
import * as PC from '../productConfig';
import {DynamicFormService} from "@setl/utils/components/dynamic-forms";

export { PanelData } from './models/panelData';

export class FundShare {
    fundID: number;
    umbrellaFundID: number;
    fundShareId: number;
    accountId: number;
    isProduction: boolean;

    fund = this.attchDynamicFormProperties(new ShareFund());
    fundHoliday = this.attchDynamicFormProperties(new ShareFundHolidayManagement());
    fundOptionnal = this.attchDynamicFormProperties(new ShareFundOptionnal());
    umbrella = this.attchDynamicFormProperties(new ShareUmbrellaFund());
    umbrellaOptionnal = this.attchDynamicFormProperties(new ShareUmbrellaFundOptionnal());

    calendarSubscription = {
        mandatory: this.attchDynamicFormProperties(new ShareCalendarSubscriptionMandatory()),
        subscriptionTradeCycle: new FundShareTradeCycleModel(),
    };
    calendarRedemption = {
        mandatory: this.attchDynamicFormProperties(new ShareCalendarRedemptionMandatory()),
        redemptionTradeCycle: new FundShareTradeCycleModel(),
    };
    characteristic = {
        mandatory: this.attchDynamicFormProperties(new ShareCharacteristicMandatory()),
    };
    fees = {
        mandatory: this.attchDynamicFormProperties(new ShareFeesMandatory()),
        optional: this.attchDynamicFormProperties(new ShareFeesOptional()),
    };
    keyFacts = {
        status: this.attchDynamicFormProperties(new ShareKeyFactsStatus()),
        mandatory: this.attchDynamicFormProperties(new ShareKeyFactsMandatory()),
        optional: this.attchDynamicFormProperties(new ShareKeyFactsOptional()),
    };
    listing = {
        optional: this.attchDynamicFormProperties(new ShareListingOptional()),
    };
    priip = {
        optional: this.attchDynamicFormProperties(new SharePRIIPOptional()),
    };
    profile = {
        mandatory: this.attchDynamicFormProperties(new ShareProfileMandatory()),
        optional: this.attchDynamicFormProperties(new ShareProfileOptional()),
    };
    representation = {
        optional: this.attchDynamicFormProperties(new ShareRepresentationOptional()),
    };
    solvency = {
        optional: this.attchDynamicFormProperties(new ShareSolvencyOptional()),
    };
    taxation = {
        optional: this.attchDynamicFormProperties(new ShareTaxationOptional()),
    };
    documents = {
        mandatory: this.attchDynamicFormProperties(new ShareDocumentsMandatory()),
        optional: this.attchDynamicFormProperties(new ShareDocumentsOptional()),
    };

    constructor(
        private dynamicFormService: DynamicFormService,
        private numberConverter: NumberConverterService,
    ) {
    }

    isValid(): boolean {
        return  this.characteristic.mandatory.isValid() &&
                this.calendarSubscription.mandatory.isValid() &&
                this.calendarSubscription.subscriptionTradeCycle.isValid() &&
                this.calendarRedemption.mandatory.isValid() &&
                this.calendarRedemption.redemptionTradeCycle.isValid() &&
                this.fees.mandatory.isValid() &&
                this.keyFacts.mandatory.isValid() &&
                this.profile.mandatory.isValid() &&
                this.documents.mandatory.isValid();
    }

    getRequest(draft): OfiFundShare {
        return {
            accountId: this.accountId,
            draft,
            fundShareName: this.keyFacts.mandatory.fundShareName.value(),
            fundShareID: this.fundShareId,
            fundID: this.fundID,
            isin: this.keyFacts.mandatory.isin.value(),
            shareClassCode: this.keyFacts.mandatory.shareClassCode.value(),
            shareClassInvestmentStatus: this.getSelectValue(this.keyFacts.status.shareClassInvestmentStatus),
            subscriptionStartDate: this.keyFacts.mandatory.subscriptionStartDate.value(),
            launchDate: this.keyFacts.mandatory.shareLaunchDate.value(),
            shareClassCurrency: this.getSelectValue(this.keyFacts.mandatory.shareClassCurrency),
            iban: this.keyFacts.mandatory.iban.value(),
            mainIban: this.keyFacts.mandatory.mainIban.value(),
            valuationFrequency: this.getSelectValue(this.keyFacts.mandatory.valuationFrequency),
            historicOrForwardPricing: this.getSelectValue(this.keyFacts.mandatory.historicOrForwardPricing),
            hasCoupon: this.keyFacts.mandatory.hasCoupon.value(),
            couponType: this.getSelectValue(this.keyFacts.mandatory.couponType),
            freqOfDistributionDeclaration: this.getSelectValue(this.keyFacts.mandatory.freqOfDistributionDeclaration),
            status: this.getSelectValue(this.keyFacts.mandatory.status),
            master: this.isStatusMaster(),
            feeder: this.getStatusFeederValue(),
            allowSellBuy: this.keyFacts.mandatory.allowSellBuy.value(),
            sellBuyCalendar: this.getSelectValue(this.keyFacts.mandatory.sellBuyCalendar),
            maximumNumDecimal: this.characteristic.mandatory.maximumNumDecimal.value(),
            subscriptionCategory: this.getSelectValue(this.characteristic.mandatory.subscriptionCategory),
            subscriptionQuantityRoundingRule: this.getSelectValue(this.characteristic.mandatory.subscriptionQuantityRoundingRule),
            subscriptionCurrency: this.getSelectValue(this.characteristic.mandatory.subscriptionCurrency),
            minInitialSubscriptionInShare: this.characteristic.mandatory.minInitialSubscriptionInShare.value(),
            minInitialSubscriptionInAmount: this.characteristic.mandatory.minInitialSubscriptionInAmount.value(),
            minSubsequentSubscriptionInShare: this.characteristic.mandatory.minSubsequentSubscriptionInShare.value(),
            minSubsequentSubscriptionInAmount: this.characteristic.mandatory.minSubsequentSubscriptionInAmount.value(),
            redemptionCategory: this.getSelectValue(this.characteristic.mandatory.redemptionCategory),
            redemptionQuantityRoundingRule: this.getSelectValue(this.characteristic.mandatory.redemptionQuantityRoundingRule),
            redemptionCurrency: this.getSelectValue(this.characteristic.mandatory.redemptionCurrency),
            minSubsequentRedemptionInShare: this.characteristic.mandatory.minSubsequentRedemptionInShare.value(),
            minSubsequentRedemptionInAmount: this.characteristic.mandatory.minSubsequentRedemptionInAmount.value(),
            portfolioCurrencyHedge: this.getSelectValue(this.keyFacts.mandatory.sharePortfolioCurrencyHedge),
            subscriptionCutOffTime: this.calendarSubscription.mandatory.subscriptionCutOffTime.value(),
            subscriptionCutOffTimeZone: this.getSelectValue(this.calendarSubscription.mandatory.subscriptionCutOffTimeZone),
            subscriptionSettlementPeriod: this.getSelectValue(this.calendarSubscription.mandatory.subscriptionSettlementPeriod),
            redemptionCutOffTime: this.calendarRedemption.mandatory.redemptionCutOffTime.value(),
            redemptionCutOffTimeZone: this.getSelectValue(this.calendarRedemption.mandatory.redemptionCutOffTimeZone),
            redemptionSettlementPeriod: this.getSelectValue(this.calendarRedemption.mandatory.redemptionSettlementPeriod),
            subscriptionRedemptionCalendar: '0',
            maxManagementFee: this.fees.mandatory.maxManagementFee.value(),
            maxSubscriptionFee: this.fees.mandatory.maxSubscriptionFee.value(),
            maxRedemptionFee: this.fees.mandatory.maxRedemptionFee.value(),
            investorProfile: this.getSelectValue(this.profile.mandatory.investorProfile),
            mifiidChargesOngoing: this.fees.mandatory.mifiidChargesOngoing.value(),
            mifiidChargesOneOff: this.fees.mandatory.mifiidChargesOneOff.value(),
            mifiidTransactionCosts: this.fees.mandatory.mifiidTransactionCosts.value(),
            mifiidServicesCosts: this.fees.mandatory.mifiidServicesCosts.value(),
            mifiidIncidentalCosts: this.fees.mandatory.mifiidIncidentalCosts.value(),
            subscriptionTradeCyclePeriod:
                (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleSubscriptionsWithinPeriod:
                (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklySubscriptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays),
            monthlySubscriptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlySubscriptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            redemptionTradeCyclePeriod:
                (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleRedemptionsWithinPeriod:
                (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklyRedemptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays),
            monthlyRedemptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlyRedemptionDealingDays:
                this.convertArrayToJSON(
                    (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            navPeriodForSubscription: this.getSelectValue(this.calendarSubscription.mandatory.navPeriodForSubscription),
            subscriptionEnableNonWorkingDay: this.calendarSubscription.mandatory.subscriptionEnableNonWorkingDay.value(),
            navPeriodForRedemption: this.getSelectValue(this.calendarRedemption.mandatory.navPeriodForRedemption),
            redemptionEnableNonWorkingDay: this.calendarRedemption.mandatory.redemptionEnableNonWorkingDay.value(),
            keyFactOptionalData: this.generateJSONString(this.keyFacts.optional),
            profileOptionalData: this.generateJSONString(this.profile.optional),
            priipOptionalData: this.generateJSONString(this.priip.optional),
            listingOptionalData: this.generateJSONString(this.listing.optional),
            taxationOptionalData: this.generateJSONString(this.taxation.optional),
            solvencyIIOptionalData: this.generateJSONString(this.solvency.optional),
            representationOptionalData: this.generateJSONString(this.representation.optional),
            ktpCode: this.keyFacts.mandatory.ktpCode.value(),
        };
    }

    resetFundShare() {
        this.calendarSubscription = {
            ...this.calendarSubscription,
            mandatory: new ShareCalendarSubscriptionMandatory(),
        };
        this.calendarSubscription.subscriptionTradeCycle.reset();

        this.calendarRedemption = {
            ...this.calendarRedemption,
            mandatory: new ShareCalendarRedemptionMandatory(),
        };
        this.calendarRedemption.redemptionTradeCycle.reset();

        this.characteristic = {
            mandatory: new ShareCharacteristicMandatory(),
        };
        this.fees = {
            mandatory: new ShareFeesMandatory(),
            optional: new ShareFeesOptional(),
        };
        this.keyFacts = {
            status: new ShareKeyFactsStatus(),
            mandatory: new ShareKeyFactsMandatory(),
            optional: new ShareKeyFactsOptional(),
        };
        this.listing = {
            optional: new ShareListingOptional(),
        };
        this.priip = {
            optional: new SharePRIIPOptional(),
        };
        this.profile = {
            mandatory: new ShareProfileMandatory(),
            optional: new ShareProfileOptional(),
        };
        this.representation = {
            optional: new ShareRepresentationOptional(),
        };
        this.solvency = {
            optional: new ShareSolvencyOptional(),
        };
        this.taxation = {
            optional: new ShareTaxationOptional(),
        };
        this.documents = {
            mandatory: new ShareDocumentsMandatory(),
            optional: new ShareDocumentsOptional(),
        };
    }

    setFundShare(fundShare: OfiFundShare, isPrefill = false): void {
        this.fundID = fundShare.fundID;
        this.keyFacts.mandatory.fundShareName.preset = isPrefill ? null : fundShare.fundShareName;
        this.keyFacts.mandatory.ktpCode.preset=isPrefill ? null : fundShare.ktpCode;
        this.keyFacts.mandatory.isin.preset = isPrefill ? null : fundShare.isin;
        this.keyFacts.mandatory.shareClassCode.preset = fundShare.shareClassCode;
        this.setListItemPreset(this.keyFacts.status.shareClassInvestmentStatus, fundShare.shareClassInvestmentStatus);
        this.keyFacts.mandatory.subscriptionStartDate.preset = fundShare.subscriptionStartDate;
        this.keyFacts.mandatory.shareLaunchDate.preset = fundShare.launchDate;
        this.setListItemPreset(this.keyFacts.mandatory.shareClassCurrency, fundShare.shareClassCurrency);
        this.keyFacts.mandatory.iban.preset = fundShare.iban;
        this.keyFacts.mandatory.mainIban.preset = fundShare.mainIban;
        this.setListItemPreset(this.keyFacts.mandatory.valuationFrequency, fundShare.valuationFrequency);
        this.setListItemPreset(this.keyFacts.mandatory.historicOrForwardPricing, fundShare.historicOrForwardPricing);
        this.keyFacts.mandatory.hasCoupon.preset = fundShare.hasCoupon;
        this.setListItemPreset(this.keyFacts.mandatory.couponType, fundShare.couponType);
        this.setListItemPreset(
            this.keyFacts.mandatory.freqOfDistributionDeclaration,
            fundShare.freqOfDistributionDeclaration,
        );
        this.setListItemPreset(this.keyFacts.mandatory.status, fundShare.status);
        this.setFeederPreset(fundShare.feeder);
        this.keyFacts.mandatory.allowSellBuy.preset = fundShare.allowSellBuy;
        this.setListItemPreset(this.keyFacts.mandatory.sellBuyCalendar, fundShare.sellBuyCalendar);
        this.characteristic.mandatory.maximumNumDecimal.preset = fundShare.maximumNumDecimal;
        this.setListItemPreset(this.characteristic.mandatory.subscriptionCategory, fundShare.subscriptionCategory);
        this.setListItemPreset(this.characteristic.mandatory.subscriptionQuantityRoundingRule, fundShare.subscriptionQuantityRoundingRule);
        this.setListItemPreset(this.characteristic.mandatory.subscriptionCurrency, fundShare.subscriptionCurrency);
        this.characteristic.mandatory.minInitialSubscriptionInShare.preset = this.numberConverter.toFrontEnd(fundShare.minInitialSubscriptionInShare);
        this.characteristic.mandatory.minInitialSubscriptionInAmount.preset = this.numberConverter.toFrontEnd(fundShare.minInitialSubscriptionInAmount);
        this.characteristic.mandatory.minSubsequentSubscriptionInShare.preset =
            this.numberConverter.toFrontEnd(fundShare.minSubsequentRedemptionInShare);
        this.characteristic.mandatory.minSubsequentSubscriptionInAmount.preset =
            this.numberConverter.toFrontEnd(fundShare.minSubsequentSubscriptionInAmount);
        this.setListItemPreset(this.characteristic.mandatory.redemptionCategory, fundShare.redemptionCategory);
        this.setListItemPreset(this.characteristic.mandatory.redemptionQuantityRoundingRule, fundShare.redemptionQuantityRoundingRule);
        this.setListItemPreset(this.characteristic.mandatory.redemptionCurrency, fundShare.redemptionCurrency);
        this.characteristic.mandatory.minSubsequentRedemptionInShare.preset = this.numberConverter.toFrontEnd(fundShare.minSubsequentRedemptionInShare);
        this.characteristic.mandatory.minSubsequentRedemptionInAmount.preset =
            this.numberConverter.toFrontEnd(fundShare.minSubsequentRedemptionInAmount);
        this.setListItemPreset(this.keyFacts.mandatory.sharePortfolioCurrencyHedge, fundShare.portfolioCurrencyHedge);
        this.calendarSubscription.mandatory.subscriptionCutOffTime.preset = fundShare.subscriptionCutOffTime; // AC
        this.setListItemPreset(
            this.calendarSubscription.mandatory.subscriptionCutOffTimeZone,
            fundShare.subscriptionCutOffTimeZone,
        );
        this.setListItemPreset(
            this.calendarSubscription.mandatory.subscriptionSettlementPeriod,
            fundShare.subscriptionSettlementPeriod,
        );

        this.calendarRedemption.mandatory.redemptionCutOffTime.preset = fundShare.redemptionCutOffTime; // AC
        this.setListItemPreset(this.calendarRedemption.mandatory.redemptionCutOffTimeZone, fundShare.redemptionCutOffTimeZone);
        this.setListItemPreset(
            this.calendarRedemption.mandatory.redemptionSettlementPeriod,
            fundShare.redemptionSettlementPeriod,
        );

        this.setListItemPreset(
            this.calendarSubscription.mandatory.navPeriodForSubscription,
            fundShare.navPeriodForSubscription,
        );
        this.calendarSubscription.mandatory.subscriptionEnableNonWorkingDay.preset = fundShare.subscriptionEnableNonWorkingDay;
        this.setListItemPreset(
            this.calendarRedemption.mandatory.navPeriodForRedemption,
            fundShare.navPeriodForRedemption,
        );
        this.calendarRedemption.mandatory.redemptionEnableNonWorkingDay.preset = fundShare.redemptionEnableNonWorkingDay;

        // removed by PZ 28/06/2018
        // this.calendar.mandatory.subscriptionRedemptionCalendar.preset = fundShare.subscriptionRedemptionCalendar;
        this.fees.mandatory.maxManagementFee.preset = this.numberConverter.toFrontEnd(fundShare.maxManagementFee);
        this.fees.mandatory.maxSubscriptionFee.preset = this.numberConverter.toFrontEnd(fundShare.maxSubscriptionFee);
        this.fees.mandatory.maxRedemptionFee.preset = this.numberConverter.toFrontEnd(fundShare.maxRedemptionFee);
        this.setListItemPreset(this.profile.mandatory.investorProfile, fundShare.investorProfile);
        this.fees.mandatory.mifiidChargesOngoing.preset = this.numberConverter.toFrontEnd(fundShare.mifiidChargesOngoing);
        this.fees.mandatory.mifiidChargesOneOff.preset = this.numberConverter.toFrontEnd(fundShare.mifiidChargesOneOff);
        this.fees.mandatory.mifiidTransactionCosts.preset = this.numberConverter.toFrontEnd(fundShare.mifiidTransactionCosts);
        this.fees.mandatory.mifiidServicesCosts.preset = this.numberConverter.toFrontEnd(fundShare.mifiidServicesCosts);
        this.fees.mandatory.mifiidIncidentalCosts.preset = this.numberConverter.toFrontEnd(fundShare.mifiidIncidentalCosts);

        this.applyOptionalData((this.keyFacts.optional as any), JSON.parse(fundShare.keyFactOptionalData));
        this.applyOptionalData((this.profile.optional as any), JSON.parse(fundShare.profileOptionalData));
        this.applyOptionalData((this.priip.optional as any), JSON.parse(fundShare.priipOptionalData));
        this.applyOptionalData((this.listing.optional as any), JSON.parse(fundShare.listingOptionalData));
        this.applyOptionalData((this.taxation.optional as any), JSON.parse(fundShare.taxationOptionalData));
        this.applyOptionalData((this.solvency.optional as any), JSON.parse(fundShare.solvencyIIOptionalData));
        this.applyOptionalData((this.representation.optional as any), JSON.parse(fundShare.representationOptionalData));
    }

    updateFundShare(fundShare: OfiFundShare, isPrefill = false): void {
        this.fundShareId = fundShare.fundShareID;
        this.fundID = fundShare.fundID;

        this.keyFacts.mandatory.fundShareName.control.setValue(isPrefill ? null : fundShare.fundShareName);
        this.keyFacts.mandatory.ktpCode.control.setValue(isPrefill ? null : fundShare.ktpCode);
        this.keyFacts.mandatory.isin.control.setValue(isPrefill ? null : fundShare.isin);
        this.keyFacts.mandatory.shareClassCode.control.setValue(fundShare.shareClassCode);
        this.setListItemValue(this.keyFacts.status.shareClassInvestmentStatus, fundShare.shareClassInvestmentStatus);
        this.keyFacts.mandatory.subscriptionStartDate.control.setValue(fundShare.subscriptionStartDate);
        this.keyFacts.mandatory.shareLaunchDate.control.setValue(fundShare.launchDate);
        this.setListItemValue(this.keyFacts.mandatory.shareClassCurrency, fundShare.shareClassCurrency);
        this.keyFacts.mandatory.iban.control.setValue(fundShare.iban);
        this.keyFacts.mandatory.mainIban.control.setValue(fundShare.mainIban);
        this.setListItemValue(this.keyFacts.mandatory.valuationFrequency, fundShare.valuationFrequency);
        this.setListItemValue(this.keyFacts.mandatory.historicOrForwardPricing, fundShare.historicOrForwardPricing);
        this.keyFacts.mandatory.hasCoupon.control.setValue(fundShare.hasCoupon);
        this.setListItemValue(this.keyFacts.mandatory.couponType, fundShare.couponType);
        this.setListItemValue(
            this.keyFacts.mandatory.freqOfDistributionDeclaration,
            fundShare.freqOfDistributionDeclaration,
        );
        this.setListItemValue(this.keyFacts.mandatory.status, fundShare.status);
        this.setFeederValue(fundShare.feeder);
        this.keyFacts.mandatory.allowSellBuy.control.setValue(fundShare.allowSellBuy);
        this.setListItemValue(this.keyFacts.mandatory.sellBuyCalendar, fundShare.sellBuyCalendar);
        this.characteristic.mandatory.maximumNumDecimal.control.setValue(fundShare.maximumNumDecimal);
        this.setListItemValue(this.characteristic.mandatory.subscriptionCategory, fundShare.subscriptionCategory);
        this.setListItemValue(this.characteristic.mandatory.subscriptionQuantityRoundingRule, fundShare.subscriptionQuantityRoundingRule);
        this.setListItemValue(this.characteristic.mandatory.subscriptionCurrency, fundShare.subscriptionCurrency);
        this.characteristic.mandatory.minInitialSubscriptionInShare.control.setValue(this.numberConverter.toFrontEnd(fundShare.minInitialSubscriptionInShare));
        this.characteristic.mandatory.minInitialSubscriptionInAmount.control.setValue(this.numberConverter.toFrontEnd(fundShare.minInitialSubscriptionInAmount));
        this.characteristic.mandatory.minSubsequentSubscriptionInShare.control.setValue(this.numberConverter.toFrontEnd(fundShare.minSubsequentSubscriptionInShare));
        this.characteristic.mandatory.minSubsequentSubscriptionInAmount.control.setValue(this.numberConverter.toFrontEnd(fundShare.minSubsequentSubscriptionInAmount));
        this.setListItemValue(this.characteristic.mandatory.redemptionCategory, fundShare.redemptionCategory);
        this.setListItemValue(this.characteristic.mandatory.redemptionQuantityRoundingRule, fundShare.redemptionQuantityRoundingRule);
        this.setListItemValue(this.characteristic.mandatory.redemptionCurrency, fundShare.redemptionCurrency);
        this.characteristic.mandatory.minSubsequentRedemptionInShare.control.setValue(this.numberConverter.toFrontEnd(fundShare.minSubsequentRedemptionInShare));
        this.characteristic.mandatory.minSubsequentRedemptionInAmount.control.setValue(this.numberConverter.toFrontEnd(fundShare.minSubsequentRedemptionInAmount));
        this.setListItemValue(this.keyFacts.mandatory.sharePortfolioCurrencyHedge, fundShare.portfolioCurrencyHedge);
        this.calendarSubscription.mandatory.subscriptionCutOffTime.control.setValue(fundShare.subscriptionCutOffTime);
        this.setListItemValue(
            this.calendarSubscription.mandatory.subscriptionCutOffTimeZone,
            fundShare.subscriptionCutOffTimeZone,
        );
        this.setListItemValue(
            this.calendarSubscription.mandatory.subscriptionSettlementPeriod,
            fundShare.subscriptionSettlementPeriod,
        );

        this.calendarRedemption.mandatory.redemptionCutOffTime.control.setValue(fundShare.redemptionCutOffTime);
        this.setListItemValue(this.calendarRedemption.mandatory.redemptionCutOffTimeZone, fundShare.redemptionCutOffTimeZone);
        this.setListItemValue(
            this.calendarRedemption.mandatory.redemptionSettlementPeriod,
            fundShare.redemptionSettlementPeriod,
        );
        this.setListItemValue(
            this.calendarSubscription.mandatory.navPeriodForSubscription,
            fundShare.navPeriodForSubscription,
        );
        this.calendarSubscription.mandatory.subscriptionEnableNonWorkingDay.control.setValue(fundShare.subscriptionEnableNonWorkingDay);
        this.setListItemValue(
            this.calendarRedemption.mandatory.navPeriodForRedemption,
            fundShare.navPeriodForRedemption,
        );
        this.calendarRedemption.mandatory.redemptionEnableNonWorkingDay.control.setValue(fundShare.redemptionEnableNonWorkingDay);

        // removed by PZ 28/06/2018
        // this.calendar.mandatory.subscriptionRedemptionCalendar.control.setValue(fundShare.subscriptionRedemptionCalendar);
        this.fees.mandatory.maxManagementFee.control.setValue(this.numberConverter.toFrontEnd(fundShare.maxManagementFee));
        this.fees.mandatory.maxSubscriptionFee.control.setValue(this.numberConverter.toFrontEnd(fundShare.maxSubscriptionFee));
        this.fees.mandatory.maxRedemptionFee.control.setValue(this.numberConverter.toFrontEnd(fundShare.maxRedemptionFee));
        this.setListItemValue(this.profile.mandatory.investorProfile, fundShare.investorProfile);
        this.fees.mandatory.mifiidChargesOngoing.control.setValue(this.numberConverter.toFrontEnd(fundShare.mifiidChargesOngoing));
        this.fees.mandatory.mifiidChargesOneOff.control.setValue(this.numberConverter.toFrontEnd(fundShare.mifiidChargesOneOff));
        this.fees.mandatory.mifiidTransactionCosts.control.setValue(this.numberConverter.toFrontEnd(fundShare.mifiidTransactionCosts));
        this.fees.mandatory.mifiidServicesCosts.control.setValue(this.numberConverter.toFrontEnd(fundShare.mifiidServicesCosts));
        this.fees.mandatory.mifiidIncidentalCosts.control.setValue(this.numberConverter.toFrontEnd(fundShare.mifiidIncidentalCosts));

        this.applyOptionalData((this.keyFacts.optional as any), JSON.parse(fundShare.keyFactOptionalData));
        this.applyOptionalData((this.profile.optional as any), JSON.parse(fundShare.profileOptionalData));
        this.applyOptionalData((this.priip.optional as any), JSON.parse(fundShare.priipOptionalData));
        this.applyOptionalData((this.listing.optional as any), JSON.parse(fundShare.listingOptionalData));
        this.applyOptionalData((this.taxation.optional as any), JSON.parse(fundShare.taxationOptionalData));
        this.applyOptionalData((this.solvency.optional as any), JSON.parse(fundShare.solvencyIIOptionalData));
        this.applyOptionalData((this.representation.optional as any), JSON.parse(fundShare.representationOptionalData));

        this.setRedemptionTradeCycleData(fundShare);
        this.setSubscriptionTradeCycleData(fundShare);
    }

    setSubscriptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays =
            JSON.parse(fundShare.weeklySubscriptionDealingDays);
        (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays =
            JSON.parse(fundShare.monthlySubscriptionDealingDays);
        (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays =
            JSON.parse(fundShare.yearlySubscriptionDealingDays);
        this.setListItemPreset(this.calendarSubscription.mandatory.navPeriodForSubscription, fundShare.navPeriodForSubscription);
        (this.calendarSubscription.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod =
            fundShare.subscriptionTradeCyclePeriod;
    }

    setRedemptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays =
            JSON.parse(fundShare.weeklyRedemptionDealingDays);
        (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays =
            JSON.parse(fundShare.monthlyRedemptionDealingDays);
        (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays =
            JSON.parse(fundShare.yearlyRedemptionDealingDays);
        this.setListItemPreset(this.calendarRedemption.mandatory.navPeriodForRedemption, fundShare.navPeriodForRedemption);
        (this.calendarRedemption.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod =
            fundShare.redemptionTradeCyclePeriod;
    }

    getDocumentsRequest(fundShareId: number): OfiFundShareDocuments {
        return {
            fundShareID: fundShareId,
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
            tpts2: this.documents.optional.tpts2.value(),
        };
    }
    setFundShareDocs(fundShareDocs: OfiFundShareDocuments): void {

        this.setDocumentItem(this.documents.mandatory.prospectus, fundShareDocs.prospectus);
        this.setDocumentItem(this.documents.mandatory.kiid, fundShareDocs.kiid);

        this.setDocumentItem(this.documents.optional.annualActivityReport, fundShareDocs.annualActivityReport);
        this.setDocumentItem(this.documents.optional.businessLetter, fundShareDocs.businessLetter);
        this.setDocumentItem(this.documents.optional.emt, fundShareDocs.emt);
        this.setDocumentItem(this.documents.optional.ept, fundShareDocs.ept);
        this.setDocumentItem(this.documents.optional.kid, fundShareDocs.kid);
        this.setDocumentItem(this.documents.optional.letterToShareholders, fundShareDocs.letterToShareholders);
        this.setDocumentItem(
            this.documents.optional.monthlyExtraFinancialReport,
            fundShareDocs.monthlyExtraFinancialReport,
        );
        this.setDocumentItem(this.documents.optional.monthlyFinancialReport, fundShareDocs.monthlyFinancialReport);
        this.setDocumentItem(this.documents.optional.productSheet, fundShareDocs.productSheet);
        this.setDocumentItem(
            this.documents.optional.quarterlyExtraFinancialReport,
            fundShareDocs.quarterlyExtraFinancialReport,
        );
        this.setDocumentItem(this.documents.optional.quarterlyFinancialReport, fundShareDocs.quarterlyFinancialReport);
        this.setDocumentItem(this.documents.optional.semiAnnualSummary, fundShareDocs.semiAnnualSummary);
        this.setDocumentItem(this.documents.optional.sharesAllocation, fundShareDocs.sharesAllocation);
        this.setDocumentItem(this.documents.optional.sriPolicy, fundShareDocs.sriPolicy);
        this.setDocumentItem(
            this.documents.optional.statutoryAuditorsCertification,
            fundShareDocs.statutoryAuditorsCertification,
        );
        this.setDocumentItem(this.documents.optional.tpts2, fundShareDocs.tpts2);
        this.setDocumentItem(this.documents.optional.transparencyCode, fundShareDocs.transparencyCode);
    }

    setFundShareDocsValue(fundShareDocs: OfiFundShareDocuments): void {
        this.setDocumentItemValue(this.documents.mandatory.prospectus, fundShareDocs.prospectus);
        this.setDocumentItemValue(this.documents.mandatory.kiid, fundShareDocs.kiid);

        this.setDocumentItemValue(this.documents.optional.annualActivityReport, fundShareDocs.annualActivityReport);
        this.setDocumentItemValue(this.documents.optional.businessLetter, fundShareDocs.businessLetter);
        this.setDocumentItemValue(this.documents.optional.emt, fundShareDocs.emt);
        this.setDocumentItemValue(this.documents.optional.ept, fundShareDocs.ept);
        this.setDocumentItemValue(this.documents.optional.kid, fundShareDocs.kid);
        this.setDocumentItemValue(this.documents.optional.letterToShareholders, fundShareDocs.letterToShareholders);
        this.setDocumentItemValue(
            this.documents.optional.monthlyExtraFinancialReport,
            fundShareDocs.monthlyExtraFinancialReport,
        );
        this.setDocumentItemValue(this.documents.optional.monthlyFinancialReport, fundShareDocs.monthlyFinancialReport);
        this.setDocumentItemValue(this.documents.optional.productSheet, fundShareDocs.productSheet);
        this.setDocumentItemValue(
            this.documents.optional.quarterlyExtraFinancialReport,
            fundShareDocs.quarterlyExtraFinancialReport,
        );
        this.setDocumentItemValue(this.documents.optional.quarterlyFinancialReport, fundShareDocs.quarterlyFinancialReport);
        this.setDocumentItemValue(this.documents.optional.semiAnnualSummary, fundShareDocs.semiAnnualSummary);
        this.setDocumentItemValue(this.documents.optional.sharesAllocation, fundShareDocs.sharesAllocation);
        this.setDocumentItemValue(this.documents.optional.sriPolicy, fundShareDocs.sriPolicy);
        this.setDocumentItemValue(
            this.documents.optional.statutoryAuditorsCertification,
            fundShareDocs.statutoryAuditorsCertification,
        );
        this.setDocumentItemValue(this.documents.optional.tpts2, fundShareDocs.tpts2);
        this.setDocumentItemValue(this.documents.optional.transparencyCode, fundShareDocs.transparencyCode);
    }

    setFund(fund: any): void {
        this.umbrellaFundID = fund.umbrellaFundID;
        this.fundID = fund.fundID;

        this.fund.name.preset = fund.fundName;
        this.fund.LEI.preset = fund.legalEntityIdentifier;
        this.fund.fundRegisteredOfficeName.preset = fund.registerOffice;
        this.fund.fundRegisteredOfficeAddress.preset = fund.registerOfficeAddress;
        this.setListItemPreset(this.fund.domicile, fund.domicile);
        this.fund.isEUDirectiveRelevant.preset = fund.isEuDirective;
        this.setListItemPreset(this.fund.legalForm, fund.legalForm);
        this.fund.nationalNomenclature.listItems = PC.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];
        this.setListItemPreset(this.fund.nationalNomenclature, fund.nationalNomenclatureOfLegalForm);
        this.fund.creationDate.preset = fund.fundCreationDate;
        this.fund.launchDate.preset = fund.fundLaunchDate;
        this.setListItemPreset(this.fund.currency, fund.fundCurrency);
        this.fund.openOrCloseEnded.preset = fund.openOrCloseEnded;
        this.fund.fiscalYearEnd.preset = fund.fiscalYearEnd;
        this.fund.isFundOfFunds.preset = fund.isFundOfFund;
        this.setListItemPreset(this.fund.managementCompany, fund.managementCompanyID);
        this.setListItemPreset(this.fund.fundAdministrator, fund.fundAdministrator);
        this.setListItemPreset(this.fund.custodianBank, fund.custodianBank);
        this.setListItemPreset(this.fund.investmentManager, fund.investmentManager);
        this.setListItemPresetMultiple(this.fund.principalPromoter, fund.principalPromoter);
        this.setListItemPresetMultiple(this.fund.payingAgent, fund.payingAgent);
        this.setListItemPreset(this.fund.fundManagers, fund.fundManagers);
        this.fund.isDedicatedFund.preset = fund.isDedicatedFund;
        this.setListItemPreset(this.fund.portfolioCurrencyHedge, fund.portfolioCurrencyHedge);

        this.fundHoliday.useDefaultHolidayMgmt.preset = fund.useDefaultHolidayMgmt;
        this.fundHoliday.holidayMgmtConfig.preset = JSON.parse(fund.holidayMgmtConfig);

        this.fundOptionnal.globalIntermediaryIdentification.preset = fund.globalIntermediaryIdentification;
        this.setListItemPreset(this.fundOptionnal.delegatedManagementCompany, fund.delegatedManagementCompany);
        this.fundOptionnal.investmentAdvisor.preset = fund.investmentAdvisor;
        this.setListItemPreset(this.fundOptionnal.auditor, fund.auditor);
        this.setListItemPreset(this.fundOptionnal.taxAuditor, fund.taxAuditor);
        this.setListItemPreset(this.fundOptionnal.legalAdvisor, fund.legalAdvisor);
        this.fundOptionnal.directors.preset = fund.directors;
        this.fundOptionnal.hasEmbeddedDirective.preset = fund.hasEmbeddedDirective;
        this.fundOptionnal.hasCapitalPreservation.preset = fund.hasCapitalPreservation;
        this.fundOptionnal.capitalPreservationLevel.preset = fund.capitalPreservationLevel;
        this.setListItemPreset(this.fundOptionnal.capitalPreservationPeriod, fund.capitalPreservationPeriod);
        this.fundOptionnal.hasCppi.preset = fund.hasCppi;
        this.fundOptionnal.cppiMultiplier.preset = fund.cppiMultiplier;
        this.fundOptionnal.hasHedgeFundStrategy.preset = fund.hasHedgeFundStrategy;
        this.fundOptionnal.isLeveraged.preset = fund.isLeveraged;
        this.fundOptionnal.has130Or30Strategy.preset = fund.has130Or30Strategy;
        this.fundOptionnal.isFundTargetingEos.preset = fund.isFundTargetingEos;
        this.fundOptionnal.isFundTargetingSri.preset = fund.isFundTargetingSri;
        this.fundOptionnal.isPassiveFund.preset = fund.isPassiveFund;
        this.fundOptionnal.hasSecurityLending.preset = fund.hasSecurityLending;
        this.fundOptionnal.hasSwap.preset = fund.hasSwap;
        this.fundOptionnal.hasDurationHedge.preset = fund.hasDurationHedge;
        this.fundOptionnal.internalReference.preset = fund.internalReference;
        this.fundOptionnal.additionalNotes.preset = fund.additionalNotes;
    }

    updateFund(fund: any, umbrella: any = false): void {
        this.umbrellaFundID = fund.umbrellaFundID;
        this.fundID = fund.fundID;

        this.fund.name.control.setValue(fund.fundName);
        this.fund.LEI.control.setValue(fund.legalEntityIdentifier);
        this.fund.fundRegisteredOfficeName.control.setValue(fund.registerOffice);
        this.fund.fundRegisteredOfficeAddress.control.setValue(fund.registerOfficeAddress);
        this.setListItemValue(this.fund.domicile, fund.domicile);
        this.fund.isEUDirectiveRelevant.control.setValue(fund.isEuDirective);
        this.setListItemValue(this.fund.legalForm, fund.legalForm);
        this.fund.nationalNomenclature.listItems = PC.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];
        this.setListItemValue(this.fund.nationalNomenclature, fund.nationalNomenclatureOfLegalForm);
        this.fund.creationDate.control.setValue(fund.fundCreationDate);
        this.fund.launchDate.control.setValue(fund.fundLaunchDate);
        this.setListItemValue(this.fund.currency, fund.fundCurrency);
        this.fund.openOrCloseEnded.control.setValue(fund.openOrCloseEnded);
        this.fund.fiscalYearEnd.control.setValue(fund.fiscalYearEnd);
        this.fund.isFundOfFunds.control.setValue(fund.isFundOfFund);
        this.setListItemValue(this.fund.managementCompany, fund.managementCompanyID);
        this.setListItemValue(this.fund.fundAdministrator, fund.fundAdministratorID);
        this.setListItemValue(this.fund.custodianBank, fund.custodianBankID);
        this.setListItemValue(this.fund.investmentManager, fund.investmentManagerID);
        this.setListItemValueMultiple(this.fund.principalPromoter, fund.principlePromoterID);
        this.setListItemValueMultiple(this.fund.payingAgent, fund.payingAgentID);
        this.setListItemValue(this.fund.fundManagers, fund.fundManagers);
        this.fund.isDedicatedFund.control.setValue(fund.isDedicatedFund);
        this.setListItemValue(this.fund.portfolioCurrencyHedge, fund.portfolioCurrencyHedge);

        this.fundHoliday.useDefaultHolidayMgmt.control.setValue(fund.useDefaultHolidayMgmt === '1');
        this.fundHoliday.holidayMgmtConfig.control.setValue(JSON.parse(fund.holidayMgmtConfig));

        this.fundOptionnal.globalIntermediaryIdentification.control.setValue(fund.globalIntermediaryIdentification);
        this.setListItemValue(this.fundOptionnal.delegatedManagementCompany, fund.delegatedManagementCompany);
        this.fundOptionnal.investmentAdvisor.control.setValue(fund.investmentAdvisorID);
        this.setListItemValue(this.fundOptionnal.auditor, fund.auditorID);
        this.setListItemValue(this.fundOptionnal.taxAuditor, fund.taxAuditorID);
        this.setListItemValue(this.fundOptionnal.legalAdvisor, fund.legalAdvisorID);
        this.fundOptionnal.directors.control.setValue(fund.directors);
        this.fundOptionnal.hasEmbeddedDirective.control.setValue(fund.hasEmbeddedDirective);
        this.fundOptionnal.hasCapitalPreservation.control.setValue(fund.hasCapitalPreservation);
        this.fundOptionnal.capitalPreservationLevel.control.setValue(fund.capitalPreservationLevel);
        this.setListItemValue(this.fundOptionnal.capitalPreservationPeriod, fund.capitalPreservationPeriod);
        this.fundOptionnal.hasCppi.control.setValue(fund.hasCppi);
        this.fundOptionnal.cppiMultiplier.control.setValue(fund.cppiMultiplier);
        this.fundOptionnal.hasHedgeFundStrategy.control.setValue(fund.hasHedgeFundStrategy);
        this.fundOptionnal.isLeveraged.control.setValue(fund.isLeveraged);
        this.fundOptionnal.has130Or30Strategy.control.setValue(fund.has130Or30Strategy);
        this.fundOptionnal.isFundTargetingEos.control.setValue(fund.isFundTargetingEos);
        this.fundOptionnal.isFundTargetingSri.control.setValue(fund.isFundTargetingSri);
        this.fundOptionnal.isPassiveFund.control.setValue(fund.isPassiveFund);
        this.fundOptionnal.hasSecurityLending.control.setValue(fund.hasSecurityLending);
        this.fundOptionnal.hasSwap.control.setValue(fund.hasSwap);
        this.fundOptionnal.hasDurationHedge.control.setValue(fund.hasDurationHedge);
        this.fundOptionnal.internalReference.control.setValue(fund.internalReference);
        this.fundOptionnal.additionalNotes.control.setValue(fund.additionalNotes);

        if (umbrella) {
            this.updateUmbrella(umbrella);
        }
    }

    setUmbrellaFund(umbrellaFund: any): void {
        this.umbrella.umbrellaFundName.preset = umbrellaFund.umbrellaFundName;
        this.umbrella.legalEntityIdentifier.preset = umbrellaFund.legalEntityIdentifier;
        this.umbrella.registerOffice.preset = umbrellaFund.registerOffice;
        this.umbrella.registerOfficeAddress.preset = umbrellaFund.registerOfficeAddress;
        this.umbrella.registerOfficeAddressLine2.preset = umbrellaFund.registerOfficeAddressLine2;
        this.umbrella.registerOfficeAddressZipCode.preset = umbrellaFund.registerOfficeAddressZipCode;
        this.umbrella.registerOfficeAddressCity.preset = umbrellaFund.registerOfficeAddressCity;
        this.setListItemPreset(this.umbrella.registerOfficeAddressCountry, umbrellaFund.domicile);
        this.setListItemPreset(this.umbrella.domicile, umbrellaFund.domicile);
        this.umbrella.umbrellaFundCreationDate.preset = umbrellaFund.umbrellaFundCreationDate;
        this.setListItemPreset(this.umbrella.managementCompanyID, umbrellaFund.managementCompanyID);
        this.setListItemPreset(this.umbrella.fundAdministratorID, umbrellaFund.fundAdministratorID);
        this.setListItemPreset(this.umbrella.custodianBankID, umbrellaFund.custodianBankID);
        this.setListItemPresetMultiple(this.umbrella.investmentAdvisorID, umbrellaFund.investmentAdvisorID);
        this.setListItemPresetMultiple(this.umbrella.payingAgentID, umbrellaFund.payingAgentID);

        this.umbrellaOptionnal.giin.preset = umbrellaFund.giin;
        this.setListItemPreset(
            this.umbrellaOptionnal.delegatedManagementCompanyID,
            umbrellaFund.delegatedManagementCompanyID,
        );
        this.setListItemPreset(this.umbrellaOptionnal.auditorID, umbrellaFund.auditorID);
        this.setListItemPreset(this.umbrellaOptionnal.taxAuditorID, umbrellaFund.taxAuditorID);
        this.setListItemPresetMultiple(this.umbrellaOptionnal.principlePromoterID, umbrellaFund.principlePromoterID);
        this.setListItemPreset(this.umbrellaOptionnal.legalAdvisorID, umbrellaFund.legalAdvisorID);
        this.umbrellaOptionnal.directors.preset = umbrellaFund.directors;
        this.umbrellaOptionnal.internalReference.preset = umbrellaFund.internalReference;
        this.umbrellaOptionnal.additionalNotes.preset = umbrellaFund.additionalNotes;
    }

    updateUmbrella(umbrellaFund?: any) {
        if (!umbrellaFund) {
            this.umbrellaFundID = null;
            Object.keys(this.umbrella).forEach((key) => {
                this.umbrella[key].control.reset();
            });
            Object.keys(this.umbrellaOptionnal).forEach((key) => {
                this.umbrellaOptionnal[key].control.reset();
            });
            return;
        }
        this.umbrella.umbrellaFundName.control.setValue(umbrellaFund.umbrellaFundName);
        this.umbrella.legalEntityIdentifier.control.setValue(umbrellaFund.legalEntityIdentifier);
        this.umbrella.registerOffice.control.setValue(umbrellaFund.registerOffice);
        this.umbrella.registerOfficeAddress.control.setValue(umbrellaFund.registerOfficeAddress);
        this.umbrella.registerOfficeAddressLine2.control.setValue(umbrellaFund.registerOfficeAddressLine2);
        this.umbrella.registerOfficeAddressZipCode.control.setValue(umbrellaFund.registerOfficeAddressZipCode);
        this.umbrella.registerOfficeAddressCity.control.setValue(umbrellaFund.registerOfficeAddressCity);
        this.setListItemValue(this.umbrella.registerOfficeAddressCountry, umbrellaFund.domicile);
        this.setListItemValue(this.umbrella.domicile, umbrellaFund.domicile);
        this.umbrella.umbrellaFundCreationDate.control.setValue(umbrellaFund.umbrellaFundCreationDate);
        this.setListItemValue(this.umbrella.managementCompanyID, umbrellaFund.managementCompanyID);
        this.setListItemValue(this.umbrella.fundAdministratorID, umbrellaFund.fundAdministratorID);
        this.setListItemValue(this.umbrella.custodianBankID, umbrellaFund.custodianBankID);
        this.setListItemValueMultiple(this.umbrella.investmentAdvisorID, umbrellaFund.investmentAdvisorID);
        this.setListItemValueMultiple(this.umbrella.payingAgentID, umbrellaFund.payingAgentID);

        this.umbrellaOptionnal.giin.control.setValue(umbrellaFund.giin);
        this.setListItemValue(
            this.umbrellaOptionnal.delegatedManagementCompanyID,
            umbrellaFund.delegatedManagementCompanyID,
        );
        this.setListItemValue(this.umbrellaOptionnal.auditorID, umbrellaFund.auditorID);
        this.setListItemValue(this.umbrellaOptionnal.taxAuditorID, umbrellaFund.taxAuditorID);
        this.setListItemValueMultiple(this.umbrellaOptionnal.principlePromoterID, umbrellaFund.principlePromoterID);
        this.setListItemValue(this.umbrellaOptionnal.legalAdvisorID, umbrellaFund.legalAdvisorID);
        this.umbrellaOptionnal.directors.control.setValue(umbrellaFund.directors);
        this.umbrellaOptionnal.internalReference.control.setValue(umbrellaFund.internalReference);
        this.umbrellaOptionnal.additionalNotes.control.setValue(umbrellaFund.additionalNotes);
    }

    private setDocumentItem(formItem: FormItem, str: any): void {
        if (!str) return null;

        const arr = str.split('|');

        formItem.preset = arr[0];
        formItem.fileData = {
            fileID: arr[0],
            hash: arr[1],
            name: arr[2],
        };

        if (!this.isProduction) formItem.required = false;
    }

    private setDocumentItemValue(formItem: FormItem, str: any): void {
        if (!str) return null;

        const arr = str.split('|');

        formItem.control.setValue(arr[0]);
        formItem.fileData = {
            fileID: arr[0],
            hash: arr[1],
            name: arr[2],
        };

        if (!this.isProduction) formItem.required = false;
    }

    private generateJSONString(model): string {
        const json = {};

        _.forEach(model, (item: FormItem, index: string) => {
            if (typeof item.value === 'function'){
                json[index] = item.value();
            }
        });

        return JSON.stringify(json);
    }

    private applyOptionalData(target: { [key: string]: FormItem }, optionalData: { [key: string]: any }): void {
        _.forEach(optionalData, (val: any, index: string) => {
            this.applyValueToExistingFormItem(target[index], val);
        });
    }

    private applyValueToExistingFormItem(field: FormItem, value: any): void {
        if (!field) return;

        if (field.type === FormItemType.list) {
            this.setListItemPresetFromOptional(field, value);
        } else {
            field.preset = value;
        }
    }

    private setListItemPresetFromOptional(field: FormItem, value: any): void {
        if (value == undefined) return;
        (field.preset as any) = value;
    }

    private setListItemPreset(field: FormItem, value: any): void {
        if (value == undefined) return;
        (field.preset as any) = [_.find(field.listItems, (item) => {
            return item.id == value;
        })];
    }

    private setListItemPresetMultiple(field: FormItem, value: number[]): void {
        if (!value || !value.length) return;
        (field.preset as any) = value.map((id: number) => {
            const newItem = _.find(field.listItems, { id });
            if (!newItem) {
                return null;
            }
            return newItem;
        }).filter(d => d !== null);
    }

    private setListItemValue(field: FormItem, value: any): void {
        if (!value && value !== 0) {
            field.control.setValue([]);
            return;
        }
        field.control.setValue([_.find(field.listItems, (item) => {
            return item.id === value;
        })]);
    }

    private setListItemValueMultiple(field: FormItem, value: number[]): void {
        if (!value || !value.length) {
            field.control.setValue([]);
            return;
        }
        const newValue = value
        .map((id: number) => {
            const newItem = _.find(field.listItems, { id });
            if (!newItem) {
                return null;
            }
            return newItem;
        })
        .filter(d => d !== null);
        field.control.setValue(newValue);
    }

    private setFeederPreset(value: any): void {
        const preset = (!value || value === 0) ?
            [this.keyFacts.mandatory.feeder.listItems[0]] :
            [_.find(this.keyFacts.mandatory.feeder.listItems, (item) => {
                return item.id == value;
            })];

        (this.keyFacts.mandatory.feeder.preset as any) = preset;
    }

    private setFeederValue(value: any): void {
        const preset = (!value || value === 0)
            ? [this.keyFacts.mandatory.feeder.listItems[0]]
            : [_.find(this.keyFacts.mandatory.feeder.listItems, item => item.id === value)];

        this.keyFacts.mandatory.feeder.control.setValue(preset);
    }

    private convertArrayToJSON(arr: any[]): string {
        if ((!arr) || arr.length === 0) return null;

        return JSON.stringify(arr);
    }

    private isStatusMaster(): boolean {
        if (!this.keyFacts.mandatory.status.value() || this.keyFacts.mandatory.status.value().length === 0) return null;

        return parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Master;
    }

    private getStatusFeederValue(): number {
        if (!!this.keyFacts.mandatory.status.value() && this.keyFacts.mandatory.status.value().length > 0 && parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Feeder) {
            return this.keyFacts.mandatory.feeder.value()[0].id;
        }
        return 0;
    }

    private getSelectValue(formItem: FormItem): any {
        const rawValue = formItem.value();
        return (rawValue != undefined) && rawValue.length ? rawValue[0].id : null;
    }

    disableAllShareFields() {
        // NOTE: this.calendar.subscriptionTradeCycle and this.calendar.redemptionTradeCycle models
        // are generated in FundShareTradeCycleComponent and processed in FundShareComponent
        // so there are weird dependencies between models and components
        // this is why these two are not disabled here
        // 🙏 please forgive me 🙏
        const shareKeys = [
            this.keyFacts,
            this.characteristic,
            this.fees,
            this.listing,
            this.priip,
            this.profile,
            this.representation,
            this.solvency,
            this.taxation,
            this.documents,
        ];

        shareKeys.forEach((shareKey) => {
            Object.keys(shareKey).forEach((subKey) => {
                Object.keys(shareKey[subKey]).forEach((field) => {
                    if(typeof shareKey[subKey][field].control !== 'undefined') {
                        shareKey[subKey][field].control.disable();
                        shareKey[subKey][field].required = false;
                    }
                });
            });
        });

        Object.keys(this.calendarSubscription.mandatory).forEach((field) => {
            if(typeof this.calendarSubscription.mandatory[field].control !== 'undefined') {
                this.calendarSubscription.mandatory[field].control.disable();
                this.calendarSubscription.mandatory[field].required = false;
            }
        });

        Object.keys(this.calendarRedemption.mandatory).forEach((field) => {
            if(typeof this.calendarRedemption.mandatory[field].control !== 'undefined') {
                this.calendarRedemption.mandatory[field].control.disable();
                this.calendarRedemption.mandatory[field].required = false;
            }
        });
    }

    isReady() {
        return !!_.get(this.keyFacts.mandatory.isin, ['control', 'setValue'], false);
    }

    /**
     * Attach dynamic form properties form and formKeys
     * be aware, we mute the dynamicModel here and passing object around by reference.
     */
    attchDynamicFormProperties(dynamicModel) {
        const form = this.dynamicFormService.generateForm(dynamicModel);
        const formKeys = this.dynamicFormService.getFormKeys(dynamicModel);
        this.dynamicFormService.updateModel(dynamicModel, form);
        dynamicModel.formObj = form;
        dynamicModel.formKeysObj = formKeys;
        return dynamicModel;
    }
}

export enum FundShareMode {
    Create,
    Read,
    Update,
}

export enum userTypeEnum {
    INVESTOR = 46,
    AM = 36,
    ADMIN = 35,
}

