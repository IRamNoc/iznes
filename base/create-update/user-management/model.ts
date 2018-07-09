import { MemberNodeMessageBody } from '@setl/utils/common';

export interface UpdateTeamUserMapRequest extends MemberNodeMessageBody {
    token: string;
    state: boolean;
    userID: number;
    userTeamID: number;
}

export interface ReadTeamUserMapRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
    userTeamID: number;
}

export enum UserMgmtState {
    Default,
    Processing,
    Empty,
}
