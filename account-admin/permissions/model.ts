export interface PermissionArea {
    permissionID: number;
    permissionName: string;
    canDelegate: number;
    canRead: number;
    canInsert: number;
    canUpdate: number;
    canDelete: number;
}

export interface PermissionAreasState {
    permissionAreas: PermissionArea[];
    requested: boolean;
}
