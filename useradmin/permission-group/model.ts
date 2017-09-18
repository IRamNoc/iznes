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

export interface PermissionGroupState {
    adminPermList: {
        [key: number]: AdminPermGroupDetail
    };
    tranPermList: {
        [key: number]: TranPermGroupDetail
    };
}
