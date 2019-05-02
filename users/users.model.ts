import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const usersListFields = {
    userName: {
        label: 'Username',
    },
    emailAddress: {
        label: 'Email',
    },
    accountName: {
        label: 'Account',
    },
    accountLocked: {
        label: 'Status',
        type: 'label',
        options: {
            labelMap: {
                0: { class: 'label-success', text: 'Enabled' },
                1: { class: 'label-danger', text: 'Locked' },
            },
        },
    },
};

export const usersListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa-pencil-square-o',
        onClick: 'editUser',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa-trash-o',
        onClick: 'deleteUser',
    }),
];
