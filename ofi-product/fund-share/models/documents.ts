import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';

export class ShareDocumentsMandatory extends DynamicFormsValidator {
    prospectus: FormItem = {
        type: FormItemType.file,
        label: 'Prospectus',
        required: true,
        filePermission: 0,
    };
    kiid: FormItem = {
        type: FormItemType.file,
        label: 'KIID (Key Investor Information Document)',
        required: true,
        filePermission: 0,
    };
}

export class ShareDocumentsOptional extends DynamicFormsValidator {
    annualActivityReport: FormItem = {
        type: FormItemType.file,
        label: 'Annual Activity Report',
        required: false,
    };
    semiAnnualSummary: FormItem = {
        type: FormItemType.file,
        label: 'Semi-annual Summary',
        required: false,
    };
    sharesAllocation: FormItem = {
        type: FormItemType.file,
        label: 'Shares Allocation',
        required: false,
    };
    sriPolicy: FormItem = {
        type: FormItemType.file,
        label: 'SRI Policy (Socially Responsible Investment)',
        required: false,
    };
    transparencyCode: FormItem = {
        type: FormItemType.file,
        label: 'Transparency Code',
        required: false,
    };
    businessLetter: FormItem = {
        type: FormItemType.file,
        label: 'Business Letter',
        required: false,
    };
    productSheet: FormItem = {
        type: FormItemType.file,
        label: 'Product Sheet',
        required: false,
    };
    monthlyFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Monthly Financial Report',
        required: false,
    };
    monthlyExtraFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Monthly Extra-Financial Report',
        required: false,
    };
    quarterlyFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Quarterly Financial Report',
        required: false,
    };
    quarterlyExtraFinancialReport: FormItem = {
        type: FormItemType.file,
        label: 'Quarterly Extra-Financial Report',
        required: false,
    };
    letterToShareholders: FormItem = {
        type: FormItemType.file,
        label: 'Letter to shareholders',
        required: false,
    };
    kid: FormItem = {
        type: FormItemType.file,
        label: 'KIDs (Key Information Documents)',
        required: false,
    };
    statutoryAuditorsCertification: FormItem = {
        type: FormItemType.file,
        label: 'Statutory Auditors Certification',
        required: false,
    };
    ept: FormItem = {
        type: FormItemType.file,
        label: 'EPT (European PRIIPS Template)',
        required: false,
    };
    emt: FormItem = {
        type: FormItemType.file,
        label: 'EMT (European MIF Template)',
        required: false,
    };
    tpts2: FormItem = {
        type: FormItemType.file,
        label: 'TPTS2 (Third Parties Template Solvency 2)',
        required: false,
    };
}
