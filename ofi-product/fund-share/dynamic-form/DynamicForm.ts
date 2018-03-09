import { FormControl, ValidatorFn } from '@angular/forms';

export interface FormItem {
    type: FormItemType;
    control?: FormControl;
    label: string;
    mltag?: string;
    required: boolean;
    preset?: string | number | boolean;
    validator?: ValidatorFn;
    conditional?: FormItem;
    readonly value?: string | number | boolean;

    listItems?: {
        id: string;
        text: string;
    }[]
}

export enum FormItemType {
    text,
    number,
    date,
    list,
    boolean
}