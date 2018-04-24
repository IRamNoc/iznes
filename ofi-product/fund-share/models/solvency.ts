import {FormItem, FormItemType, FormItemStyle} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareSolvencyOptional {
    mifidSecuritiesClassification: FormItem = {
        type: FormItemType.list,
        label: 'MiFID Securities Classification',
        required: false,
        listItems: [
            { id: E.MIFIDSecuritiesClassificationEnum.NonComplex, text: 'Non-complex instrument' },
            { id: E.MIFIDSecuritiesClassificationEnum.Complex, text: 'Complex instrument' },
            { id: E.MIFIDSecuritiesClassificationEnum.Others, text: 'Others' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_mifidsecclass'
    }
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
            { id: E.EfamaMainEFCCategoryEnum.Other, text: 'Other' }
        ]
    }
    efamaActiveEFCClassification: FormItem = {
        type: FormItemType.text,
        label: 'EFAMA Active EFC Classification',
        required: false,
        mltag: 'txt_fundshare_efamaefccclass'
    }
    hasTripartiteReport: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Tripartite Report',
        required: false,
        mltag: 'txt_fundshare_hastripartite'
    }
    lastTripartiteReportDate: FormItem = {
        type: FormItemType.date,
        label: 'Last Tripartite Report Date',
        required: false,
        mltag: 'txt_fundshare_lasttripartitedate'
    }
    interestRateUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Up',
        required: false,
        mltag: 'txt_fundshare_interestrateup'
    } // 1
    interestRateDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Interest Rate Down',
        required: false,
        mltag: 'txt_fundshare_interestratedown'
    } // 1
    equityTypeI: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type I',
        required: false,
        mltag: 'txt_fundshare_equitytypei'
    }; // 1
    equityTypeII: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Equity Type II',
        required: false,
        mltag: 'txt_fundshare_equitytypeii'
    } // 1
    property: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Property',
        required: false,
        mltag: 'txt_fundshare_scrproperty'
    } // 1
    spreadBonds: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Bonds',
        required: false,
        mltag: 'txt_fundshare_spreadbonds'
    } // 1
    spreadStructured: FormItem = {
        type: FormItemType.text,
        label: 'SCR Market Spread Structured',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_spreadstructured'
    } // 1
    spreadDerivativesUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Up',
        required: false,
        mltag: 'txt_fundshare_spreadderivativesup'
    } // 1
    spreadDerivativesDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market Spread Derivatives Down',
        required: false,
        mltag: 'txt_fundshare_spreadderivativedown'
    } // 1
    fxUp: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Up',
        required: false,
        mltag: 'txt_fundshare_scrfxup'
    } // 1
    fxDown: FormItem = {
        type: FormItemType.number,
        label: 'SCR Market FX Down',
        required: false,
        mltag: 'txt_fundshare_scrfxdown'
    } // 1
}