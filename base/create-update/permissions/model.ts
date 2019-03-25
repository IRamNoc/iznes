import { MemberNodeMessageBody } from '@setl/utils/common';

export interface AccountAdminPermission {
    permissionAreaID: number;
    parentID: number;
    name: string;
    description: string;
    _state?: boolean;
    state?: boolean;
    hidden?: boolean;
    touched?: boolean;
}

export interface ReadTeamPermissionAreasRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
}

export interface ReadUserPermissionAreasRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
}

export interface UpdateTeamPermissionRequest extends MemberNodeMessageBody {
    token: string;
    userTeamId: number
    toAdd: number[],
    toDelete: number[],
}
