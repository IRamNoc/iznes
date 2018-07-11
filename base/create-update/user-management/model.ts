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

export interface UserMgmtColumn {
    id: string;
    dataIndex: string;
    styleClass: string;
    title: string;
}

export interface UserMgmtDataGridConfig {
    idIndex: string;
    columns: UserMgmtColumn[];
}

export enum UserMgmtState {
    Default,
    Processing,
    Empty,
}
