import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const statusFieldsModel = {
    status: {
        label: 'Status',
        type: 'label',
        options: {
            labelMap: {
                Success: { text: 'Success', class: 'label-success' },
                Pending: { text: 'Pending', class: 'label-warning' },
                Fail: { text: 'Fail', class: 'label-danger' },
            },
        },
    },
    hash: {
        label: 'Tx Hash',
    },
    date: {
        label: 'Date Requested',
    },
};

export const statusListActions: {}[] = [
    new DatagridListActionModel({
        label: 'View',
        class: 'btn btn-orange btn-sm',
        icon: 'fa fa-search',
        onClick: 'viewTx',
    }),
];
