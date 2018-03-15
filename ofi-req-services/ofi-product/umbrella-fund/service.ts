import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest} from '@setl/utils/common';

import {UmbrellaFundRequestMessageBody, SaveUmbrellaFundRequestBody, UpdateUmbrellaFundRequestBody} from './service.model';
import {setRequestedUmbrellaFund, clearRequestedUmbrellaFund, SET_UMBRELLA_FUND_LIST} from '../../../ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/actions';

interface UmbrellaFundData {
    umbrellaFundID?: number;
    umbrellaFundName: string;
    registerOffice: string;
    registerOfficeAddress: string;
    legalEntityIdentifier: string;
    domicile: string;
    umbrellaFundCreationDate: string;
    managementCompanyID: number;
    fundAdministratorID: number;
    custodianBankID: number;
    investmentManagerID: number;
    investmentAdvisorID: number;
    payingAgentID: number;
    transferAgentID: number;
    centralisingAgentID: number;
    giin: number;
    delegatedManagementCompanyID: number;
    auditorID: number;
    taxAuditorID: number;
    principlePromoterID: number;
    legalAdvisorID: number;
    directors: string;
}

@Injectable()
export class OfiUmbrellaFundService {

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    walletID = 0;

    constructor(private memberSocketService: MemberSocketService) {
        this.getConnectedWallet.subscribe((getConnectedWallet) => this.myWalletID(getConnectedWallet));
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedUmbrellaFund());
        } else {
            ngRedux.dispatch(setRequestedUmbrellaFund());
        }
    }

    static defaultRequestUmbrellaFundList(ofiUmbrellaFundService: OfiUmbrellaFundService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedUmbrellaFund());

        // Request the list.
        const asyncTaskPipe = ofiUmbrellaFundService.requestUmbrellaFundList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_FUND_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    myWalletID(walletID) {
        this.walletID = walletID;
    }

    requestUmbrellaFundList(): any {
        const messageBody: UmbrellaFundRequestMessageBody = {
            RequestName: 'izngetumbrellafundlist',
            token: this.memberSocketService.token,
            walletID: 0,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveUmbrellaFund(ufData: UmbrellaFundData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveUmbrellaFundRequestBody = {
            RequestName: 'izncreateumbrellafund',
            token: this.memberSocketService.token,
            walletID: this.walletID,
            umbrellaFundName: ufData.umbrellaFundName,
            registerOffice: ufData.registerOffice,
            registerOfficeAddress: ufData.registerOfficeAddress,
            legalEntityIdentifier: ufData.legalEntityIdentifier,
            domicile: ufData.domicile,
            umbrellaFundCreationDate: ufData.umbrellaFundCreationDate,
            managementCompanyID: ufData.managementCompanyID,
            fundAdministratorID: ufData.fundAdministratorID,
            custodianBankID: ufData.custodianBankID,
            investmentManagerID: ufData.investmentManagerID,
            investmentAdvisorID: ufData.investmentAdvisorID,
            payingAgentID: ufData.payingAgentID,
            transferAgentID: ufData.transferAgentID,
            centralisingAgentID: ufData.centralisingAgentID,
            giin: ufData.giin,
            delegatedManagementCompanyID: ufData.delegatedManagementCompanyID,
            auditorID: ufData.auditorID,
            taxAuditorID: ufData.taxAuditorID,
            principlePromoterID: ufData.principlePromoterID,
            legalAdvisorID: ufData.legalAdvisorID,
            directors: ufData.directors
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateUmbrellaFund(ufData: UmbrellaFundData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateUmbrellaFundRequestBody = {
            RequestName: 'iznupdateumbrellafund',
            token: this.memberSocketService.token,
            walletID: this.walletID,
            umbrellaFundID: ufData.umbrellaFundID,
            umbrellaFundName: ufData.umbrellaFundName,
            registerOffice: ufData.registerOffice,
            registerOfficeAddress: ufData.registerOfficeAddress,
            legalEntityIdentifier: ufData.legalEntityIdentifier,
            domicile: ufData.domicile,
            umbrellaFundCreationDate: ufData.umbrellaFundCreationDate,
            managementCompanyID: ufData.managementCompanyID,
            fundAdministratorID: ufData.fundAdministratorID,
            custodianBankID: ufData.custodianBankID,
            investmentManagerID: ufData.investmentManagerID,
            investmentAdvisorID: ufData.investmentAdvisorID,
            payingAgentID: ufData.payingAgentID,
            transferAgentID: ufData.transferAgentID,
            centralisingAgentID: ufData.centralisingAgentID,
            giin: ufData.giin,
            delegatedManagementCompanyID: ufData.delegatedManagementCompanyID,
            auditorID: ufData.auditorID,
            taxAuditorID: ufData.taxAuditorID,
            principlePromoterID: ufData.principlePromoterID,
            legalAdvisorID: ufData.legalAdvisorID,
            directors: ufData.directors
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
