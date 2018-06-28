import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';
import { MemberNodeMessageBody } from '@setl/utils/common';

export class AccountAdminTeam {
    userTeamID?: number;
    accountId: number;
    status: boolean;
    name: string;
    reference: string;
    description: string;
}

export class AccountAdminTeamForm {
    status: FormItem = {
        label: 'Status',
        type: FormItemType.boolean,
        required: true,
        style: [FormItemStyle.BreakOnAfter],
    };
    name: FormItem = {
        label: 'Team name',
        type: FormItemType.text,
        required: true,
    };
    reference: FormItem = {
        label: 'Reference',
        type: FormItemType.text,
        required: true,
    };
    description: FormItem = {
        label: 'Description',
        type: FormItemType.textarea,
        required: true,
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

export type RequestCallback = (data) => void;

export interface ReadUserTeamsRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID?: number;
}

export interface CreateUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    accountID: number;
    status: boolean;
    name: string;
    reference: string;
    description: string;
}

export interface UpdateUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
    status: boolean;
    name: string;
    reference: string;
    description: string;
}

export interface DeleteUserTeamRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
}

export interface ReadUserTeamsAuditRequest extends MemberNodeMessageBody {
    token: string;
    userTeamID: number;
    dateFrom: string;
    dateTo: string;
}
