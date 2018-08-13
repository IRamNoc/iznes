import { PermissionArea } from '../permissions';

export interface UserPermissionAreasState {
    permissionAreas: PermissionArea[];
    requested: boolean;
}
