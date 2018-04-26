import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiRequestArrangements extends OfiMemberNodeBody {
    status: string;
    sortOrder: string;
    sortBy: string;
    partyType: string;
    pageSize: string;
    pageNum: string;
    asset: string;
    arrangementType: string;
}

export interface OfiAmOrdersRequestBody extends OfiMemberNodeBody {
    token: string;
    shareName?: any;
    status?: any;
    orderType?: any;
    isin?: any;
    orderID?: any;
    currency?: any;
    quantity?: any;
    amountWithCost?: any;
    dateSearchField?: any;
    fromDate?: any;
    toDate?: any;
    pageSize?: any;
    rowOffSet?: any;
    sortByField?: any;
    sortOrder?: any;
}

export interface OfiAmExportOrdersRequestBody extends OfiMemberNodeBody {
    token: string;
    filters: any;
}

export interface OfiCancelOrderRequestBody extends OfiMemberNodeBody {
    token: string;
    orderID: any;
}

export interface OfiUpdateArrangement extends OfiMemberNodeBody {
    arrangementId: string | number;
    walletId: string | number;
    status: string | number;
    price: string | number;
    deamonToken: number;
}

export interface OfiGetContractByOrder extends OfiMemberNodeBody {
    arrangementId: string | number;
    walletId: string | number;
}

export interface OfiGetArrangementCollectiveArchive extends MemberNodeMessageBody {
    token: string;
}

export interface IznesNewOrderRequestBody extends MemberNodeMessageBody {
    token: string;
    shareisin: string;
    portfolioid: number;
    subportfolio: string;
    dateby: string;
    datevalue: string;
    ordertype: string;
    orderby: string;
    ordervalue: number;
    comment: string;
}

export interface IznesMarkOrderSettleRequestBody extends MemberNodeMessageBody {
    token: string;
    orderId: number;
}
