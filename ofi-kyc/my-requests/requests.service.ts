import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

export enum KycStatus {
    Rejected = -2,
    Approved = -1,
    Draft = 0,
    WaitingForApproval = 1,
    WaitingForMoreInfo = 2,
}

@Injectable()
export class RequestsService {

    constructor(
        private ofiKycService: OfiKycService
    ) {
    }

    extractManagementCompanyData(companies, kycList) {
        if (_.isEmpty(companies)) {
            return [];
        }
        if (!_.isEmpty(kycList)) {
            companies = this.filterCompanies(companies, kycList);
        }

        return _.chain(companies)
            .map(company => ({
                id: company.companyID,
                text: company.companyName
            }))
            .values()
            .value()
            ;
    }

    filterCompanies(companies, kycList) {
        kycList = _.keyBy(kycList, 'amManagementCompanyID');

        return _.filter(companies, company => !kycList[company.companyID]);
    }

    async createMultipleDrafts(choices) {
        for(let choice of choices){
            await this.createDraft(choice);
        }
    }

    createDraft(choice) {

        return this.ofiKycService.createKYCDraftOrWaitingApproval({
            inviteToken: choice.invitationToken ? choice.invitationToken : '',
            managementCompanyID: choice.id,
            investorWalletID: 0,
            kycStatus : choice.registered ? 1 : 0
        });
    }

}