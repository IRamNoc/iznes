import {Injectable} from '@angular/core';
import * as _ from 'lodash';

import {MemberSocketService} from '@setl/websocket-service';
import {FileService} from '@setl/core-req-services/file/file.service';
import {NgRedux} from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {checkboxControls} from './requests.config';

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
        private ofiKycService: OfiKycService,
        private ngRedux : NgRedux<any>,
        private memberSocketService : MemberSocketService,
        private fileService : FileService
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
        let ids = [];

        for (let choice of choices) {
            await this.createDraft(choice).then(response => {
                let kycID = _.get(response, [1, 'Data', 0, 'kycID']);
                let amcID = choice.id;

                ids.push({
                    kycID,
                    amcID
                });
            });
        }

        return ids;
    }

    createDraft(choice) {
        return this.ofiKycService.createKYCDraftOrWaitingApproval({
            inviteToken: choice.invitationToken ? choice.invitationToken : '',
            managementCompanyID: choice.id,
            investorWalletID: 0,
            kycStatus: choice.registered ? 1 : 0
        });
    }

    shapeServerData(data) {
        return _.mapValues(data, (value, key) => {
            if(checkboxControls.indexOf(key) !== -1){
                let split = value.split(' ');
                let trueArray = new Array(split.length).fill(true);
                let zip = _.zip(split, trueArray);

                return _.fromPairs(zip);
            }

            return value;
        });
    }


    getKycGeneral(kycID){
        const messageBody = {
            RequestName : 'getkycgeneral',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            return _.get(response, [1, 'Data', 0]);
        });
    }

    getKycCompany(kycID){
        const messageBody = {
            RequestName : 'getkyccompany',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            let data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycBanking(kycID){
        const messageBody = {
            RequestName : 'getkycbanking',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            return _.get(response, [1, 'Data', 0]);
        });
    }

    getKycClassification(kycID){
        const messageBody = {
            RequestName : 'getkycclassification',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            let data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycNature(kycID){
        const messageBody = {
            RequestName : 'getkycrisknature',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            let data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycObjective(kycID){
        const messageBody = {
            RequestName : 'getkycriskobjective',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            let data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycDocuments(kycID, connectedWallet){
        const messageBody = {
            RequestName : 'getkycdocument',
            kycID : kycID,
            walletID : connectedWallet
        };

        return this.sendRequest(messageBody).then(response => {
            return _.get(response, [1, 'Data']);
        });
    }

    getKycValidation(kycID){
        const messageBody = {
            RequestName : 'getkycvalidation',
            kycID : kycID
        };

        return this.sendRequest(messageBody).then(response => {
            return _.get(response, [1, 'Data', 0]);
        });
    }

    sendRequest(params) {
        const messageBody = {
            token: this.memberSocketService.token,
            ...params
        };

        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    private buildRequest(options) {
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    uploadFile(event) {
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, file => {
                return file.status !== 'uploaded-file'
            })
        });

        return new Promise((resolve, reject) => {
            let saga = SagaHelper.runAsyncCallback(asyncTaskPipe, response => {
                let file = _.get(response, [1, 'Data', 0, 0]);
                resolve(file);
            }, () => {
                reject();
            });

            this.ngRedux.dispatch(saga);
        });
    }

}