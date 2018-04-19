import { FormControl, ValidatorFn } from '@angular/forms';

export interface FormItem {
    type: FormItemType;
    control?: FormControl;
    label: string;
    mltag?: string;
    required: boolean;
    style?: FormItemStyle[];
    preset?: string | number | boolean;
    validator?: ValidatorFn;
    hidden?: () => boolean;
    disabled?: boolean;
    value?: () => any;
    isValid?: () => boolean;
    cssClass?: string;

    listItems?: {
        id: string | number;
        text: string;
    }[];
    listAllowMultiple?: boolean;

    dateOptions?: { [key: string]: any };

    fileData?: any;
}

export enum FormItemType {
    text,
    number,
    date,
    list,
    boolean,
    file
}

export enum FormItemStyle {
    SingleRow,
    BreakOnBefore,
    BreakOnAfter,
    WidthThird,
    WidthFourth
}

export interface FormItemDropdown {
    id: any;
    text: string;
}
