import { MemberNodeMessageBody } from '@setl/utils/common';

export interface listMtDashboardData {
    itemPerPage: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    centralizingAgent: number;
}
export interface listAssetDashboardData {
    itemPerPage: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    depositary: string;
    clientName: string;
    // centralizingAgentId: number;
}

export interface IznesGetMtDashboardRequestBody  extends MemberNodeMessageBody {
    pageSize: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    centralizingAgent: number;
}

export interface IznesGetAssetManagerDashboardRequestBody  extends MemberNodeMessageBody {
    pageSize: number;
    rowOffset: number;
    mtType: string;
    fromDate: string;
    toDate: string;
    isinCode: string;
    fundShareName: string;
    depositary: string;
    clientName: string;
    // centralizingAgentId: number;
}