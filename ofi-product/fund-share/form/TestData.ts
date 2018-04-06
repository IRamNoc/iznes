import * as moment from 'moment';
import {FundShare, FundShareMode} from '../model';
import * as E from '../FundShareEnum';

export class FundShareTestData {
    constructor() {}

    static generate(model: FundShare) {
        model.keyFacts.mandatory.aumClass.preset = 1;
        model.keyFacts.mandatory.aumClassDate.preset = '2018-04-01';
        (model.keyFacts.mandatory.couponType.preset as any) = [{id: E.CouponTypeEnum.Interest, text: 'Interest' }];
        (model.keyFacts.mandatory.freqOfDistributionDeclaration.preset as any) = [{id: E.FrequencyOfDistributionDeclarationEnum.Daily, text: 'Daily' }];
        model.keyFacts.mandatory.fundShareName.preset = `Test Fund Share - ${moment().unix().toString()}`;
        model.keyFacts.mandatory.hasCoupon.preset = true;
        (model.keyFacts.mandatory.historicOrForwardPricing.preset as any) = [{id: E.PricingTypeEnum.Historic, text: 'Historic' }];
        model.keyFacts.mandatory.isin.preset = moment().unix().toString();
        model.keyFacts.mandatory.launchDate.preset = '2018-04-01';
        model.keyFacts.mandatory.master.preset = 'master';
        model.keyFacts.mandatory.nosClass.preset = 1;
        model.keyFacts.mandatory.nosClassDate.preset = '2018-04-01';
        (model.keyFacts.mandatory.shareClassCode.preset as any) = [{id: E.ClassCodeEnum.ClassA, text: 'Class A' }];
        (model.keyFacts.mandatory.shareClassCurrency.preset as any) = [{id: E.CurrencyEnum.EUR, text: 'EUR' }];
        (model.keyFacts.mandatory.shareClassInvestmentStatus.preset as any) = [{id: E.InvestmentStatusEnum.Open, text: 'Open' }];
        (model.keyFacts.mandatory.status.preset as any) = [{id: E.StatusEnum.Master, text: 'Master' }];
        model.keyFacts.mandatory.subscriptionStartDate.preset = '2018-04-01';
        (model.keyFacts.mandatory.valuationFrequency.preset as any) = [{id: E.ValuationFrequencyEnum.Daily, text: 'Daily' }];
        model.keyFacts.mandatory.valuationNAV.preset = 1;
        model.keyFacts.mandatory.valuationNAVDate.preset = '2018-04-01';

        model.characteristic.mandatory.maximumNumDecimal.preset = 1;
        model.characteristic.mandatory.minInitialRedemptionInAmount.preset = 1;
        model.characteristic.mandatory.minInitialRedemptionInShare.preset = 1;
        model.characteristic.mandatory.minInitialSubscriptionInAmount.preset = 1;
        model.characteristic.mandatory.minInitialSubscriptionInShare.preset = 1;
        model.characteristic.mandatory.minSubsequentRedemptionInAmount.preset = 1;
        model.characteristic.mandatory.minSubsequentRedemptionInShare.preset = 1;
        model.characteristic.mandatory.minSubsequentRedemptionInShare.preset = 1;
        model.characteristic.mandatory.minSubsequentSubscriptionInAmount.preset = 1;
        model.characteristic.mandatory.minSubsequentSubscriptionInShare.preset = 1;
        (model.characteristic.mandatory.redemptionCategory.preset as any) = [{id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }];
        (model.characteristic.mandatory.redemptionCurrency.preset as any) = [{id: E.CurrencyEnum.EUR, text: 'EUR' }];
        (model.characteristic.mandatory.subscriptionCategory.preset as any) = [{id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }];
        (model.characteristic.mandatory.subscriptionCurrency.preset as any) = [{id: E.CurrencyEnum.EUR, text: 'EUR' }];

        // (model.calendar.mandatory.subscriptionTradeCyclePeriod.preset as any) = [{ id: E.TradeCyclePeriodEnum.Daily, text: 'Daily' }];
        // model.calendar.mandatory.numberOfPossibleSubscriptionsWithinPeriod.preset = 1;
        // (model.calendar.mandatory.weeklySubscriptionDealingDays.preset as any) = [{ id: E.WeeklyDealingDaysEnum.Monday, text: 'Monday' }];
        // (model.calendar.mandatory.monthlySubscriptionDealingDays.preset as any) = [{ id: E.MonthlyDealingDaysEnum.First, text: '1st' }];
        // (model.calendar.mandatory.yearlySubscriptionDealingDays.preset as any) = [{ id: E.YearlyDealingDaysEnum.January, text: 'January' }];
        // (model.calendar.mandatory.redemptionTradeCyclePeriod.preset as any) = [{ id: E.TradeCyclePeriodEnum.Monthly, text: 'Monthly' }];
        // model.calendar.mandatory.numberOfPossibleRedemptionsWithinPeriod.preset = 1;
        // (model.calendar.mandatory.weeklyRedemptionDealingDays.preset as any) = [{ id: E.WeeklyDealingDaysAltEnum.CalendarDay, text: 'Calendar Day' }];
        // (model.calendar.mandatory.monthlyRedemptionDealingDays.preset as any) = [{ id: E.MonthlyDealingDaysEnum.Last, text: 'Last' }];
        // (model.calendar.mandatory.yearlyRedemptionDealingDays.preset as any) = [{ id: E.YearlyDealingDaysEnum, text: 'January' }];
        (model.calendar.mandatory.navPeriodForSubscription.preset as any) = [{ id: E.BusinessDaysEnum.Two, text: '2' }];
        (model.calendar.mandatory.navPeriodForRedemption.preset as any) = [{ id: E.BusinessDaysEnum.Two, text: '2' }];
        model.calendar.mandatory.redemptionCutOffTime.preset = '12:00:00';
        (model.calendar.mandatory.redemptionCutOffTimeZone.preset as any) = [{id: E.TimezonesEnum.UTC, text: 'UTC' }];
        model.calendar.mandatory.redemptionSettlementPeriod.preset = 1;
        model.calendar.mandatory.subscriptionCutOffTime.preset = '12:00:00';
        (model.calendar.mandatory.subscriptionCutOffTimeZone.preset as any) = [{id: E.TimezonesEnum.UTC, text: 'UTC' }];
        model.calendar.mandatory.subscriptionRedemptionCalendar.preset = 1;
        (model.calendar.mandatory.subscriptionSettlementPeriod.preset as any) = [{id: E.BusinessDaysEnum.One, text: '1' }];
        
        model.fees.mandatory.maxManagementFee.preset = 1;
        model.fees.mandatory.maxRedemptionFee.preset = 1;
        model.fees.mandatory.maxSubscriptionFee.preset = 1;
        model.fees.mandatory.miFIDIIAncillaryCharges.preset = 1;
        model.fees.mandatory.miFIDIIIncidentalCosts.preset = 1;
        model.fees.mandatory.miFIDIIOneOffCharges.preset = 1;
        model.fees.mandatory.miFIDIIOngoingCharges.preset = 1;
        model.fees.mandatory.miFIDIITransactionsCosts.preset = 1;

        (model.profile.mandatory.investorProfile.preset as any) = [{id: E.InvestorProfileEnum.AllInvestors, text: 'All Investors' }];

        return model;
    }
}