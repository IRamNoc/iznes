import { FormItem, FormItemType, FormItemStyle } from '@setl/utils';

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
