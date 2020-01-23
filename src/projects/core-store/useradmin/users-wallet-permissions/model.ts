export interface UsersWalletPermissionsDetail {
    [permissionId: number]: any
    /* TODO - give this a type. */
}

export interface UsersWalletPermissionsState {
    [userId: number]: UsersWalletPermissionsDetail;
}
