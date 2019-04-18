import { FormItem } from '@setl/utils/index';

export interface DatagridFieldsInterface {
    [propertyName: string]: {
        label: string,
        type?: 'text'|'number'|'label'|'icon',
        options?: {
            pipe?: {
                name: string,
                params: any,
            },
            rightAlign: boolean,
            dateFormat?: string,
            icon?: string,
            labelMap?: {
                [value: string]: {
                    type: string,
                    text: string,
                },
            };
        },
    };
}

export interface DatagridListData {
    [propertyName: string]: string;
}

export interface DatagridSearchForm {
    [propertyName: string]: FormItem;
}

export interface ExportOptionsInterface {
    csv: boolean; // controls showing export btn
    csvFileName?: string; // include .csv
    pdf: boolean; // controls showing export btn
    pdfFileName?: string; // include .pdf
    pdfOptions?: {
        file: string; // template file name (excluding .html) - lives in /classes/pdf/templates in MemberNode
        title?: string;
        subtitle?: string;
        text?: string;
        rightAlign?: string[]; // array of listData property names to right align on PDF datagrid
        walletName?: string;
        date?: string;
        orientation?: 'portrait'|'landscape';
        border?: {
            top?: string; // default is 0, units: mm, cm, in, px (e.g. '20mm')
            right?: string;
            bottom?: string;
            left?: string;
        },
        footer?: {
            height?: string; // default is 0, units: mm, cm, in, px (e.g. '20mm')
            contents?: string; // html to add to the footer - use {{page}} of {{pages}} to print out page numbering
        };
    };
}
