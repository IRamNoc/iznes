import {FormControl} from '@angular/forms';

export interface UsersDetail {
    userId: number;
}

export interface Select2Item{
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
    filteredTxList?: Array<Select2Item>;
    selectedTxList?: Array<Select2Item>;
    allocatedTxList?: Array<Select2Item>;
    filteredWalletsByAccount?: Array<Select2Item>;
    oldChainAccess?: object;
}

export interface UsersState {
    usersList: Array<UsersDetail>;
    openedTabs: Array<UserTab>;
}
