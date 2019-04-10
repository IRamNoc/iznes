import { FormItem } from '@setl/utils/index';

export interface DatagridFieldsModel {
    [propertyName: string]: {
        label: string,
        type: 'text'|'number'|'label'|'icon',
        options?: {
            pipe?: string,
            dateFormat?: string,
            icon?: string,
            labelMap?: {
                [value: string]: {
                    type: string,
                    text: string,
                },
            };
            // more here...
        },
    };
}

export interface DatagridListData {
    [propertyName: string]: string;
}

export interface DatagridSearchForm {
    [propertyName: string]: FormItem;
}
