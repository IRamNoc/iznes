import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

export class ChainModel {
    constructor(private chainId?: any,
                private chainName?: any) {
    }
}

export const chainsFieldsModel = {
    chainId: {
        label: 'Chain Identification',
    },
    chainName: {
        label: 'Chain Name',
    },
};

export const chainsListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa fa-edit',
        onClick: 'editChain',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa fa-trash-o',
        onClick: 'deleteChain',
    }),
];
