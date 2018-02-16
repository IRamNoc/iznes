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

export interface UpdateNavMessageBody extends MemberNodeMessageBody {
    token: string;
    fundName: string;
    fundDate: string;
    price: number;
    priceStatus: NavStatus;
    force?: number;
}



