import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export const memberFieldsModel = {
    memberName: {
        label: 'Member Name',
    },
};

export const memberListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa fa-edit',
        onClick: 'editMember',
        isVisible: data => data.isSymAdmin,
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa fa-trash-o',
        onClick: 'deleteMember',
        isVisible: data => data.isSymAdmin,
    }),
];
