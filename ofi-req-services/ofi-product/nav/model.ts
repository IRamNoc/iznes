import {MemberNodeMessageBody} from '@setl/utils/common';

export enum NavStatus {
    FINAL = -1,
    ALL_STATUS = 0,
    ESTIMATE = 1,
    PENDING = 2
}

export interface RequestNavMessageBody extends MemberNodeMessageBody {
    token: string;
    shareId?: number;
    fundName: string;
    navDate: string;
    navDateField: 'navDate'|'navDatePublished';
    pageNum?: number;
    pageSize?: number;
}

export interface RequestNavFundHistoryMessageBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    navDateFrom: string;
    navDateTo: string;
}

export interface RequestNavFundLatestMessageBody extends MemberNodeMessageBody {
    token: string;
    fundShareId: number;
    navDate: string;
}

export interface UpdateNavMessageBody extends MemberNodeMessageBody {
    token: string;
    fundShareIsin: string;
    fundDate: string;
    navPublicationDate: string;
    price: number;
    priceStatus: NavStatus;
    force?: number;
}

export interface DeleteNavMessageBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    navDate: string;
}
