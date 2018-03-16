import * as _ from 'lodash';
import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/core-dynamic-forms';
import * as E from '../FundShareEnum';

export class ShareCharacteristicMandatory extends DynamicFormsValidator {
    maximumNumDecimal: FormItem = {
        type: FormItemType.number,
        label: 'Maximal Number Of Possible Decimals Shares',
        required: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    subscriptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Subscription Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnAfter]
    }
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minInitialSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minInitialSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    redemptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter]
    }
    redemptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Redemption',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minInitialRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minInitialRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        }
    }
}

export class ShareCharacteristicOptional {
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        listItems: [
            { id: E.CurrencyHedgeEnum.NoHedge, text: 'No Hedge' },
            { id: E.CurrencyHedgeEnum.FullPortfolioHedge, text: 'Full Portfolio Hedge' },
            { id: E.CurrencyHedgeEnum.CurrencyOverlay, text: 'Currency overlay' },
            { id: E.CurrencyHedgeEnum.PartialHedge, text: 'Partial Hedge' }
        ]
    }
}