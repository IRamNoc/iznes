import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const overviewFieldsModel: {} = {
    asset: {
        label: 'Asset',
        options: {
            pipe: 'asset',
        },
    },
    total: {
        label: 'Total',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
            flashCellOnCondition: 'totalChange',
        },
    },
    totalencumbered: {
        label: 'Encumbered',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
            flashOnCondition: 'encumberChange',
        },
    },
    free: {
        label: 'Free',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
            flashCellOnCondition: 'freeChange',
        },
    },
};

export const overviewListActions: {}[] = [
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

export const breakdownFieldsModel: {} = {
    label: {
        label: 'Address Label',
    },
    addr: {
        label: 'Address',
    },
    balance: {
        label: 'Total',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
        },
    },
    encumbrance: {
        label: 'Encumbered',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
        },
    },
    free: {
        label: 'Free',
        options: {
            pipe: 'moneyValue',
            rightAlign: true,
        },
    },
};

export const breakdownExportOptions: {} = {
    csv: true,
    csvFileName: 'Balance-Export.csv',
    pdf: true,
    pdfFileName: 'Balances-Report.pdf',
    pdfOptions: {
        file: 'report',
        title: 'Balances Report',
        subtitle: 'Balances Report',
        walletName: 'walletname',
        text: 'This is an auto-generated balances report with data correct as of the date above.',
        rightAlign: [],
        date: 'YYYY-MM-DD',
    },
};
