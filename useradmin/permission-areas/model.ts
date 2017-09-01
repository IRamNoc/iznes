export interface AdminPermAreaDetail {
    canDelegate:number;
    canDelete:number;
    canInsert:number;
    canRead:number;
    canUpdate:number;
    permissionID:number;
    permissionName:string;
}

export interface AdminPermAreasState {
    adminPermAreaList: {
        [key: number]: AdminPermAreaDetail
    };
}
