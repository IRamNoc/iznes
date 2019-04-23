import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';
import * as moment from 'moment';

export const issueListFields = {
    asset: {
        label: 'Asset',
        options: {
            pipe: { name: 'asset' },
        },
    },
    addressLabel: {
        label: 'Issuer Address Label',
    },
    address: {
        label: 'Issuer Address',
    },
    total: {
        label: 'Total',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
};

export const issueListActions: {}[] = [
    new DatagridListActionModel({
        label: 'View',
        class: 'btn btn-orange btn-sm',
        icon: 'fa fa-search',
        onClick: 'viewBreakdown',
    }),
];

export const issueFilters: {} = {
    asset: new DataGridStringFilter('asset'),
    addressLabel: new DataGridStringFilter('addressLabel'),
    address: new DataGridStringFilter('address'),
    total: new DataGridStringFilter('total'),
};

export const detailFieldsModel = {
    walletName: {
        label: 'Wallet',
    },
    addrLabel: {
        label: 'Address Label',
    },
    addr: {
        label: 'Address',
    },
    percentage: {
        label: 'Percentage of Holding',
        options: {
            pipe: { name: 'percentage' },
            rightAlign: true,
        },
    },
    balance: {
        label: 'Total',
        options: {
            pipe: { name: 'moneyValue' },
            rightAlign: true,
        },
    },
    encumbered: {
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

export const detailFilters: {} = {
    walletName: new DataGridStringFilter('walletName'),
    addrLabel: new DataGridStringFilter('addrLabel'),
    addr: new DataGridStringFilter('addr'),
    percentage: new DataGridStringFilter('percentage'),
    balance: new DataGridStringFilter('balance'),
    encumbered: new DataGridStringFilter('encumbered'),
    free: new DataGridStringFilter('free'),
};

export const exportOptions: {} = {
    csv: true,
    csvFileName: `issue-export-${moment().format('YYYYMMDD')}.csv`,
    pdf: true,
    pdfFileName: `issue-report-${moment().format('YYYYMMDD')}.pdf`,
    pdfOptions: {
        file: 'report',
        title: 'Issue Report',
        walletName: '', // set in component
        text: 'This is an auto-generated issue report with data correct as of the date above.',
        rightAlign: ['total', 'percentage', 'balance', 'encumbered', 'free'],
        date: moment().format('YYYY-MM-DD H:mm:ss'),
        orientation: 'portrait',
        border: { top: '15mm', right: '15mm', bottom: '0', left: '15mm' },
        footer: {
            height: '20mm',
            contents: `
            <div class="footer">
                <p class="left">Issue Report | {{page}} of {{pages}}</p>
                <p class="right">${moment().format('YYYY-MM-DD H:mm:ss')}</p>
            </div>`,
        },
    },
};
