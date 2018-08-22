import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import {
    ManagementCompanyRequestMessageBody,
    SaveManagementCompanyRequestBody,
    UpdateManagementCompanyRequestBody,
    DeleteManagementCompanyRequestBody,
} from './management-company.service.model';
import {
    setRequestedManagementCompany,
    clearRequestedManagementCompany,
    SET_MANAGEMENT_COMPANY_LIST,
    setRequestedINVManagementCompany,
    clearRequestedINVManagementCompany,
    SET_INV_MANAGEMENT_COMPANY_LIST,
} from '../../../ofi-store/ofi-product/management-company/management-company-list/actions';

interface ManagementCompanyData {
    companyID: any;
    companyName: any;
    country: any;
    addressPrefix: any;
    postalAddressLine1: any;
    postalAddressLine2: any;
    city: any;
    stateArea: any;
    postalCode: any;
    taxResidence: any;
    registrationNum: any;
    supervisoryAuthority: any;
    numSiretOrSiren: any;
    creationDate: any;
    shareCapital: any;
    commercialContact: any;
    operationalContact: any;
    directorContact: any;
    lei: any;
    bic: any;
    giinCode: any;
    logoName: any;
    logoURL: any;
}

interface DeleteManagementCompany {
    companyID: any;
}

@Injectable()
export class OfiManagementCompanyService {

    accountID = 0;
    isManagementCompanyRequested: boolean;

    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) reqManagementCompany$;
    @select(['user', 'authentication', 'isLogin']) isLogin$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        this.isLogin$.subscribe((isLogin) => {
            if (isLogin) {
                this.initSubscribers();
                return;
            }
            this.unSubscribe.next();
            this.unSubscribe.complete();
        });
    }

    initSubscribers() {
        this.getMyAccountId
            .pipe(
                takeUntil(this.unSubscribe),
        )
            .subscribe(getMyAccountId => this.myAccountId(getMyAccountId));

        this.reqManagementCompany$
            .pipe(
                takeUntil(this.unSubscribe),
        )
            .subscribe(v => this.isManagementCompanyRequested = v);
    }

    myAccountId(accountId) {
        this.accountID = accountId;
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedManagementCompany());
        } else {
            ngRedux.dispatch(setRequestedManagementCompany());
        }
    }

    getManagementCompanyList() {
        if (this.isManagementCompanyRequested) {
            return;
        }
        this.fetchManagementCompanyList();
    }

    fetchManagementCompanyList() {
        const asyncTaskPipe = this.requestManagementCompanyList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MANAGEMENT_COMPANY_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedManagementCompany());
            },
        ));
    }

    static setINVRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedINVManagementCompany());
        } else {
            ngRedux.dispatch(setRequestedINVManagementCompany());
        }
    }

    fetchManagementCompanyForInvestor(requestAll = false) {
        const asyncTaskPipe = this.requestINVManagementCompanyList(requestAll);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_INV_MANAGEMENT_COMPANY_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedINVManagementCompany());
            },
        ));
    }

    requestINVManagementCompanyList(requestAll): any {
        const messageBody: ManagementCompanyRequestMessageBody = {
            RequestName: 'izngetmanagementcompanylistforinvestor',
            token: this.memberSocketService.token,
            accountID: requestAll ? 0 : this.accountID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestManagementCompanyList(): any {
        const messageBody: ManagementCompanyRequestMessageBody = {
            RequestName: 'getManagementCompanyList',
            token: this.memberSocketService.token,
            accountID: this.accountID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveManagementCompany(mcData: ManagementCompanyData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveManagementCompanyRequestBody = {
            RequestName: 'newmanagementcompany',
            token: this.memberSocketService.token,
            entityId: this.accountID,   // entityId = accountID (name just changed)
            companyName: mcData.companyName,
            country: mcData.country,
            addressPrefix: mcData.addressPrefix,
            postalAddressLine1: mcData.postalAddressLine1,
            postalAddressLine2: mcData.postalAddressLine2,
            city: mcData.city,
            stateArea: mcData.stateArea,
            postalCode: mcData.postalCode,
            taxResidence: mcData.taxResidence,
            registrationNum: mcData.registrationNum,
            supervisoryAuthority: mcData.supervisoryAuthority,
            numSiretOrSiren: mcData.numSiretOrSiren,
            creationDate: mcData.creationDate,
            shareCapital: mcData.shareCapital,
            commercialContact: mcData.commercialContact,
            operationalContact: mcData.operationalContact,
            directorContact: mcData.directorContact,
            lei: mcData.lei,
            bic: mcData.bic,
            giinCode: mcData.giinCode,
            logoName: mcData.logoName,
            logoURL: mcData.logoURL,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteManagementCompany(mcData: DeleteManagementCompany, ngRedux: NgRedux<any>): any {

        const messageBody: DeleteManagementCompanyRequestBody = {
            RequestName: 'deletemanagementcompany',
            token: this.memberSocketService.token,
            companyID: mcData.companyID
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateManagementCompany(mcData: ManagementCompanyData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateManagementCompanyRequestBody = {       // where is the companyID ?
            RequestName: 'updatemanagementcompany',
            token: this.memberSocketService.token,
            entityId: this.accountID,   // entityId = accountID (name just changed)
            companyID: mcData.companyID,
            companyName: mcData.companyName,
            country: mcData.country,
            addressPrefix: mcData.addressPrefix,
            postalAddressLine1: mcData.postalAddressLine1,
            postalAddressLine2: mcData.postalAddressLine2,
            city: mcData.city,
            stateArea: mcData.stateArea,
            postalCode: mcData.postalCode,
            taxResidence: mcData.taxResidence,
            registrationNum: mcData.registrationNum,
            supervisoryAuthority: mcData.supervisoryAuthority,
            numSiretOrSiren: mcData.numSiretOrSiren,
            creationDate: mcData.creationDate,
            shareCapital: mcData.shareCapital,
            commercialContact: mcData.commercialContact,
            operationalContact: mcData.operationalContact,
            directorContact: mcData.directorContact,
            lei: mcData.lei,
            bic: mcData.bic,
            giinCode: mcData.giinCode,
            logoName: mcData.logoName,
            logoURL: mcData.logoURL,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
