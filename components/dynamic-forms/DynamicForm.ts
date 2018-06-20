import { FormControl, ValidatorFn } from '@angular/forms';
import { FilePermission } from '@setl/core-filedrop/drophandler/drophandler.component';

export interface FormItem {
    cssClass?: string;
    control?: FormControl;
    label: string;
    mltag?: string;
    preset?: string | number | boolean;
    style?: FormItemStyle[];
    type: FormItemType;
    validator?: ValidatorFn;
    value?: () => any;

    disabled?: boolean;
    hidden?: () => boolean;
    isBlockchainValue?: boolean;
    isValid?: () => boolean;
    required: boolean;

    listItems?: {
        id: string | number;
        text: string;
    }[];
    listAllowMultiple?: boolean;

    dateOptions?: { [key: string]: any };
    timeOptions?: { [key: string]: any };

    fileData?: any;
    filePermission?: FilePermission;
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
}

export enum FormItemStyle {
    SingleRow,
    BreakOnBefore,
    BreakOnAfter,
    WidthThird,
    WidthFourth,
}

export interface FormItemDropdown {
    id: any;
    text: string;
}
