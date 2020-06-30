import { MemberNodeMessageBody } from '@setl/utils/common';

export interface IznesNewTransferRequestBody extends MemberNodeMessageBody {
    fundShareID: number;
    investorWalletID: number;
    investorSubportfolioID: number;
    transferType: string;
    transferDirection: string;
    price: number;
    quantity: number;
    theoricalDate: string;
    initialDate: string;
    externalReference: string;
    accountKeeperID: number;
    comment: string;
}
