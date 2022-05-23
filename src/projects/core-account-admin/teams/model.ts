import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import { MemberNodeMessageBody } from '@setl/utils/common';
import { DynamicFormsValidator } from '@setl/utils';

export class AccountAdminTeam {
    userTeamID?: number;
    accountId: number;
    status: number;
    name: string;
    reference: string;
    description: string;
    isActivated?: boolean;
}

export class AccountAdminTeamForm extends DynamicFormsValidator {
    name: FormItem = {
        label: 'Team Name',
        type: FormItemType.text,
        required: true,
        disabled: false,
    };
    reference: FormItem = {
        label: 'Reference',
        type: FormItemType.text,
        required: true,
        disabled: false,
    };
    description: FormItem = {
        label: 'Description',
        type: FormItemType.textarea,
        required: true,
        disabled: false,
    };
}

export class AccountAdminTeamAuditEntry {
    userTeamID: number;
    reference: string;
    name: string;
    description: string;
    field: string;
    oldValue: any;
    newValue: any;
    userName: string;
    dateModified: string;
}

export interface ReadUserTeamsRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID?: number;
    isCSVRequest: boolean;
}

export interface GetMyUserTeamsRequest extends MemberNodeMessageBody {
    token: string;
}

export interface CreateUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    accountID: number;
    name: string;
    reference: string;
    description: string;
}

export interface UpdateUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
    name: string;
    reference: string;
    description: string;
}

export interface UpdateUserTeamStatusRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
    status: number;
}

export interface DeleteUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
}

export interface ReadUserTeamsAuditRequest extends MemberNodeMessageBody {
    token: string;
    search: string;
    dateFrom: string;
    dateTo: string;
}
