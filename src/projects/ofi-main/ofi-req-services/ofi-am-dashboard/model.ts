import { MemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiRequestNavList extends OfiMemberNodeBody {
    fundName: string;
    navDate: string;
    status: number;
    pageNum: number;
    pageSize: number;
}

export interface OfiRequestWalletIdsByAddresses extends OfiMemberNodeBody {
    addresses: Array<string>;
}

export interface GetFundWithHoldersRequestData {
    fundId: number;
    selectedFilter?: number;
}

export interface AMGenerateAICRequestData {
    fromDate: string;
    isin: string;
    subportfolio: string;
    client: string;

}

export interface AMGenerateAICRequestBody extends MemberNodeMessageBody {
    token: string;
    fromDate: string;
    isin: string;
    subportfolio: string;
    client: string;

}
