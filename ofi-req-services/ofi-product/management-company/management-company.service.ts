import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {ManagementCompanyRequestMessageBody, SaveManagementCompanyRequestBody} from './management-company.service.model';

interface ManagementCompanyData {
    companyName: string;
    country: string;
    addressPrefix: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    city: string;
    stateArea: string;
    postalCode: string;
    taxResidence: string;
    registrationNum: string;
    supervisoryAuthority: string;
    numSiretOrSiren: string;
    creationDate: string;
    shareCapital: string;
    commercialContact: string;
    operationalContact: string;
    directorContact: string;
    lei: string;
    bic: string;
    giinCode: string;
    logoName: string;
    logoURL: string;
}

@Injectable()
export class OfiManagementCompanyService {

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    accountId = 0;

    constructor(private memberSocketService: MemberSocketService) {
        this.getMyAccountId.subscribe((getMyAccountId) => this.myAccountId(getMyAccountId));
    }

    myAccountId(accountId) {
        this.accountId  = accountId;
    }

    requestManagementCompanyList(): any {
        const messageBody: ManagementCompanyRequestMessageBody = {
            RequestName: 'getManagementCompanyList',
            token: this.memberSocketService.token,
            accountId: this.accountId
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveManagementCompany(mcData: ManagementCompanyData): any {
        const messageBody: SaveManagementCompanyRequestBody = {
            RequestName: 'newmanagementcompany',
            token: this.memberSocketService.token,
            entityId: this.accountId,   // entityId = accountID (name just changed)
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
