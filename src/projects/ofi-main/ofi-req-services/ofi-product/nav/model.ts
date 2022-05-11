//import { MemberNodeMessageBody }from '@setl/utils/common'; //notcompile
import { MemberNodeMessageBody } from '../../../../utils/common'; //compile

export enum NavStatus {
    FINAL = -1,
    ALL_STATUS = 0,
    ESTIMATE = 1,
    PENDING = 2,
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
    navStatus: string;
}

export interface CancelNavMessageBody extends MemberNodeMessageBody {
    token: string;
    shareId: number;
    navDate: string;
}

export interface RequestNavAuditTrailMessageBody extends MemberNodeMessageBody {
    token: string;
    fundShareId: number;
    dateTo: string;
    dateFrom: string;
    offset: number;
    limit: number;
}

export interface UploadNavFileRequestData {
    navData: string;
    shareIsin?: string;
}

export interface UploadNavFileMessageBody extends MemberNodeMessageBody {
    RequestName: string;
    token: string;
    navData: string;
    shareIsin?: string;
}
