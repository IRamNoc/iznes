import { MemberNodeMessageBody } from '../../utils/common';

export interface BaseUserPreferenceRequestBody extends MemberNodeMessageBody {
    token: string;
    key: string;
    walletId?: number;
}

export interface SaveUserPreferenceRequestBody extends BaseUserPreferenceRequestBody {
    value: string;
}
