import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';

import {
    UmbrellaFundRequestMessageBody,
    SaveUmbrellaFundRequestBody,
    UpdateUmbrellaFundRequestBody,
    IznDeleteUmbrellaDraftRequestBody,
    fetchUmbrellaAuditRequestBody,
} from './service.model';
import {
    setRequestedUmbrellaFund,
    clearRequestedUmbrellaFund,
    SET_UMBRELLA_FUND_LIST,
    SET_UMBRELLA_AUDIT,
} from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/actions';
import { UmbrellaFundDetail } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund/umbrella-fund-list/model';

@Injectable()
export class OfiUmbrellaFundService {

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    walletID = 0;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        this.getConnectedWallet.subscribe(getConnectedWallet => this.myWalletID(getConnectedWallet));
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedUmbrellaFund());
        } else {
            ngRedux.dispatch(setRequestedUmbrellaFund());
        }
    }

    fetchUmbrellaList() {
        const asyncTaskPipe = this.requestUmbrellaFundList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedUmbrellaFund());
            },
        ));
    }

    getAdminUmbrellaList() {
        const asyncTaskPipe = this.requestAdminUmbrellaFundList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedUmbrellaFund());
            },
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

    requestAdminUmbrellaFundList(): any {
        const messageBody: UmbrellaFundRequestMessageBody = {
            RequestName: 'izngetadminumbrellafundlist',
            token: this.memberSocketService.token,
            walletID: 0,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveUmbrellaFund(ufData: UmbrellaFundDetail, ngRedux: NgRedux<any>): any {
        const messageBody: SaveUmbrellaFundRequestBody = {
            RequestName: 'izncreateumbrellafund',
            token: this.memberSocketService.token,
            draft: ufData.draft,
            umbrellaFundName: ufData.umbrellaFundName,
            registerOffice: ufData.registerOffice,
            registerOfficeAddress: ufData.registerOfficeAddress,
            registerOfficeAddressLine2: ufData.registerOfficeAddressLine2,
            registerOfficeAddressZipCode: ufData.registerOfficeAddressZipCode,
            registerOfficeAddressCity: ufData.registerOfficeAddressCity,
            registerOfficeAddressCountry: ufData.registerOfficeAddressCountry,
            legalEntityIdentifier: ufData.legalEntityIdentifier,
            domicile: ufData.domicile,
            umbrellaFundCreationDate: ufData.umbrellaFundCreationDate,
            managementCompanyID: ufData.managementCompanyID,
            fundAdministratorID: ufData.fundAdministratorID,
            custodianBankID: ufData.custodianBankID,
            investmentAdvisorID: JSON.stringify(ufData.investmentAdvisorID),
            payingAgentID: JSON.stringify(ufData.payingAgentID),
            transferAgentID: ufData.transferAgentID,
            centralisingAgentID: ufData.centralisingAgentID,
            giin: ufData.giin,
            delegatedManagementCompanyID: ufData.delegatedManagementCompanyID,
            auditorID: ufData.auditorID,
            taxAuditorID: ufData.taxAuditorID,
            principlePromoterID: JSON.stringify(ufData.principlePromoterID),
            legalAdvisorID: ufData.legalAdvisorID,
            directors: ufData.directors,
            internalReference: ufData.internalReference,
            additionnalNotes: ufData.additionnalNotes,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateUmbrellaFund(ufData: UmbrellaFundDetail, ngRedux: NgRedux<any>): any {
        const messageBody: any = {
            RequestName: 'iznupdateumbrellafund',
            token: this.memberSocketService.token,
            walletID: this.walletID,
            umbrellaFundID: ufData.umbrellaFundID,
            draft: ufData.draft,
            umbrellaFundName: ufData.umbrellaFundName,
            registerOffice: ufData.registerOffice,
            registerOfficeAddress: ufData.registerOfficeAddress,
            registerOfficeAddressLine2: ufData.registerOfficeAddressLine2,
            registerOfficeAddressZipCode: ufData.registerOfficeAddressZipCode,
            registerOfficeAddressCity: ufData.registerOfficeAddressCity,
            registerOfficeAddressCountry: ufData.registerOfficeAddressCountry,
            legalEntityIdentifier: ufData.legalEntityIdentifier,
            domicile: ufData.domicile,
            umbrellaFundCreationDate: ufData.umbrellaFundCreationDate,
            managementCompanyID: ufData.managementCompanyID,
            fundAdministratorID: ufData.fundAdministratorID,
            custodianBankID: ufData.custodianBankID,
            investmentAdvisorID: JSON.stringify(ufData.investmentAdvisorID),
            payingAgentID: JSON.stringify(ufData.payingAgentID),
            transferAgentID: ufData.transferAgentID,
            centralisingAgentID: ufData.centralisingAgentID,
            giin: ufData.giin,
            delegatedManagementCompanyID: ufData.delegatedManagementCompanyID,
            auditorID: ufData.auditorID,
            taxAuditorID: ufData.taxAuditorID,
            principlePromoterID: JSON.stringify(ufData.principlePromoterID),
            legalAdvisorID: ufData.legalAdvisorID,
            directors: ufData.directors,
            internalReference: ufData.internalReference,
            additionnalNotes: ufData.additionnalNotes,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteUmbrellaDraft(id: string): Promise<any> {
        const messageBody: IznDeleteUmbrellaDraftRequestBody = {
            RequestName: 'izndeleteumbrelladraft',
            token: this.memberSocketService.token,
            id,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    fetchUmbrellaAuditByUmbrellaID(umbrellaFundID: number) {
        const messageBody: fetchUmbrellaAuditRequestBody = {
            RequestName: 'izngetumbrellaaudit',
            token: this.memberSocketService.token,
            umbrellaFundID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    fetchAdminUmbrellaAuditByUmbrellaID(umbrellaFundID: number) {
        const messageBody: fetchUmbrellaAuditRequestBody = {
            RequestName: 'izngetadminumbrellaaudit',
            token: this.memberSocketService.token,
            umbrellaFundID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    fetchUmbrellaByID(umbrellaFundID: number) {
        const messageBody = {
            RequestName: 'izngetumbrellabyid',
            token: this.memberSocketService.token,
            umbrellaFundID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_UMBRELLA_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }
}
