import { FormControl, ValidatorFn } from '@angular/forms';
import { FilePermission } from '@setl/core-filedrop';

export type FormElement = FormItem | FormHeader;

export interface FormItem {
    cssClass?: string;
    control?: FormControl;
    label: string;
    mltag?: string;
    placeholder?: string;
    preset?: string | number | boolean;
    style?: FormItemStyle[];
    type: FormItemType;
    validator?: ValidatorFn;
    value?: () => any;
    default?: () => any;
    maxLength?: number;
    disabled?: boolean;
    hidden?: () => boolean;
    isBlockchainValue?: boolean;
    isValid?: () => boolean;
    required: boolean;
    allowClear?: boolean;
    title?: string;
    hasHelpbox?: boolean;
    helpboxContent?: string;
radioOptions?:{key:string;value:string}[];
    listItems?: {
        id: string | number;
        text: string;
    }[];
    listAllowMultiple?: boolean;

    dateOptions?: { [key: string]: any };
    timeOptions?: { [key: string]: any };

    fileData?: any;
    filePermission?: FilePermission;
    checkboxLabel?: string;
    checkboxHint?: () => string;
}

export enum FormItemType {
    text,
    number,
    date,
    list,
    boolean,
    file,
    textarea,
    time,
    extendedDate,
    dateRange,
    checkbox,
    radio
}

export enum FormItemStyle {
    SingleRow,
    BreakOnBefore,
    BreakOnAfter,
    WidthThird,
    WidthFourth,
    TitleMargin,
    PullRightTwoCol,
}

export interface FormItemDropdown {
    id: any;
    text: string;
}

export interface FormHeader {
    cssClass?: string;
    id: string;
    tag: 'h2' | 'h3' | 'h4';
    text: string;
    style?: FormItemStyle[];
}

export function isFormHeader(element: FormElement) {
    return (element as FormHeader).tag;
}

export function isFormItem(element: FormElement) {
    return !(element as FormHeader).tag;
}
