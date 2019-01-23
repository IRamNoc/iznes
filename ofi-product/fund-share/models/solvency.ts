import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareSolvencyOptional {
    mifidSecuritiesClassification: FormItem = {
        type: FormItemType.list,
        label: 'MiFID Securities Classification',
        required: false,
        listItems: [
            { id: E.MIFIDSecuritiesClassificationEnum.NonComplex, text: 'Non-complex instrument' },
            { id: E.MIFIDSecuritiesClassificationEnum.Complex, text: 'Complex instrument' },
            { id: E.MIFIDSecuritiesClassificationEnum.Others, text: 'Others' },
        ],
        style: [FormItemStyle.BreakOnAfter],
    };
    efamaMainEFCCategory: FormItem = {
        type: FormItemType.list,
        label: 'EFAMA Main EFC Category',
        required: false,
        listItems: [
            { id: E.EfamaMainEFCCategoryEnum.Equity, text: 'Equity' },
            { id: E.EfamaMainEFCCategoryEnum.Bond, text: 'Bond' },
            { id: E.EfamaMainEFCCategoryEnum.MultiAsset, text: 'Multi-Asset' },
            { id: E.EfamaMainEFCCategoryEnum.MoneyMarket, text: 'Money Market' },
            { id: E.EfamaMainEFCCategoryEnum.ARIS, text: 'ARIS' },
            { id: E.EfamaMainEFCCategoryEnum.Other, text: 'Other' },
        ],
    };
    efamaActiveEFCClassification: FormItem = {
        type: FormItemType.text,
        label: 'EFAMA Active EFC Classification',
        required: false,
    };
    hasTripartiteReport: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Tripartite Report',
        required: false,
    };
    lastTripartiteReportDate: FormItem = {
        type: FormItemType.date,
        label: 'Last Tripartite Report Date',
        required: false,
    };
    interestRateUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Up',
        required: false,
    }; // 1
    interestRateDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Down',
        required: false,
    }; // 1
    equityTypeI: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type I',
        required: false,
    }; // 1
    equityTypeII: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type II',
        required: false,
    }; // 1
    property: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Property',
        required: false,
    }; // 1
    spreadBonds: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Bonds',
        required: false,
    }; // 1
    spreadStructured: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Structured',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    }; // 1
    spreadDerivativesUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Up',
        required: false,
    }; // 1
    spreadDerivativesDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Down',
        required: false,
    }; // 1
    fxUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Up',
        required: false,
    }; // 1
    fxDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Down',
        required: false,
    }; // 1
}
