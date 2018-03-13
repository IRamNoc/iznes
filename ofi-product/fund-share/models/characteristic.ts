import * as _ from 'lodash';
import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/core-dynamic-forms';

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
            { id: 'shares', text: 'Shares' },
            { id: 'amount', text: 'Amount' },
            { id: 'shares-and-amount', text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnAfter]
    }
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minInitialSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || ['shares', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minInitialSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || ['shares', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    redemptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Category',
        required: true,
        listItems: [
            { id: 'shares', text: 'Shares' },
            { id: 'amount', text: 'Amount' },
            { id: 'shares-and-amount', text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter]
    }
    redemptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Redemption',
        required: true,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minInitialRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || ['shares', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minInitialRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || ['shares', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
    minSubsequentRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || ['amount', 'shares-and-amount'].indexOf(val[0].id) == -1;
        }
    }
}

export class ShareCharacteristicOptional {
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        listItems: [
            { id: 'no-hedge', text: 'No Hedge' },
            { id: 'full-portfolio-hedge', text: 'Full Portfolio Hedge' },
            { id: 'currency-overlay', text: 'Currency overlay' },
            { id: 'partial-hedge', text: 'Partial Hedge' }
        ]
    }
}