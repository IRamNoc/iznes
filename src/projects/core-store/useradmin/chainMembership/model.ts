export interface ChainMembershipDetail {
    chainId: number;
    memberId: number;
    memberType: number;
    nodeId: number;
}

export interface ChainMembershipState {
    currentChainMembership: {
        [memberId: number]: ChainMembershipDetail
    };
}

