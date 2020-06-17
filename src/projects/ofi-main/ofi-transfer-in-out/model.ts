import { MemberNodeMessageBody } from '@setl/utils/common';

export interface IznesNewTransferRequestBody extends MemberNodeMessageBody {
    token: string;
    amBic: string;
    amShareFund: string;
    amShareFundISIN: string;
    investorCompany: string;
    investorReference: string;
    investorWallet: string;
    investorWalletReference: string;
    quantity: number;
    amount: number;
    currency: string;
    theoricalDate: string;
    initialDate: string;
    externalReference: string;
    accountKeeper: string;
    comment: string;
    createdBy: string;
    dateEntered: string;
}