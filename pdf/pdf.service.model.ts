import {MemberNodeMessageBody} from '@setl/utils/common';

export interface CreatePdfMetadataMessageBody extends MemberNodeMessageBody {
    token: string;
    walletID: number;
    type: number;
    metadata: object;
}

export interface GetPdfMessageBody extends MemberNodeMessageBody {
    token: string;
    walletID: number;
    pdfID: number;
}

export interface UpdatePdfFileHashMessageBody extends MemberNodeMessageBody {
    token: string;
    pdfID: number;
    fileHash: string;
}
