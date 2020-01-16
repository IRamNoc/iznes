export interface UsersAdminPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
    }
}

export interface UsersTxPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
    }
}

export interface UsersMenuPermissonDetail {
    [permissionId: number]: {
        canDelegate: string;
        canDelete: string;
        canInsert: string;
        canRead: string;
        canUpdate: string;
        entityId: string;
        isGroup: string;
        permissionId: string;
    }
}

export interface UsersPermissionsState {
    usersAdminPermissions: {
        [entityId: number]: UsersAdminPermissonDetail
    };
    usersTxPermissions: {
        [entityId: number]: UsersTxPermissonDetail
    };
    usersMenuPermissions: {
        [entityId: number]: UsersMenuPermissonDetail
    };
}
