import {FormControl} from '@angular/forms';

export interface AdminPermGroupDetail {
    groupId: number;
    groupName: string;
    groupDescription: string;
    groupIsTx: number;
    canDelegate: boolean;
}

export interface TranPermGroupDetail {
    groupId: number;
    groupName: string;
    groupDescription: string;
    chainId: number;
    groupIsTx: number;
    canDelegate: boolean;
}

export interface MenuPermGroupDetail {
    groupId: number;
    groupName: string;
    groupDescription: string;
    chainId: number;
    groupIsTx: number;
    canDelegate: boolean;
}

export interface PermissionGroupTab {
    title: {
        icon: string;
        text: string;
    };
    groupId: number;
    active: boolean;
    formControl?: FormControl;
}

export interface PermissionGroupState {
    adminPermList: {
        [key: number]: AdminPermGroupDetail
    };
    tranPermList: {
        [key: number]: TranPermGroupDetail
    };
    menuPermList: {
        [key: number]: MenuPermGroupDetail
    };
    openedTabs: Array<PermissionGroupTab>;
}
