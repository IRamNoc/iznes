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
        id: { text: 'edit-', data: 'userID' },
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa-pencil-square-o',
        onClick: 'editUser',
    }),
    new DatagridListActionModel({
        id: { text: 'delete-', data: 'userID' },
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa-trash-o',
        onClick: 'deleteUser',
    }),
];
export const usersListActionsNonsuperAdmin: {}[] = [
    new DatagridListActionModel({
        id: { text: 'edit-', data: 'userID' },
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa-pencil-square-o',
        onClick: 'editUser',
    }),
];
