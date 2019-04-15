import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridDropdownFilter } from '@setl/utils/components/datagrid-list/filters/dropdown.filter';

export const permissionsListFieldsModel = {
    groupName: {
        label: 'Group Name',
    },
    groupType: {
        label: 'Group Type',
    },
};

export const permissionsListActionsModel: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa-pencil-square-o',
        onClick: 'editPermission',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa-trash-o',
        onClick: 'deletePermission',
    }),
];

export const filters: any = {
    groupType: new DataGridDropdownFilter('groupType'),
};
