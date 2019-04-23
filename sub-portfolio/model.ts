import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';

export const datagridModel = {
    label: { label: 'Sub-portfolio' },
    iban: { label: 'IBAN' },
    address: { label: 'Blockchain Address Identifier' },
};

export const datagridActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa-edit',
        onClick: 'editSubportfolio',
    }),
];

export const datagridFilters: {} = {
    label: new DataGridStringFilter('label'),
    iban: new DataGridStringFilter('iban'),
    address: new DataGridStringFilter('address'),
};
