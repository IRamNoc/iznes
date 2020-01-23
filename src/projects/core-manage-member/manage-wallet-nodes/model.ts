import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';

export class WalletNodesModel {
    constructor(
        private walletNodeId?: any,
        private walletNodeName?: any,
        private chainId?: any,
        private chainName?: any,
        private nodeAddress?: any,
        private nodePath?: any,
        private nodePort?: any,
    ) {}
}

export const walletNodesFieldsModel = {
    walletNodeName: {
        label: 'Node Name',
    },
    chainName: {
        label: 'Chain Name',
    },
};

export const walletNodesListActions: {}[] = [
    new DatagridListActionModel({
        label: 'Edit',
        class: 'btn btn-sm btn-success',
        icon: 'fa fa-edit',
        onClick: 'editWalletNode',
    }),
    new DatagridListActionModel({
        label: 'Delete',
        class: 'btn btn-sm btn-danger',
        icon: 'fa fa-trash-o',
        onClick: 'deleteWalletNode',
    }),
];

export const walletNodesListFilters = {
    walletNodeName: new DataGridStringFilter('walletNodeName'),
    chainName: new DataGridStringFilter('chainName'),
};
