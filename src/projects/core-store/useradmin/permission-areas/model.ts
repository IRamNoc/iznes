export interface AdminPermAreaDetail {
    canDelegate: number;
    canDelete: number;
    canInsert: number;
    canRead: number;
    canUpdate: number;
    permissionID: number;
    permissionName: string;
}

export interface TxPermAreaDetail {
    canDelegate: number;
    canDelete: number;
    canInsert: number;
    canRead: number;
    canUpdate: number;
    permissionID: number;
    permissionName: string;
}

export interface MenuPermAreaDetail {
    canDelegate: number;
    canDelete: number;
    canInsert: number;
    canRead: number;
    canUpdate: number;
    permissionID: number;
    permissionName: string;
}

export interface PermAreasState {
    adminPermAreaList: {
        [key: number]: AdminPermAreaDetail
    };
    txPermAreaList: {
        [key: number]: TxPermAreaDetail
    };
    menuPermAreaList: {
        [key: number]: MenuPermAreaDetail
    };
}
