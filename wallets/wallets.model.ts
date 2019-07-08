import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';
import { DataGridMappedValueFilter } from '@setl/utils/components/datagrid-list/filters/mapped-value.filter';

const walletLockedValueMap = {
    0: { text: 'Unlocked', class: 'label-success' },
    1: { text: 'Locked', class: 'label-danger' },
};

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
            labelMap: walletLockedValueMap,
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

export const walletListFilters: {} = {
    walletName: new DataGridStringFilter('walletName'),
    accountName: new DataGridStringFilter('accountName'),
    walletTypeName: new DataGridStringFilter('walletTypeName'),
    walletLocked: new DataGridMappedValueFilter('walletLocked', walletLockedValueMap),
};
