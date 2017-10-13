import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest} from '@setl/utils/common';

import {FundRequestMessageBody, FundShareRequestMessageBody, SaveFundRequestBody, UpdateFundRequestBody, SaveFundShareRequestBody, UpdateFundShareRequestBody} from './fund.service.model';
import {setRequestedFund, clearRequestedFund, SET_FUND_LIST, SET_FUND_SHARE_LIST} from '../../../ofi-store/ofi-product/fund/fund-list/actions';

interface FundData {
    fundID?: any;
    companyId?: any;
    fundName?: any;
    fundProspectus?: any;
    fundReport?: any;
    fundLei?: any;
    sicavId?: any;
    shareID?: any;
    metadata?: any;
    issuer?: any;
    shareName?: any;
    status?: any;
}

@Injectable()
export class OfiFundService {

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    accountId = 0;

    constructor(private memberSocketService: MemberSocketService) {
        this.getMyAccountId.subscribe((getMyAccountId) => this.myAccountId(getMyAccountId));
    }

    myAccountId(accountId) {
        this.accountId  = accountId;
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedFund());
        } else {
            ngRedux.dispatch(setRequestedFund());
        }
    }

    static defaultRequestFundList(ofiFundService: OfiFundService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFund());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestFundList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestFundList(): any {
        const messageBody: FundRequestMessageBody = {
            RequestName: 'getfunds',
            token: this.memberSocketService.token,
            accountId: this.accountId
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestFundShareList(fData: FundData, ngRedux: NgRedux<any>): any {
        const messageBody: FundShareRequestMessageBody = {
            RequestName: 'getfundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,
            fundId: fData.fundID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveFund(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveFundRequestBody = {
            RequestName: 'newfund',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundName: fData.fundName,
            fundProspectus: fData.fundProspectus,
            fundReport: fData.fundReport,
            fundLei: fData.fundLei,
            sicavId: fData.sicavId,
            companyId: fData.companyId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateFund(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateFundRequestBody = {
            RequestName: 'updatefunds',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundId: fData.fundID,
            fundName: fData.fundName,
            fundProspectus: fData.fundProspectus,
            fundReport: fData.fundReport,
            fundLei: fData.fundLei,
            sicavId: fData.sicavId,
            companyId: fData.companyId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveFundShares(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveFundShareRequestBody = {
            RequestName: 'newfundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundID: fData.fundID,
            metadata: fData.metadata,
            issuer: fData.issuer,
            shareName: fData.shareName,
            status: fData.status,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateFundShares(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateFundShareRequestBody = {
            RequestName: 'updatefundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            shareID: fData.shareID,
            fundID: fData.fundID,
            metadata: fData.metadata,
            issuer: fData.issuer,
            shareName: fData.shareName,
            status: fData.status,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
