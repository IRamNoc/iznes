import { MemberNodeMessageBody } from '@setl/utils/common';

export type AccountAdminResponse = AccountAdminSuccessResponse | AccountAdminErrorResponse;

export type AccountAdminSuccessResponse = [
    null,
    {
        Data: [any],
        Status: string,
    },
    undefined
];

export type AccountAdminErrorResponse = [
    null,
    {
        Data: [{
            Message: string,
            Status: string,
        }],
        Status: string,
    },
    undefined
];

export type RequestCallback = (data: AccountAdminResponse) => void;

export enum AccountAdminNouns {
    Team = 'Team',
    User = 'User',
}

export interface DataGridConfig {
    idIndex: string;
    columns: DataGridColumn[];
}

export interface DataGridColumn {
    id: string;
    dataIndex: string;
    styleClass: string;
    title: string;
    valueDecorator?: Function;
}

export interface TooltipConfig {
    text: string;
    size: 'small' | 'large' | 'default';
}
