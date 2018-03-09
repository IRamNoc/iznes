// export class ShareListing {
//     bloombergCodeOfListing?: string = ''; // 1
//     currency?: string = '';
//     date?: string = '';
//     exchangePlace?: string = ''; // 1
//     iNAVBloombergCode?: string = ''; // 1
//     iNAVReutersCode?: string = ''; //1
//     inceptionPrice?: number = null;
//     isPrimaryListing?: boolean = false;
//     marketIdentifierCode?: string = ''; // 1
//     reutersCode?: string = ''; // 1
//     status?: string = '';
// }

import {FormItem, FormItemType} from '../dynamic-form/DynamicForm';

export class ShareListing {
    bloombergCodeOfListing?: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Listing',
        required: false
    }
    currency?: FormItem = {
        type: FormItemType.text,
        label: 'Listing Currency',
        required: false
    }
    date?: FormItem = {
        type: FormItemType.text,
        label: 'Listing Date',
        required: false
    }
    exchangePlace?: FormItem = {
        type: FormItemType.text,
        label: 'Exchange Place',
        required: false
    }
    iNAVBloombergCode?: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Bloomberg Code Of Listing',
        required: false
    }
    iNAVReutersCode?: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Reuters Code Of Listing',
        required: false
    }
    inceptionPrice?: FormItem = {
        type: FormItemType.number,
        label: 'Inception Price',
        required: false
    }
    isPrimaryListing?: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Primary Listing',
        required: false
    }
    marketIdentifierCode?: FormItem = {
        type: FormItemType.text,
        label: 'Market Identifier Code (ISO 10383)',
        required: false
    }
    reutersCode?: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Listing',
        required: false
    }
    status?: FormItem = {
        type: FormItemType.text,
        label: 'Status Of Listing',
        required: false,
        listItems: [
            { id: 'planned', text: 'Planned' },
            { id: 'active', text: 'Active' },
            { id: 'suspended', text: 'Suspended' },
            { id: 'delisted', text: 'Delisted' }
        ]
    }
}