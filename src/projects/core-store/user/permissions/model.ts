/**
 * Permission Interfaces.
 */

/* Data definitions. */
export class Permission {
    permissionId: number;
    permissionName: string;
    canDelegate: boolean;
    canRead: boolean;
    canInsert: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

/* Redux structures. */
export interface PermissionsState {
    permissions: {
        [permissionId: number]: Permission;
    };
    requested: boolean;
}
