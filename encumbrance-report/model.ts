import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import * as moment from 'moment';

export const encumbrancesFieldsModel = {
    label: {
        label: 'Address Label',
    },
    address: {
        label: 'Address',
    },
};

export const encumbrancesListActions: {}[] = [
    new DatagridListActionModel({
        label: 'View',
        class: 'btn btn-orange btn-sm',
        icon: 'fa fa-search',
        onClick: 'viewEncumbrance',
    }),
];

export const breakdownFieldsModel = {
    reference: {
        label: 'Reference',
    },
    asset: {
        label: 'Asset',
    },
    beneficiary: {
        label: 'Beneficiary Address',
    },
    amount: {
        label: 'Amount Encumbered',
        options: {
            rightAlign: true,
            pipe: { name: 'moneyValue' },
        },
    },
    start: {
        label: 'Start Time',
    },
    end: {
        label: 'End Time',
    },
};

export const breakdownExportOptions: {} = {
    csv: true,
    csvFileName: `encumbrance-export-${moment().format('YYYYMMDD')}.csv`,
    pdf: true,
    pdfFileName: `encumbrance-report-${moment().format('YYYYMMDD')}.pdf`,
    pdfOptions: {
        file: 'report',
        title: 'Encumbrance Report',
        walletName: '', // set in component
        text: 'This is an auto-generated encumbrance report with data correct as of the date above.',
        rightAlign: ['amount'],
        date: moment().format('YYYY-MM-DD H:mm:ss'),
        orientation: 'portrait',
        border: { top: '15mm', right: '15mm', bottom: '0', left: '15mm' },
        footer: {
            height: '20mm',
            contents: `
            <div class="footer">
                <p class="left">Encumbrance Report | {{page}} of {{pages}}</p>
                <p class="right">${moment().format('YYYY-MM-DD H:mm:ss')}</p>
            </div>`,
        },
    },
};
