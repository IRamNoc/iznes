import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import { MemberNodeMessageBody } from '@setl/utils/common';

export class AccountAdminUser {
    userId?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: any;
    reference: string;
}

export class AccountAdminUserForm {
    firstName: FormItem = {
        label: 'First name',
        type: FormItemType.text,
        required: true,
    };

    lastName: FormItem = {
        label: 'Last name',
        type: FormItemType.text,
        required: true,
    };

    email: FormItem = {
        label: 'Email address',
        type: FormItemType.text,
        required: true,
    };

    phone: FormItem = {
        label: 'Phone number',
        type: FormItemType.text,
        required: true,
    };

    type: FormItem = {
        label: 'Type',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.BreakOnAfter],
    };

    reference: FormItem = {
        label: 'Reference',
        type: FormItemType.text,
        required: true,
    };
}

export interface ReadUsersRequest extends MemberNodeMessageBody {
    token: string;
    userID?: number;
    accountID?: number;
}
