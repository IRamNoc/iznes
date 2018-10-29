import { MemberNodeMessageBody } from '@setl/utils/common';

export interface RequestAccountListMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface EditAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountId: number;
    accountName: string;
    description: string;
    wallet: number;
}

export interface AddAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountName: string;
    accountDescription: string;
    accountMember: number;
}

export interface DeleteAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountId: number;
}

export interface StatusNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RegisterNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface TruncateNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RemoveNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface TestNotificationsMessageBody extends MemberNodeMessageBody {
    token: string;
}
