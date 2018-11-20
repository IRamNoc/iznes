import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { MemberSocketService } from '@setl/websocket-service';
import { FileService } from '@setl/core-req-services/file/file.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { NgRedux } from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { checkboxControls, selectControls } from './requests.config';

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
        private ngRedux: NgRedux<any>,
        private memberSocketService: MemberSocketService,
        private fileService: FileService,
        private kycService: OfiKycService,
        private toasterService: ToasterService,
        private translateService: MultilingualService,
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
            text: company.companyName,
        }))
        .values()
        .value();
    }

    filterCompanies(companies, kycList) {
        kycList = _.keyBy(kycList, 'amManagementCompanyID');

        return _.filter(companies, company => !kycList[company.companyID]);
    }

    shapeServerData(data) {
        return _.mapValues(data, (value: string, key) => {
            if (!value) {
                return value;
            }

            if (selectControls.indexOf(key) !== -1) {
                const split = value.split(' ');

                return split.map((value) => {
                    return { id: value };
                });
            }

            if (checkboxControls.indexOf(key) !== -1) {
                const split = value.split(' ');
                const trueArray = new Array(split.length).fill(true);
                const zip = _.zip(split, trueArray);

                return _.fromPairs(zip);
            }

            return value;
        });
    }

    deleteKyc(kycID) {
        return this.kycService.deleteKycRequest({
            kycID,
        }).then(
            (response) => {
                this.toasterService.pop('success', this.translateService.translate('The request has been successfully deleted'));
            },
        ).catch(() => {
            this.toasterService.pop('error', this.translateService.translate('Couldn\'t delete KYC request, please try again later.'));
        });
    }

    getKycGeneral(kycID) {
        const messageBody = {
            RequestName: 'getkycgeneral',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycCompany(kycID) {
        const messageBody = {
            RequestName: 'getkyccompany',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycBanking(kycID) {
        const messageBody = {
            RequestName: 'getkycbanking',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data']);

            return data.map(custodian => this.shapeServerData(custodian));
        });
    }

    getKycClassification(kycID) {
        const messageBody = {
            RequestName: 'getkycclassification',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycNature(kycID) {
        const messageBody = {
            RequestName: 'getkycrisknature',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycObjective(kycID) {
        const messageBody = {
            RequestName: 'getkycriskobjective',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data', 0]);

            return this.shapeServerData(data);
        });
    }

    getKycBeneficiaries(kycID) {
        const messageBody = {
            RequestName: 'getkyccompanybeneficiaries',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            const data = _.get(response, [1, 'Data']);

            return data.map(beneficiary => this.shapeServerData(beneficiary));
        });
    }

    getKycDocuments(kycID, connectedWallet) {
        const messageBody = {
            RequestName: 'getkycdocument',
            kycID,
            walletID: connectedWallet,
        };

        return this.sendRequest(messageBody).then((response) => {
            return _.get(response, [1, 'Data']);
        });
    }

    getKycDocument(kycDocumentID) {
        const messageBody = {
            RequestName: 'getkycdocument',
            kycDocumentID,
        };

        return this.sendRequest(messageBody).then((response) => {
            return _.get(response, [1, 'Data', 0]);
        });
    }

    getKycValidation(kycID) {
        const messageBody = {
            RequestName: 'getkycvalidation',
            kycID,
        };

        return this.sendRequest(messageBody).then((response) => {
            return _.get(response, [1, 'Data', 0]);
        });
    }

    sendRequest(params) {
        const messageBody = {
            token: this.memberSocketService.token,
            ...params,
        };

        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
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
                    },
                ),
            );
        });
    }

    uploadFile(event) {
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, (file) => {
                return file.status !== 'uploaded-file';
            }),
        });

        return new Promise((resolve, reject) => {
            const saga = SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (response) => {
                    const file = _.get(response, [1, 'Data', 0, 0]);
                    resolve(file);
                },
                () => {
                    reject();
                });

            this.ngRedux.dispatch(saga);
        });
    }

    getContext() {
    }

    getText() {
    }
}
