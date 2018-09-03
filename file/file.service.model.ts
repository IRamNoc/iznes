import { MemberNodeMessageBody } from '@setl/utils/common';

export interface AddFileMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    files: string;
    secure?: boolean;
    path?: string;
}

export interface GetHistoricalCsvMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    dateFrom: string;
    dateTo: string;
}

export interface ValidateFileMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    fileHash: string;
}
