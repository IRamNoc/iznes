import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareCalendarMandatory {
    tradeDate: FormItem = {
        type: FormItemType.list,
        label: 'Trade Date',
        required: true,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' }
        ]
    }
    subscriptionCutOff: FormItem = {
        type: FormItemType.text,
        label: 'Cut-off Time For Subscription',
        required: true
    }
    subscriptionTZForCutOff: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: [
            { id: 'utc+11', text: 'UTC +11' },
            { id: 'utc+10', text: 'UTC +10' },
            { id: 'utc+9', text: 'UTC +9' },
            { id: 'utc+8', text: 'UTC +8' },
            { id: 'utc+7', text: 'UTC +7' },
            { id: 'utc+6', text: 'UTC +6' },
            { id: 'utc+5', text: 'UTC +5' },
            { id: 'utc+4', text: 'UTC +4' },
            { id: 'utc+3', text: 'UTC +3' },
            { id: 'utc+2', text: 'UTC +2' },
            { id: 'utc+1', text: 'UTC +1' },
            { id: 'utc', text: 'UTC' },
            { id: 'utc-1', text: 'UTC -1' },
            { id: 'utc-2', text: 'UTC -2' },
            { id: 'utc-3', text: 'UTC -3' },
            { id: 'utc-4', text: 'UTC -4' },
            { id: 'utc-5', text: 'UTC -5' },
            { id: 'utc-6', text: 'UTC -6' },
            { id: 'utc-7', text: 'UTC -7' },
            { id: 'utc-8', text: 'UTC -8' },
            { id: 'utc-9', text: 'UTC -9' },
            { id: 'utc-10', text: 'UTC -10' },
            { id: 'utc-11', text: 'UTC -11' }           
        ]
    }
    subscriptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Period For Subscription',
        required: true,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' }
        ]
    }
    redemptionCutOff: FormItem = {
        type: FormItemType.text,
        label: 'Cut-off Time For Redemption',
        required: true
    }
    redemptionTZForCutOff: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: [
            { id: 'utc+11', text: 'UTC +11' },
            { id: 'utc+10', text: 'UTC +10' },
            { id: 'utc+9', text: 'UTC +9' },
            { id: 'utc+8', text: 'UTC +8' },
            { id: 'utc+7', text: 'UTC +7' },
            { id: 'utc+6', text: 'UTC +6' },
            { id: 'utc+5', text: 'UTC +5' },
            { id: 'utc+4', text: 'UTC +4' },
            { id: 'utc+3', text: 'UTC +3' },
            { id: 'utc+2', text: 'UTC +2' },
            { id: 'utc+1', text: 'UTC +1' },
            { id: 'utc', text: 'UTC' },
            { id: 'utc-1', text: 'UTC -1' },
            { id: 'utc-2', text: 'UTC -2' },
            { id: 'utc-3', text: 'UTC -3' },
            { id: 'utc-4', text: 'UTC -4' },
            { id: 'utc-5', text: 'UTC -5' },
            { id: 'utc-6', text: 'UTC -6' },
            { id: 'utc-7', text: 'UTC -7' },
            { id: 'utc-8', text: 'UTC -8' },
            { id: 'utc-9', text: 'UTC -9' },
            { id: 'utc-10', text: 'UTC -10' },
            { id: 'utc-11', text: 'UTC -11' }           
        ]
    }
    redemptionSettlementPeriod: FormItem = {
        type: FormItemType.number,
        label: 'Settlement Period For Redemption',
        required: true,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' }
        ]
    }
    subscriptionRedemptionCalendar: FormItem = {
        type: FormItemType.number,
        label: 'Calendar of subscription/redemption',
        required: true,
        listItems: [
            { id: '?', text: '?' }
        ]
    } // 1
    holidayManagement: FormItem = {
        type: FormItemType.text,
        label: 'Holiday management',
        required: true
    } // 1
}