import * as _ from 'lodash';

import {FormItem, FormItemDropdown, FormItemType} from '@setl/utils';
import {OfiFundShare, OfiFundShareDocuments} from '@ofi/ofi-main';
import * as FundShareEnum from './FundShareEnum';
import {ShareCharacteristicMandatory} from './models/characteristic';
import {ShareCalendarMandatory} from './models/calendar';
import {ShareFeesMandatory, ShareFeesOptional} from './models/fees';
import {ShareKeyFactsMandatory, ShareKeyFactsOptional} from './models/keyFacts';
import {ShareListingOptional} from './models/listing';
import {SharePRIIPOptional} from './models/priip';
import {ShareProfileMandatory, ShareProfileOptional} from './models/profile';
import {ShareRepresentationOptional} from './models/representation';
import {ShareSolvencyOptional} from './models/solvency';
import {ShareTaxationOptional} from './models/taxation';
import {ShareFund} from './models/fund';
import {ShareUmbrellaFund} from './models/umbrella';
import {ShareDocumentsMandatory, ShareDocumentsOptional} from './models/documents';
import {FundShareTradeCycleModel} from './form/trade-cycle/model';
import * as PC from '../productConfig';

export {PanelData} from './models/panelData';

export class FundShare {
    fundID: number;
    umbrellaFundID: number;
    fundShareId: number;
    accountId: number;
    isProduction: boolean;

    fund = new ShareFund();
    umbrella = new ShareUmbrellaFund();
    calendar = {
        mandatory: new ShareCalendarMandatory(),
        subscriptionTradeCycle: null,
        redemptionTradeCycle: null
    }
    characteristic = {
        mandatory: new ShareCharacteristicMandatory()
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
        optional: new ShareProfileOptional()
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
            this.fees.mandatory.isValid() && this.keyFacts.mandatory.isValid() && this.profile.mandatory.isValid() &&
            this.documents.mandatory.isValid();
    }

