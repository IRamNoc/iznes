import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';
import { DataGridNumberFilter } from '@setl/utils/components/datagrid-list/filters/number.filter';
import * as moment from 'moment';

export const overviewFieldsModel: {} = {
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
            flashCellOnCondition: 'totalChange',
        },
    },
    totalencumbered: {
        label: 'Encumbered',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
            flashOnCondition: 'encumberChange',
        },
    },
    free: {
        label: 'Free',
        options: {
            pipe: { name: 'moneyValue' },
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

export const overviewListFilters = {
    asset: new DataGridStringFilter('asset'),
    total: new DataGridNumberFilter('total'),
    totalencumbered: new DataGridNumberFilter('totalencumbered'),
    free: new DataGridNumberFilter('free'),
};

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
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
    encumbrance: {
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

export const breakdownListFilters = {
    label: new DataGridStringFilter('label'),
    addr: new DataGridStringFilter('addr'),
    balance: new DataGridNumberFilter('balance'),
    encumbrance: new DataGridNumberFilter('encumbrance'),
    free: new DataGridNumberFilter('free'),
};

export const breakdownExportOptions: {} = {
    csv: true,
    csvFileName: 'Balance-Export.csv',
    pdf: true,
    pdfFileName: 'Balances-Report.pdf',
    pdfOptions: {
        file: 'report',
        title: 'Balances Report',
        walletName: '', // set in component
        text: 'This is an auto-generated balances report with data correct as of the date above.',
        rightAlign: ['free', 'balance', 'encumbrance', 'totalencumbered', 'total'],
        date: moment().format('YYYY-MM-DD H:mm:ss'),
        orientation: 'portrait',
        border: { top: '15mm', right: '15mm', bottom: '0', left: '15mm' },
        footer: {
            height: '20mm',
            contents: `
            <div class="footer">
                <p class="left">Balances Report | {{page}} of {{pages}}</p>
                <p class="right">${moment().format('YYYY-MM-DD H:mm:ss')}</p>
            </div>`,
        },
    },
};
