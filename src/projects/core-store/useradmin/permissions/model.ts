export interface AdminPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
    };
}

export interface TransPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
    };
}

export interface MenuPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
        menuOrder: string;
    };
}

export interface PermissionsState {
    adminPermissions: {
        [entityId: number]: AdminPermissonDetail,
    };
    transPermissions: {
        [entityId: number]: TransPermissonDetail,
    };
    menuPermissions: {
        [entityId: number]: MenuPermissonDetail,
    };
}
