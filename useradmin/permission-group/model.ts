export interface AdminPermGroupDetail {
    groupId: number;
    groupName: string;
    groupDescription: string;
    canDelegate: boolean;
}

export interface TranPermGroupDetail {
    groupId: number;
    groupName: string;
    groupDescription: string;
    chainId: number;
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
