export interface UsersChainAccessDetail {
    [permissionId: number]: any
    /* TODO - give this a type. */
}

export interface UsersChainAccessState {
    [userId: number]: UsersChainAccessDetail;
}
