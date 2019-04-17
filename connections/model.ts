import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridDropdownFilter } from '@setl/utils/components/datagrid-list/filters/dropdown.filter';

export const connectionsFieldsModel = {
    connection: {
        label: 'Connection',
    },
    subPortfolio :{
        label: 'Address',
    },
};

export const connectionsListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-success btn-sm',
        icon: 'fa fa-edit',
        onClick: 'editConnection',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-danger btn-sm',
        icon: 'fa fa-trash-o',
        onClick: 'deleteConnection',
    }),
];

export const connectionsFilters = {
    connection: new DataGridDropdownFilter('connection'),
    subPortfolio: new DataGridDropdownFilter('subPortfolio'),
};

export const pendingFieldsModel = {
    connection: {
        label: 'Connection',
    },
    info: {
        label: 'Status',
    },
};

export const pendingListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Cancel',
        class: 'btn btn-danger btn-sm',
        icon: 'fa fa-times',
        onClick: 'cancelPending',
        isVisible: data => data.info === 'Outgoing',
    }),
    new DatagridListActionModel({
        label: 'Accept',
        class: 'btn btn-success btn-sm',
        icon: 'fa fa-check',
        onClick: 'acceptPending',
        isVisible: data => data.info === 'Incoming',
    }),
    new DatagridListActionModel({
        label: 'Reject',
        class: 'btn btn-danger btn-sm',
        icon: 'fa fa-ban',
        onClick: 'rejectPending',
        isVisible: data => data.info === 'Incoming',
    }),
];

export const pendingFilters = {
    connection: new DataGridDropdownFilter('connection'),
    info: new DataGridDropdownFilter('info'),
};
