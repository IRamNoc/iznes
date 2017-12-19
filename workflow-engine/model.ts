import {MemberNodeMessageBody} from '@setl/utils/common';

export enum NavStatus {
    FINAL = -1,
    ALL_STATUS = 0,
    ESTIMATE = 1,
    PENDING = 2
}

export interface RequestNavListMessageBody extends MemberNodeMessageBody {
    token: string;
    fundName: string;
    navDate: string;
    status: NavStatus;
    pageNum: number;
    pageSize: number;
}

export interface RequestBasicMessageBody extends MemberNodeMessageBody {
    token: string;
    data: any;
}
