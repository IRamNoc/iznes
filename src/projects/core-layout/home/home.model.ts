import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const balancesListFieldsModel = {
    asset: {
        label: 'Asset',
        options: {
            pipe: { name: 'asset' },
        },
    },
    total: {
        label: 'Total',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
    totalencumbered: {
        label: 'Encumbered',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
    free: {
        label: 'Free',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
};

export const balancesListActionsModel: {}[] = [
    new DatagridListActionModel({
        label: 'View',
        class: 'btn btn-orange btn-sm',
        icon: 'fa fa-search',
        onClick: 'viewBreakdown',
    }),
    new DatagridListActionModel({
        label: 'History',
        class: 'btn btn-primary btn-sm',
        icon: 'fa fa-history',
        onClick: 'viewHistory',
    }),
];

export const transactionsFieldsModel = {
    hash: {
        label: 'Tx ID',
        options: {
            pipe: { name: 'truncate', params: 8 },
        },
    },
    assetName: {
        label: 'Asset',
        options: {
            pipe: { name: 'asset' },
        },
    },
    utc: {
        label: 'Time (UTC)',
    },
    txType: {
        label: 'Type',
    },
};

export const transactionsListActionsModel: {}[] = [
    new DatagridListActionModel({
        label: 'View',
        class: 'btn btn-sm',
        icon: 'fa fa-search',
        onClick: 'viewTransaction',
    }),
];
