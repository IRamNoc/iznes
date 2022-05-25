import { MemberNodeMessageBody } from '@setl/utils/common';

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
    fundName?: any;
    shareName?: any;
    status?: any;
    orderType?: any;
    isin?: any;
    orderId?: any;
    currency?: any;
    quantity?: any;
    amountWithCost?: any;
    dateSearchField?: any;
    fromDate?: any;
    toDate?: any;
    pageSize?: any;
    rowOffset?: any;
    sortByField?: any;
    sortOrder?: any;
    isTransfer?: any;
    investorCompanyName?: any;
    portfolioLabel?: any;
}

export interface OfiIznAdminOrdersRequestBody extends OfiMemberNodeBody {
    fundName?: any;
    shareName?: any;
    status?: any;
    orderType?: any;
    isin?: any;
    orderId?: any;
    currency?: any;
    quantity?: any;
    amountWithCost?: any;
    dateSearchField?: any;
    fromDate?: any;
    toDate?: any;
    pageSize?: any;
    rowOffset?: any;
    sortByField?: any;
    sortOrder?: any;
    assetManagementCompany?: any;
    investorCompanyName?: any;
    portfolioLabel?: any;
    isTransfer?: any;
}

export interface OfiAmExportOrdersRequestBody extends OfiMemberNodeBody {
    filters: any;
}

export interface CancelOrderRequestData {
    orderID: number;
}

export interface OfiCancelOrderRequestBody extends OfiMemberNodeBody {
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
    reference: string;
}

export interface IznesMarkOrderSettleRequestBody extends MemberNodeMessageBody {
    token: string;
    orderId: number;
}

export interface ManageOrdersRequestData {
    fundName?: string;
    shareName?: string;
    status?: string;
    orderType?: number;
    isin?: any;
    orderID?: number;
    currency?: number;
    quantity?: number;
    amountWithCost?: number;
    dateSearchField?: string;
    fromDate?: string;
    toDate?: string;
    pageSize?: number;
    rowOffSet?: number;
    sortByField?: string;
    sortOrder?: string;
    assetManagementCompany?: string;
    investorCompanyName?: string;
    portfolioLabel?: string;
    isTransfer?: number;
}
