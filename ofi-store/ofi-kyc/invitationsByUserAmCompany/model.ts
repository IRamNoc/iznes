export interface investorInvitation {
    inviteSent: string; //date
    tokenUsedAt?: string; // date
    email: string;
    companyName?: string;
    lastName?: string;
    firstName?: string;
    invitedBy: string;
    kycStarted?: string; // date
    invitationToken?: string;
    lang?: string;
    status: number;
}
