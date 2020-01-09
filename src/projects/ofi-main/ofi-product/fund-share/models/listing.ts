import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareListingOptional {
    bloombergCodeOfListing: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Listing',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
    currency: FormItem = {
        type: FormItemType.text,
        label: 'Listing Currency',
        required: false,
    };
    date: FormItem = {
        type: FormItemType.date,
        label: 'Listing Date',
        required: false,
    };
    exchangePlace: FormItem = {
        type: FormItemType.text,
        label: 'Exchange Place',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
    };
    iNAVBloombergCode: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Bloomberg Code Of Listing',
        required: false,
    };
    iNAVReutersCode: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Reuters Code Of Listing',
        required: false,
    };
    inceptionPrice: FormItem = {
        type: FormItemType.number,
        label: 'Inception Price',
        required: false,
    };
    isPrimaryListing: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Primary Listing',
        required: false,
    };
    marketIdentifierCode: FormItem = {
        type: FormItemType.text,
        label: 'Market Identifier Code (ISO 10383)',
        required: false,
    };
    reutersCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Listing',
        required: false,
    };
    status: FormItem = {
        type: FormItemType.list,
        label: 'Status Of Listing',
        required: false,
        listItems: [
            { id: E.ListingStatus.Planned, text: 'Planned' },
            { id: E.ListingStatus.Active, text: 'Active' },
            { id: E.ListingStatus.Suspended, text: 'Suspended' },
            { id: E.ListingStatus.Delisted, text: 'Delisted' },
        ],
    };
}
