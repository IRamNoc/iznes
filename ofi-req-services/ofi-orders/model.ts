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
