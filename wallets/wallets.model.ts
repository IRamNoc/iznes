import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const walletFieldsModel = {
    walletName: {
        label: 'Wallet Name',
    },
    accountName: {
        label: 'Account',
    },
    walletTypeName: {
        label: 'Wallet Type',
    },
    walletLocked: {
        label: 'Wallet Status',
        type: 'label',
        options: {
            labelMap: {
                0: { text: 'Unlocked', class: 'label-success' },
                1: { text: 'Locked', class: 'label-danger' },
            },
        },
    },
};

export const walletListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        id: { text: 'edit-', data: 'walletId' },
        class: 'btn btn-sm btn-success',
        icon: 'fa-pencil-square-o',
        onClick: 'editWallet',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        id: { text: 'delete-', data: 'walletId' },
        class: 'btn btn-sm btn-danger',
        icon: 'fa-trash-o',
        onClick: 'deleteWallet',
    }),
];
