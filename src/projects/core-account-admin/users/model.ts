import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
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
    invitationToken: string;
    invitationEmail: string;
    invitationComplete: number;
    invitationDate: string;
    userStatus: number;
    isActivated?: boolean;
}

export class AccountAdminUserForm extends DynamicFormsValidator {
    constructor(userTypePreset: string,
                userTypesList: any[]) {
        super();
        this.userType.preset = userTypePreset;
        this.userType.listItems = userTypesList;
    }

    emailAddress: FormItem = {
        label: 'Email address (username)',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.WidthThird],
    };

    firstName: FormItem = {
        label: 'First name',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.WidthThird],
    };

    lastName: FormItem = {
        label: 'Last name',
        type: FormItemType.text,
        required: true,
        style: [FormItemStyle.WidthThird],
    };

    phoneNumber: FormItem = {
        label: 'Phone number',
        type: FormItemType.text,
        required: false,
        style: [FormItemStyle.WidthThird],
    };

    userType: FormItem = {
        label: 'Type',
        type: FormItemType.list,
        required: true,
        style: [FormItemStyle.WidthThird],
    };

    reference: FormItem = {
        label: 'Reference',
        type: FormItemType.text,
        required: false,
        style: [FormItemStyle.WidthThird],
    };
}

export class AccountAdminUserAuditEntry {
    userID: number;
    reference: string;
    userName: string;
    field: string;
    oldValue: any;
    newValue: any;
    dateModified: string;
}

export interface ReadUsersRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
    accountID: number;
    textSearch: string;
    isCSVRequest: boolean;
}

export interface CreateUserRequest extends MemberNodeMessageBody {
    token: string;
    account: number;
    username: string;
    email: string;
    userType: number;
    password: string;
}

export interface PostCreateUserRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
}

export interface InviteUserRequest extends MemberNodeMessageBody {
    token: string;
    userId: number;
    userFirstName: string;
    recipientEmailAddress: string;
    localeCode: string;
    assetManagerName: string;
}

export interface UpdateUserStatusRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
    status: number;
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

export interface DeleteUserRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
}

export interface ReadUsersAuditRequest extends MemberNodeMessageBody {
    token: string;
    search: string;
    dateFrom: string;
    dateTo: string;
    isCSVRequest: boolean;
}

export interface ReadUserPermissionsRequest extends MemberNodeMessageBody {
    token: string;
    userID: number;
}
