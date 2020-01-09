export interface FundTab {
    title: {
        icon: string;
        text: string;
    };
    fundShareId: number;
    fundShareData: any;
    actionType: string;
    active: boolean;
}

export interface OfiListOfFundsComponentState {
    openedTabs: Array<FundTab>;
}
