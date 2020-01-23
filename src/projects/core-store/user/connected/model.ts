interface MemberNodeSessionManager {
    remainingSecond: number;
    startCountDown: boolean;
}

export interface ConnectedState {
    connectedChain: number;
    connectedWallet: number;
    memberNodeSessionManager: MemberNodeSessionManager;
}

