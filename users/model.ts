import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import { MemberNodeMessageBody } from '@setl/utils/common';

export class AccountAdminUser {
    userID?: number;
    userTeamID?: number;
    reference: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    userTypeID: number;
    userType: string;
    userStatus: number;
    isInTeam?: boolean;
}

export class AccountAdminUserForm {
    constructor(userTypePreset: string,
                userTypesList: any[]) {
        this.userType.preset = userTypePreset;
        this.userType.listItems = userTypesList;
    }

    emailAddress: FormItem = {
        label: 'Email address (username)',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.BreakOnAfter],
    };

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

    phoneNumber: FormItem = {
        label: 'Phone number',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.BreakOnAfter],
    };

    userType: FormItem = {
        label: 'Type',
        type: FormItemType.list,
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

export interface CreateUserRequest extends MemberNodeMessageBody {
    token: string;
    account: number;
    username: string;
    email: string;
    userType: number;
    password: string;
}

export interface UpdateUserDetailsRequest extends MemberNodeMessageBody {
    token: string;
    accountID: number;
    userID: number;
    displayName: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    userType: number;
    reference: string;
}
