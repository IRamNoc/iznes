import { FormControl } from '@angular/forms';

export interface UsersDetail {
    userId: number;
}

export interface Select2Item {
    id: string | number;
    text: string;
}

export interface UserTab {
    title: {
        icon: string;
        text: string;
    };
    userId: number;
    active: boolean;
    formControl?: FormControl;
    selectedChain?: number;
    filteredTxList?: Select2Item[];
    selectedTxList?: Select2Item[];
    allocatedTxList?: Select2Item[];
    filteredWalletsByAccount?: Select2Item[];
    oldChainAccess?: object;
}

export interface UsersState {
    usersList: UsersDetail[];
    totalRecords: number;
    openedTabs: UserTab[];
}
