import { MemberNodeMessageBody } from '@setl/utils/common';

export interface RequestPermissionListMessageBody extends MemberNodeMessageBody {
    token: string;
    userId: number;
    permissionName: string;
}
