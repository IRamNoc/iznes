import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const statusFieldsModel = {
    status: {
        label: 'Status',
        type: 'label',
        options: {
            labelMap: {
                Success: { text: 'Success', type: 'label-success' },
                Pending: { text: 'Pending', type: 'label-warning' },
                Fail: { text: 'Fail', type: 'label-danger' },
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
