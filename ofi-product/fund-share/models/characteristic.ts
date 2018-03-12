import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareCharacteristicMandatory {
    maxDecimalShares: FormItem = {
        type: FormItemType.number,
        label: 'Maximal Number Of Possible Decimals Shares',
        required: true
    }
    subscriptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Subscription Category',
        required: true,
        listItems: [
            { id: 'shares', text: 'Shares' },
            { id: 'amount', text: 'Amount' },
            { id: 'shares-and-amount', text: 'Shares and Amount' }
        ]
    }
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ]
    }
    minInitialSubscriptionShares: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Shares',
        required: true
    }
    minInitialSubscriptionAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Amount',
        required: true
    }
    minSubsequentSubscriptionShares: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Shares',
        required: true
    }
    minSubsequentSubscriptionAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Amount',
        required: true
    }
    redemptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Category',
        required: true,
        listItems: [
            { id: 'shares', text: 'Shares' },
            { id: 'amount', text: 'Amount' },
            { id: 'shares-and-amount', text: 'Shares and Amount' }
        ]
    }
    redemptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Redemption',
        required: true,
        listItems: [
            { id: 'EUR', text: 'EUR' },
            { id: 'GBP', text: 'GBP' },
            { id: 'USD', text: 'USD' }
        ]
    }
    minInitialRedemptionShares: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Shares',
        required: true
    }
    minInitialRedemptionAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Redemption In Amount',
        required: true
    }
    minSubsequentRedemptionShares: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Shares',
        required: true
    }
    minSubsequentRedemptionAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Amount',
        required: true
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