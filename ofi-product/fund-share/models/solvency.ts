import {FormItem, FormItemType, FormItemStyle} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareSolvencyOptional {
    mifidSecuritiesClassification: FormItem = {
        type: FormItemType.list,
        label: 'MiFID Securities Classification',
        required: false,
        listItems: [
            { id: 'Non-complex instrument', text: 'Non-complex instrument' },
            { id: 'Complex instrument', text: 'Complex instrument' },
            { id: 'Others', text: 'Others' }
        ],
        style: [FormItemStyle.BreakOnAfter]
    }
    efamaMainEFCCategory: FormItem = {
        type: FormItemType.list,
        label: 'EFAMA Main EFC Category',
        required: false,
        listItems: [
            { id: 'Equity', text: 'Equity' },
            { id: 'Bond', text: 'Bond' },
            { id: 'Multi-Asset', text: 'Multi-Asset' },
            { id: 'Money Market', text: 'Money Market' },
            { id: 'ARIS', text: 'ARIS' },
            { id: 'Other', text: 'Other' }
        ]
    }
    efamaActiveEFCClassification: FormItem = {
        type: FormItemType.text,
        label: 'EFAMA Active EFC Classification',
        required: true
    }
    hasTripartiteReport: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Tripartite Report',
        required: true
    }
    lastTripartiteReportDate: FormItem = {
        type: FormItemType.date,
        label: 'Last Tripartite Report Date',
        required: true
    }
    interestRateUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Up',
        required: true
    } // 1
    interestRateDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Down',
        required: true
    } // 1
    equityTypeI: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type I',
        required: true
    }; // 1
    equityTypeII: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type II',
        required: true
    } // 1
    property: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Property',
        required: true
    } // 1
    spreadBonds: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Bonds',
        required: true
    } // 1
    spreadStructured: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Structured',
        required: true,
        style: [FormItemStyle.BreakOnAfter]
    } // 1
    spreadDerivativesUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Up',
        required: true
    } // 1
    spreadDerivativesDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Down',
        required: true
    } // 1
    fxUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Up',
        required: true
    } // 1
    fxDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Down',
        required: true
    } // 1

}