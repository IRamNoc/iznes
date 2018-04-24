import {FormItem, FormItemType, FormItemStyle} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareListingOptional {
    bloombergCodeOfListing: FormItem = {
        type: FormItemType.text,
        label: 'Bloomberg Code Of Listing',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_bloombergcodelisting'
    }
    currency: FormItem = {
        type: FormItemType.text,
        label: 'Listing Currency',
        required: false,
        mltag: 'txt_fundshare_currency'
    }
    date: FormItem = {
        type: FormItemType.date,
        label: 'Listing Date',
        required: false,
        mltag: 'txt_fundshare_listingdate'
    }
    exchangePlace: FormItem = {
        type: FormItemType.text,
        label: 'Exchange Place',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_exchangeplace'
    }
    iNAVBloombergCode: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Bloomberg Code Of Listing',
        required: false,
        mltag: 'txt_fundshare_inavbloombergcode'
    }
    iNAVReutersCode: FormItem = {
        type: FormItemType.text,
        label: 'iNAV Reuters Code Of Listing',
        required: false,
        mltag: 'txt_fundshare_inavreuterscode'
    }
    inceptionPrice: FormItem = {
        type: FormItemType.number,
        label: 'Inception Price',
        required: false,
        mltag: 'txt_fundshare_inceptionprice'
    }
    isPrimaryListing: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Primary Listing',
        required: false,
        mltag: 'txt_fundshare_isprimarylisting'
    }
    marketIdentifierCode: FormItem = {
        type: FormItemType.text,
        label: 'Market Identifier Code (ISO 10383)',
        required: false,
        mltag: 'txt_fundshare_marketidentcode'
    }
    reutersCode: FormItem = {
        type: FormItemType.text,
        label: 'Reuters Code Of Listing',
        required: false,
        mltag: 'txt_fundshare_reuterscode'
    }
    status: FormItem = {
        type: FormItemType.list,
        label: 'Status Of Listing',
        required: false,
        listItems: [
            { id: E.ListingStatus.Planned, text: 'Planned' },
            { id: E.ListingStatus.Active, text: 'Active' },
            { id: E.ListingStatus.Suspended, text: 'Suspended' },
            { id: E.ListingStatus.Delisted, text: 'Delisted' }
        ],
        mltag: 'txt_fundshare_status'
    }
}