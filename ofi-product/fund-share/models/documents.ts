import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';

export class ShareDocumentsMandatory extends DynamicFormsValidator {
    prospectus: FormItem = {
        type: FormItemType.file,
        label: 'Prospectus',
        required: true,
        filePermission: 0,
        mltag: 'txt_fundshare_prospectus'
    }
    kiid: FormItem = {
        type: FormItemType.file,
        label: 'KIID (Key Investor Information Document )',
        required: true,
        filePermission: 0,
        mltag: 'txt_fundshare_kiid'
    }
}

export class ShareDocumentsOptional extends DynamicFormsValidator {
    annualActivityReport: FormItem = {
        type: FormItemType.file,
        label: 'Annual Activity Report',
        required: false,
        mltag: 'txt_fundshare_annualactreport'
    }
    semiAnnualSummary: FormItem = {
        type: FormItemType.file,
        label: 'Semi-annual Summary',
        required: false,
        mltag: 'txt_fundshare_semiannsum'
    }
    sharesAllocation: FormItem = {
        type: FormItemType.file,
        label: 'Shares Allocation',
        required: false,
        mltag: 'txt_fundshare_sharesallocation'
    }
    sriPolicy: FormItem = {
        type: FormItemType.file,
        label: 'SRI Policy (Socially Responsible Investment)',
        required: false,
        mltag: 'txt_fundshare_sripolicy'
    }
    transparencyCode: FormItem = {
        type: FormItemType.file,
        label: 'Transparency Code',
        required: false,
        mltag: 'txt_fundshare_transcode'
    }
    businessLetter: FormItem = {
        type: FormItemType.file,
        label: 'Business Letter',
        required: false,
        mltag: 'txt_fundshare_businessletter'
    }
    productSheet: FormItem = {
        type: FormItemType.file,
        label: 'Product Sheet',
        required: false,
        mltag: 'txt_fundshare_productsheet'
    }
    monthlyFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Monthly Financial Report',
        required: false,
        mltag: 'txt_fundshare_monfinreport'
    }
    monthlyExtraFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Monthly Extra-Financial Report',
        required: false,
        mltag: 'txt_fundshare_monextrafinreport'
    }
    quarterlyFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Quarterly Financial Report',
        required: false,
        mltag: 'txt_fundshare_quartfinreport'
    }
    quarterlyExtraFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Quarterly Extra-Financial Report',
        required: false,
        mltag: 'txt_fundshare_quartextrafinreport'
    }
    letterToShareholders: FormItem = {
        type: FormItemType.file,
        label: 'Letter to shareholders',
        required: false,
        mltag: 'txt_fundshare_lettershareholders'
    }
    kid: FormItem = {
        type: FormItemType.file,
        label: 'KIDs (Key Information Documents)',
        required: false,
        mltag: 'txt_fundshare_kid'
    }
    statutoryAuditorsCertification: FormItem = {
        type: FormItemType.file,
        label: 'Statutory Auditors Certification',
        required: false,
        mltag: 'txt_fundshare_auditcert'
    }
    ept: FormItem = {
        type: FormItemType.file,
        label: 'EPT (European PRIIPS Template)',
        required: false,
        mltag: 'txt_fundshare_ept'
    }
    emt: FormItem = {
        type: FormItemType.file,
        label: 'EMT (European MIF Template)',
        required: false,
        mltag: 'txt_fundshare_emt'
    }
    tpts2: FormItem = {
        type: FormItemType.file,
        label: 'TPTS2 (Third Parties Template Solvency 2)',
        required: false,
        mltag: 'txt_fundshare_tpts2'
    }
}