    getRequest(): OfiFundShare {        
        return {
            accountId: this.accountId,
            fundShareName: this.keyFacts.mandatory.fundShareName.value(),
            fundShareID: this.fundShareId,
            fundID: this.fundID,
            isin: this.keyFacts.mandatory.isin.value(),
            shareClassCode: this.keyFacts.mandatory.shareClassCode.value(),
            shareClassInvestmentStatus: this.getSelectValue(this.keyFacts.mandatory.shareClassInvestmentStatus),
            subscriptionStartDate: this.keyFacts.mandatory.subscriptionStartDate.value(),
            launchDate: this.keyFacts.mandatory.shareLaunchDate.value(),
            shareClassCurrency: this.getSelectValue(this.keyFacts.mandatory.shareClassCurrency),
            valuationFrequency: this.getSelectValue(this.keyFacts.mandatory.valuationFrequency),
            historicOrForwardPricing: this.getSelectValue(this.keyFacts.mandatory.historicOrForwardPricing),
            hasCoupon: this.keyFacts.mandatory.hasCoupon.value(),
            couponType: this.getSelectValue(this.keyFacts.mandatory.couponType),
            freqOfDistributionDeclaration: this.getSelectValue(this.keyFacts.mandatory.freqOfDistributionDeclaration),
            status: this.getSelectValue(this.keyFacts.mandatory.status),
            master: this.isStatusMaster(),
            feeder: this.getStatusFeederValue(),
            maximumNumDecimal: this.characteristic.mandatory.maximumNumDecimal.value(),
            subscriptionCategory: this.getSelectValue(this.characteristic.mandatory.subscriptionCategory),
            subscriptionCurrency: this.getSelectValue(this.characteristic.mandatory.subscriptionCurrency),
            minInitialSubscriptionInShare: this.characteristic.mandatory.minInitialSubscriptionInShare.value(),
            minInitialSubscriptionInAmount: this.characteristic.mandatory.minInitialSubscriptionInAmount.value(),
            minSubsequentSubscriptionInShare: this.characteristic.mandatory.minSubsequentSubscriptionInShare.value(),
            minSubsequentSubscriptionInAmount: this.characteristic.mandatory.minSubsequentSubscriptionInAmount.value(),
            redemptionCategory: this.getSelectValue(this.characteristic.mandatory.redemptionCategory),
            redemptionCurrency: this.getSelectValue(this.characteristic.mandatory.redemptionCurrency),
            minInitialRedemptionInShare: this.characteristic.mandatory.minInitialRedemptionInShare.value(),
            minInitialRedemptionInAmount: this.characteristic.mandatory.minInitialRedemptionInAmount.value(),
            minSubsequentRedemptionInShare: this.characteristic.mandatory.minSubsequentRedemptionInShare.value(),
            minSubsequentRedemptionInAmount: this.characteristic.mandatory.minSubsequentRedemptionInAmount.value(),
            portfolioCurrencyHedge: this.getSelectValue(this.keyFacts.mandatory.portfolioCurrencyHedge),
            subscriptionCutOffTime: this.calendar.mandatory.subscriptionCutOffTime.value(),
            subscriptionCutOffTimeZone: this.getSelectValue(this.calendar.mandatory.subscriptionCutOffTimeZone),
            subscriptionSettlementPeriod: this.getSelectValue(this.calendar.mandatory.subscriptionSettlementPeriod),
            redemptionCutOffTime: this.calendar.mandatory.redemptionCutOffTime.value(),
            redemptionCutOffTimeZone: this.getSelectValue(this.calendar.mandatory.redemptionCutOffTimeZone),
            redemptionSettlementPeriod: this.getSelectValue(this.calendar.mandatory.redemptionSettlementPeriod),
            subscriptionRedemptionCalendar: this.calendar.mandatory.subscriptionRedemptionCalendar.value(),
            maxManagementFee: this.fees.mandatory.maxManagementFee.value(),
            maxSubscriptionFee: this.fees.mandatory.maxSubscriptionFee.value(),
            maxRedemptionFee: this.fees.mandatory.maxRedemptionFee.value(),
            investorProfile: this.getSelectValue(this.profile.mandatory.investorProfile),
            mifiidChargesOngoing: this.fees.mandatory.mifiidChargesOngoing.value(),
            mifiidChargesOneOff: this.fees.mandatory.mifiidChargesOneOff.value(),
            mifiidTransactionCosts: this.fees.mandatory.mifiidTransactionCosts.value(),
            mifiidServicesCosts: this.fees.mandatory.mifiidServicesCosts.value(),
            mifiidIncidentalCosts: this.fees.mandatory.mifiidIncidentalCosts.value(),
            subscriptionTradeCyclePeriod: (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleSubscriptionsWithinPeriod: (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklySubscriptionDealingDays: this.convertArrayToJSON((this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays),
            monthlySubscriptionDealingDays: this.convertArrayToJSON((this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlySubscriptionDealingDays: this.convertArrayToJSON((this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            redemptionTradeCyclePeriod: (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod,
            numberOfPossibleRedemptionsWithinPeriod: (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).numberOfPossibleWithinPeriod,
            weeklyRedemptionDealingDays: this.convertArrayToJSON((this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays),
            monthlyRedemptionDealingDays: this.convertArrayToJSON((this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays),
            yearlyRedemptionDealingDays: this.convertArrayToJSON((this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays),
            navPeriodForSubscription: this.getSelectValue(this.calendar.mandatory.navPeriodForSubscription),
            navPeriodForRedemption: this.getSelectValue(this.calendar.mandatory.navPeriodForRedemption),
            keyFactOptionalData: this.generateJSONString(this.keyFacts.optional),
            profileOptionalData: this.generateJSONString(this.profile.optional),
            priipOptionalData: this.generateJSONString(this.priip.optional),
            listingOptionalData: this.generateJSONString(this.listing.optional),
            taxationOptionalData: this.generateJSONString(this.taxation.optional),
            solvencyIIOptionalData: this.generateJSONString(this.solvency.optional),
            representationOptionalData: this.generateJSONString(this.representation.optional)
        }
    }

    setFundShare(fundShare: OfiFundShare): void {
        this.fundID = fundShare.fundID;
        this.keyFacts.mandatory.fundShareName.preset = fundShare.fundShareName;
        this.keyFacts.mandatory.isin.preset = fundShare.isin;
        this.keyFacts.mandatory.shareClassCode.preset = fundShare.shareClassCode;
        this.setListItemPreset(this.keyFacts.mandatory.shareClassInvestmentStatus, fundShare.shareClassInvestmentStatus);
        this.keyFacts.mandatory.subscriptionStartDate.preset = fundShare.subscriptionStartDate;
        this.keyFacts.mandatory.shareLaunchDate.preset = fundShare.launchDate;
        this.setListItemPreset(this.keyFacts.mandatory.shareClassCurrency, fundShare.shareClassCurrency);
        this.setListItemPreset(this.keyFacts.mandatory.valuationFrequency, fundShare.valuationFrequency);
        this.setListItemPreset(this.keyFacts.mandatory.historicOrForwardPricing, fundShare.historicOrForwardPricing);
        this.keyFacts.mandatory.hasCoupon.preset = fundShare.hasCoupon;
        this.setListItemPreset(this.keyFacts.mandatory.couponType, fundShare.couponType);
        this.setListItemPreset(this.keyFacts.mandatory.freqOfDistributionDeclaration, fundShare.freqOfDistributionDeclaration);
        this.setListItemPreset(this.keyFacts.mandatory.status, fundShare.status);
        this.setFeederPreset(fundShare.feeder);
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
        this.setListItemPreset(this.keyFacts.mandatory.portfolioCurrencyHedge, fundShare.portfolioCurrencyHedge);
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
        this.fees.mandatory.mifiidChargesOngoing.preset = fundShare.mifiidChargesOngoing;
        this.fees.mandatory.mifiidChargesOneOff.preset = fundShare.mifiidChargesOneOff;
        this.fees.mandatory.mifiidTransactionCosts.preset = fundShare.mifiidTransactionCosts;
        this.fees.mandatory.mifiidServicesCosts.preset = fundShare.mifiidServicesCosts;
        this.fees.mandatory.mifiidIncidentalCosts.preset = fundShare.mifiidIncidentalCosts;
        
        this.applyOptionalData((this.keyFacts.optional as any), JSON.parse(fundShare.keyFactOptionalData));
        this.applyOptionalData((this.profile.optional as any), JSON.parse(fundShare.profileOptionalData));
        this.applyOptionalData((this.priip.optional as any), JSON.parse(fundShare.priipOptionalData));
        this.applyOptionalData((this.listing.optional as any), JSON.parse(fundShare.listingOptionalData));
        this.applyOptionalData((this.taxation.optional as any), JSON.parse(fundShare.taxationOptionalData));
        this.applyOptionalData((this.solvency.optional as any), JSON.parse(fundShare.solvencyIIOptionalData));
        this.applyOptionalData((this.representation.optional as any), JSON.parse(fundShare.representationOptionalData));
        
        this.fundID = fundShare.fundID;
    }

    setSubscriptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays = JSON.parse(fundShare.weeklySubscriptionDealingDays);
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays = JSON.parse(fundShare.monthlySubscriptionDealingDays);
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays = JSON.parse(fundShare.yearlySubscriptionDealingDays);
        this.setListItemPreset(this.calendar.mandatory.navPeriodForSubscription, fundShare.navPeriodForSubscription);
        (this.calendar.subscriptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod = fundShare.subscriptionTradeCyclePeriod;
    }

    setRedemptionTradeCycleData(fundShare: OfiFundShare): void {
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).weeklyDealingDays = JSON.parse(fundShare.weeklyRedemptionDealingDays);
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).monthlyDealingDays = JSON.parse(fundShare.monthlyRedemptionDealingDays);
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).yearlyDealingDays = JSON.parse(fundShare.yearlyRedemptionDealingDays);
        this.setListItemPreset(this.calendar.mandatory.navPeriodForRedemption, fundShare.navPeriodForRedemption);
        (this.calendar.redemptionTradeCycle as FundShareTradeCycleModel).tradeCyclePeriod = fundShare.redemptionTradeCyclePeriod;
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
            tpts2: this.documents.optional.tpts2.value()
        }
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
        this.setDocumentItem(this.documents.optional.monthlyExtraFinancialReport, fundShareDocs.monthlyExtraFinancialReport);
        this.setDocumentItem(this.documents.optional.monthlyFinancialReport, fundShareDocs.monthlyFinancialReport);
        this.setDocumentItem(this.documents.optional.productSheet, fundShareDocs.productSheet);
        this.setDocumentItem(this.documents.optional.quarterlyExtraFinancialReport, fundShareDocs.quarterlyExtraFinancialReport);
        this.setDocumentItem(this.documents.optional.quarterlyFinancialReport, fundShareDocs.quarterlyFinancialReport);
        this.setDocumentItem(this.documents.optional.semiAnnualSummary, fundShareDocs.semiAnnualSummary);
        this.setDocumentItem(this.documents.optional.sharesAllocation, fundShareDocs.sharesAllocation);
        this.setDocumentItem(this.documents.optional.sriPolicy, fundShareDocs.sriPolicy);
        this.setDocumentItem(this.documents.optional.statutoryAuditorsCertification, fundShareDocs.statutoryAuditorsCertification);
        this.setDocumentItem(this.documents.optional.tpts2, fundShareDocs.tpts2);
        this.setDocumentItem(this.documents.optional.transparencyCode, fundShareDocs.transparencyCode);
    }

    setFund(fund: any): void {
        this.umbrellaFundID = fund.umbrellaFundID;
        this.fund.name.preset = fund.fundName;
        this.fund.aumFund.preset = fund.fundName;
        this.fund.aumFundDate.preset = fund.fundName;
        this.fund.LEI.preset = fund.legalEntityIdentifier;
        this.fund.fundRegisteredOfficeName.preset = fund.registerOffice;
        this.fund.fundRegisteredOfficeAddress.preset = fund.registerOfficeAddress;
        this.setListItemPreset(this.fund.domicile, fund.domicile);
        this.fund.isEUDirectiveRelevant.preset = fund.isEuDirective;
        this.setListItemPreset(this.fund.legalForm, fund.legalForm);
        this.fund.nationalNomenclature.listItems = PC.fundItems.nationalNomenclatureOfLegalFormItems[fund.legalForm];
        this.setListItemPreset(this.fund.nationalNomenclature, fund.nationalNomenclatureOfLegalForm);
        this.fund.creationDate.preset = fund.fundCreationDate;
        this.fund.launchDate.preset = fund.fundLaunchate;
        this.setListItemPreset(this.fund.currency, fund.fundCurrency);
        this.fund.openOrCloseEnded.preset = fund.openOrCloseEnded;
        this.fund.fiscalYearEnd.preset = fund.fiscalYearEnd;
        this.fund.isFundOfFunds.preset = fund.isFundOfFund;
        this.setListItemPreset(this.fund.managementCompany, fund.managementCompanyID);
        this.setListItemPreset(this.fund.fundAdministrator, fund.fundAdministrator);
        this.setListItemPreset(this.fund.custodianBank, fund.custodianBank);
        this.setListItemPreset(this.fund.investmentManager, fund.investmentManager);
        this.setListItemPreset(this.fund.principalPromoter, fund.principalPromoter);
        this.setListItemPreset(this.fund.payingAgent, fund.payingAgent);
        this.setListItemPreset(this.fund.fundManagers, fund.fundManagers);
        this.fund.isDedicatedFund.preset = fund.isDedicatedFund;
        this.setListItemPreset(this.fund.portfolioCurrencyHedge, fund.portfolioCurrencyHedge);
    }

    setUmbrellaFund(umbrellaFund: any): void {
        this.umbrella.umbrellaFundName.preset = umbrellaFund.umbrellaFundName;
        this.umbrella.registerOffice.preset = umbrellaFund.registerOffice;
        this.umbrella.registerOfficeAddress.preset = umbrellaFund.registerOfficeAddress;
        this.umbrella.legalEntityIdentifier.preset = umbrellaFund.legalEntityIdentifier;
        this.setListItemPreset(this.umbrella.domicile, umbrellaFund.domicile);
        this.umbrella.umbrellaFundCreationDate.preset = umbrellaFund.umbrellaFundCreationDate;
        this.setListItemPreset(this.umbrella.managementCompanyID, umbrellaFund.managementCompanyID);
        this.setListItemPreset(this.umbrella.fundAdministratorID, umbrellaFund.fundAdministratorID);
        this.setListItemPreset(this.umbrella.custodianBankID, umbrellaFund.custodianBankID);
        this.setListItemPreset(this.umbrella.investmentAdvisorID, umbrellaFund.investmentAdvisorID);
        this.setListItemPreset(this.umbrella.payingAgentID, umbrellaFund.payingAgentID);
    }

    private setDocumentItem(formItem: FormItem, str: any): void {
        if(!str) return null;
        
        const arr = str.split('|');

        formItem.preset = arr[0];
        formItem.fileData = {
            fileID: arr[0],
            hash: arr[1],
            name: arr[2]
        }

        if(!this.isProduction) formItem.required = false;
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
        if(!field) return;
        
        if(field.type === FormItemType.list) {
            this.setListItemPresetFromOptional(field, value);
        } else {
            field.preset = value;
        }
    }

    private setListItemPresetFromOptional(field: FormItem, value: any): void {
        if(value == undefined) return;
        (field.preset as any) = value;
    }

    private setListItemPreset(field: FormItem, value: any): void {
        if(value == undefined) return;
        (field.preset as any) = [_.find(field.listItems, (item) => {
            return item.id == value;
        })];
    }

    private setFeederPreset(value: any): void {
        const preset = (!value || value === 0) ?
            [this.keyFacts.mandatory.feeder.listItems[0]] :
            [_.find(this.keyFacts.mandatory.feeder.listItems, (item) => {
                return item.id == value;
            })];
            
        (this.keyFacts.mandatory.feeder.preset as any) = preset;
    }

    private convertArrayToJSON(arr: any[]): string {
        if((!arr) || arr.length === 0) return null;

        return JSON.stringify(arr);
    }

    private isStatusMaster(): boolean {
        return parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Master;
    }

    private getStatusFeederValue(): number {
        if(parseInt(this.keyFacts.mandatory.status.value()[0].id) === FundShareEnum.StatusEnum.Feeder) {
            return this.keyFacts.mandatory.feeder.value()[0].id;
        } else {
            return 0;
        }
    }

    private getSelectValue(formItem: FormItem): any {
        const rawValue = formItem.value();

        return (rawValue != undefined) && rawValue.length ? rawValue[0].id : null;
    }
}

export enum FundShareMode {
    Create,
    Update
}