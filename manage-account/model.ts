import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';

export const accountFieldsModel = {
    accountName: {
        label: 'Account Name',
    },
    description: {
        label: 'Description',
    },
};

export const accountListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa fa-edit',
        onClick: 'editAccount',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa fa-trash-o',
        onClick: 'deleteAccount',
    }),
];

export const accountListFilters: {} = {
    accountName: new DataGridStringFilter('accountName'),
    description: new DataGridStringFilter('description'),
};
