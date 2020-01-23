export interface PermissionArea {
    permissionAreaID: number;
    parentID: number;
    name: string;
    description: string;
    state: number;
}

export interface PermissionAreasState {
    permissionAreas: PermissionArea[];
    requested: boolean;
}
