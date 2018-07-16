import { MemberNodeMessageBody } from '@setl/utils/common';

export interface AccountAdminPermission {
    permissionID: number;
    name: string;
    description: string;
    isActivated?: boolean;
}
