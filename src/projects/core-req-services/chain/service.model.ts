import {MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestMyChainAccessMessageBody extends MemberNodeMessageBody {
    token;
}

export interface ChainsRequestMessageBody extends MemberNodeMessageBody {
    token: any;
}

export interface ChainRequestBody extends MemberNodeMessageBody {
    token: any;
    chainId: any;
    chainName: any;
}

export interface DeleteChainRequestBody extends MemberNodeMessageBody {
    token: any;
    chainId: any;
}