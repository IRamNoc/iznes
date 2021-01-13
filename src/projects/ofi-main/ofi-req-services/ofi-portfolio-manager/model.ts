import { MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiPortfolioManagerListRequestBody extends MemberNodeMessageBody {
    token: string;
    pmid: 0;
}

export interface OfiPortfolioManagerDetailrequestBody extends MemberNodeMessageBody {
    token: string;
    pmid: number;
}

export interface OfiPortfolioManagerUpdateRequestBody extends MemberNodeMessageBody {
    token: string;
    fundid: number;
    pmid: number;
    status: number;
}

export interface OfiWealthManagerDetailrequestBody extends MemberNodeMessageBody {
    token: string;
    pmid: number;
}

export interface OfiWealthManagerUpdateRequestBody extends MemberNodeMessageBody {
    token: string;
    investorid: number;
    pmid: number;
    status: number;
}

export interface OfiPortfolioManagerListDashboardrequestBody extends MemberNodeMessageBody {
    token: string;
}