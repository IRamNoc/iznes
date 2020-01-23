export interface MemberDetail {
    memberId: number;
    memberName: string;
}

export interface ManageMemberListState {
    memberList: {
        [key: number]: MemberDetail
    };
    requestedManagedMemberList: boolean;
}
