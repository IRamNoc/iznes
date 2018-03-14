import {FundDetail} from '../../fund/fund-list/model';

export interface OfiFundShareSelectedFund extends FundDetail {}

export interface CurrentRequest {
    fundShareID?: number;
}

export interface OfiFundShareSelectedFundState {
    fundShareSelectedFund: {
        [shareId: string]: FundDetail
    };
    requestedFundShareSelectedFund: boolean;
    currentRequest: CurrentRequest;
}
 