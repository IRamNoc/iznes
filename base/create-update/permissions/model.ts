import { MemberNodeMessageBody } from '@setl/utils/common';

export interface UserTeamsPermission {
    permissionID: number;
    name: string;
    description: string;
    isActivated?: boolean;
}
