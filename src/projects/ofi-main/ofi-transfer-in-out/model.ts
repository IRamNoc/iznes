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

export interface listTransferRequestData {
    itemPerPage: number;
    rowOffset: number;
}

export interface IznesGetTransferRequestBody extends MemberNodeMessageBody {
    pageSize: number;
    rowOffset: number;
}

export interface IznesCancelTransferRequestBody extends MemberNodeMessageBody {
    referenceID: number;
}

export interface CancelTransferRequestData {
    referenceID: number;
}

export interface ConfirmTransferRequestData {
    referenceID: number;
}

export interface IznesConfirmTransferRequestBody extends MemberNodeMessageBody {
    referenceID: number;
}

export interface ValidateTransferRequestData {
    referenceID: number;
}

export interface IznesValidateTransferRequestBody extends MemberNodeMessageBody {
    referenceID: number;
}

export interface IznesUpdateTransferRequestData {
    referenceID: number;
    price: number;
    quantity: number;
    theoricalDate: string;
    initialDate: string;
    externalReference: string;
    comment: string;
    transferStatus: string;
}

export interface IznesUpdateTransferRequestBody extends MemberNodeMessageBody {
    referenceID: number;
    price: number;
    quantity: number;
    theoricalDate: string;
    initialDate: string;
    externalReference: string;
    comment: string;
    transferStatus: string;
}
