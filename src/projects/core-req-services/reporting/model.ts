import { MemberNodeMessageBody } from '@setl/utils/common';

export interface GetTransactionsMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
}

export interface GetTransactionMessageBody extends GetTransactionsMessageBody {
    txHash: string;
}

export interface GetTransactionsByAssetMessageBody extends GetTransactionsMessageBody {
    namespace: string;
    classId: string;
}
