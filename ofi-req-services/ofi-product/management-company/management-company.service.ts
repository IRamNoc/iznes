import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import {
    ManagementCompanyRequestMessageBody,
    ManagementCompanyRequestData,
    SaveManagementCompanyRequestBody,
    UpdateManagementCompanyRequestBody,
    DeleteManagementCompanyRequestData,
    DeleteManagementCompanyRequestBody,
} from './management-company.service.model';
import {
    setRequestedManagementCompany,
    // clearRequestedManagementCompany,
    SET_MANAGEMENT_COMPANY_LIST,
    setRequestedInvestorManagementCompany,
    // clearRequestedINVManagementCompany,
    SET_INV_MANAGEMENT_COMPANY_LIST,
} from '../../../ofi-store/ofi-product/management-company/management-company-list/actions';

@Injectable()
export class OfiManagementCompanyService {
    accountId = 0;
    isManagementCompanyRequested: boolean;
    isInvestorManagementCompanyRequested: boolean;

    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'authentication', 'isLogin']) isLogin$;
    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) reqManagementCompany$;
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'investorManagementCompanyList',
        'invRequest',
    ]) reqInvestorManagementCompany$;

    constructor(private memberSocketService: MemberSocketService, private ngRedux: NgRedux<any>) {
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
        .subscribe(getMyAccountId => this.setAccountId(getMyAccountId));

        this.reqManagementCompany$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(v => this.isManagementCompanyRequested = v);

        this.reqInvestorManagementCompany$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(v => this.isInvestorManagementCompanyRequested = v);
    }

    setAccountId(accountId: number) {
        this.accountId = accountId;
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

    fetchInvestorManagementCompanyList(requestAll: boolean = false) {
        const asyncTaskPipe = this.requestInvestorManagementCompanyList(requestAll);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_INV_MANAGEMENT_COMPANY_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedInvestorManagementCompany());
            },
        ));
    }

    requestInvestorManagementCompanyList(requestAll: boolean): any {
        const messageBody: ManagementCompanyRequestMessageBody = {
            RequestName: 'izngetmanagementcompanylistforinvestor',
            token: this.memberSocketService.token,
            accountID: requestAll ? 0 : this.accountId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestManagementCompanyList(): any {
        const messageBody: ManagementCompanyRequestMessageBody = {
            RequestName: 'getManagementCompanyList',
            token: this.memberSocketService.token,
            accountID: this.accountId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveManagementCompany(mcData: ManagementCompanyRequestData): any {
        const messageBody: SaveManagementCompanyRequestBody = {
            RequestName: 'newmanagementcompany',
            token: this.memberSocketService.token,
            entityId: this.accountId,   // entityId = accountID (name just changed)
            companyName: mcData.companyName,
            emailAddress: mcData.emailAddress,
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

    updateManagementCompany(mcData: ManagementCompanyRequestData): any {
        const messageBody: UpdateManagementCompanyRequestBody = {
            RequestName: 'updatemanagementcompany',
            token: this.memberSocketService.token,
            entityId: this.accountId,
            companyID: mcData.companyID,
            companyName: mcData.companyName,
            emailAddress: mcData.emailAddress,
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

    deleteManagementCompany(mcData: DeleteManagementCompanyRequestData): any {
        const messageBody: DeleteManagementCompanyRequestBody = {
            RequestName: 'deletemanagementcompany',
            token: this.memberSocketService.token,
            companyID: mcData.companyID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
