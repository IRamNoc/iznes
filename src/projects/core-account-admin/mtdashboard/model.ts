import { MemberNodeMessageBody } from '@setl/utils/common';

export interface listMtDashboardData {
    itemPerPage: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    centralizingAgentId: number;
}

export interface IznesGetMtDashboardRequestBody  extends MemberNodeMessageBody {
    pageSize: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    centralizingAgentId: number;
}