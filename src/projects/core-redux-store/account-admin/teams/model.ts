export interface UserTeam {
    accountId: number;
    accountName: string;
    description: string;
    parent: number;
    billingWallet: string;
}

export interface UserTeamsState {
    teams: UserTeam[];
    requested: boolean;
}
