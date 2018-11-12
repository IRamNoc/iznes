import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { get as getValue, toPairs, map, chain, value, omit, pickBy, pick, find, parseInt, isNil, toString, sortBy, isEmpty } from 'lodash';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import * as requestsConfig from '../requests.config';

import { clearkycdetailsall } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-details';

@Injectable({
    providedIn: 'root',
})
export class KycDetailsService {

    constructor(
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    clearData(){
        this.ngRedux.dispatch(clearkycdetailsall());
    }

    getData(kycID) {
        return this.ofiKycService.getKyc(kycID).then((response) => {
            const alreadyCompleted = getValue(response, [1, 'Data', 0, 'alreadyCompleted']);

            if (isNil(alreadyCompleted)) {
                return;
            }

            if (alreadyCompleted === 0) {
                this.getDetails(kycID);
            }
            if (alreadyCompleted === 1) {
                this.getLightDetails(kycID);
            }

            return alreadyCompleted;
        });
    }

    getLightDetails(kycID) {
        OfiKycService.defaultRequestKycDetailsValidation(this.ofiKycService, this.ngRedux, kycID);
    }

    getDetails(kycID) {
        OfiKycService.defaultRequestKycDetailsGeneral(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsCompany(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsCompanyBeneficiaries(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsBanking(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsClassification(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsRiskNature(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsRiskObjectives(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsDocuments(this.ofiKycService, this.ngRedux, kycID);
        OfiKycService.defaultRequestKycDetailsValidation(this.ofiKycService, this.ngRedux, kycID);
    }

    getFileByID(fileID) {
        return this.ofiKycService.requestKycDocumentByID(this.ngRedux, fileID);
    }

    toArray(data) {
        if (!isNil(data.optFor)) {
            if (data.investorStatus === requestsConfig.investorStatusList.nonPro) {
                data.optForPro = data.optFor;
            } else if (data.investorStatus !== requestsConfig.investorStatusList.nonPro) {
                data.optForNonPro = data.optFor;
            }

            delete data.optFor;
        }

        const array = chain(data)
            .omit([
                'kycID',
                'objectivesSameInvestmentCrossAm',
                'assetManagementCompanyID',
                'constraintsSameInvestmentCrossAm',
                'companyBeneficiariesID',
                'custodianID',
            ])
            .omitBy(isNil)
            .toPairs()
            .map(([controlName, controlValue]) => ({
                originalId: controlName,
                id: this.getNameFromControl(controlName),
                originalValue: controlValue,
                value: (() => {
                    controlValue = this.getValueFromControl(controlName, controlValue);
                    return this.getBooleanValueFromControl(controlName, controlValue);
                })(),
            }))
            .filter()
            .value();

        return array;
    }

    order(data){
        return sortBy(data, (val) => {
            return requestsConfig.controlOrder.indexOf(val.originalId);
        });
    }

    isFromForm(id) {
        return requestsConfig.selectControls.indexOf(id) !== -1 || requestsConfig.checkboxControls.indexOf(id) !== -1;
    }

    extractDocuments(documents) {
        return documents.map(document => ({
            id: this.getDocumentType(document.type),
            hash: document.hash
        }));
    }

    async getHashes(rows) {
        for (const row of rows) {
            if (requestsConfig.fileControls.indexOf(row.originalId) !== -1) {
                await this.getFileByID(row.value).then(
                    (response) => {
                        const document = getValue(response, [1, 'Data', 0]);

                        if (document) {
                            row.hash = document.hash;
                            row.name = document.name;
                        } else{
                            row.hash = 'na';
                        }
                    },
                    () => {
                        return;
                    },
                );
            }
        }

        return rows;
    }

    getDocumentType(type) {
        return find(requestsConfig.documentTypesList, ['id', type]).text;
    }

    getValueFromControl(controlName, controlValue) {
        const listName = requestsConfig.controlToList[controlName];
        const list = requestsConfig[listName];

        if (requestsConfig.percentageControls.indexOf(controlName) !== -1) {
            return `${controlValue} %`;
        }

        if (requestsConfig.currencyControls.indexOf(controlName) !== -1) {
            return `${controlValue} €`;
        }

        if (list) {
            controlValue = toString(controlValue);
            return (controlValue as string).split(' ').reduce((acc, cur) => {
                let found = find(list, ['id', cur]);
                found = found ? found.text : cur;
                return acc ? [acc, found].join('|') : found;
            }, '');
        }

        return controlValue;
    }

    getBooleanValueFromControl(controlName, controlValue){
        if (requestsConfig.booleanControls.indexOf(controlName) !== -1) {
            controlValue = parseInt(controlValue, 10);

            if (controlValue === 0) {
                controlValue = 'No';
            } else {
                controlValue = 'Yes';
            }
        }

        return controlValue;
    }

    getNameFromControl(controlName) {
        return requestsConfig.controlToName[controlName] || controlName;
    }
}
