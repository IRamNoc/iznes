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

        const booleans = chain(data)
            .omitBy(isNil)
            .pickBy((val, key) => requestsConfig.booleanControls.indexOf(key) !== -1)
            .mapValues(value => parseInt(value, 10) ? 1 : 0)
            .value();

        const currencies = chain(data)
            .omitBy(isNil)
            .pickBy((val, key) => requestsConfig.currencyControls.indexOf(key) !== -1)
            .mapValues(value => `${value} €`)
            .value();

        const percentage = chain(data)
            .omitBy(isNil)
            .pickBy((val, key) => requestsConfig.percentageControls.indexOf(key) !== -1)
            .mapValues(value => `${value} %`)
            .value();

        const array = chain(data)
            .merge(booleans, currencies, percentage)
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
                value: this.getValueFromControl(controlName, controlValue)
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
        let listName = requestsConfig.controlToList[controlName];
        let list = requestsConfig[listName];

        if (requestsConfig.booleanControls.indexOf(controlName) !== -1) {
            controlValue = parseInt(controlValue);

            if (controlValue === 0) {
                controlValue = 'No';
            } else {
                controlValue = 'Yes';
            }
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

    getNameFromControl(controlName) {
        return requestsConfig.controlToName[controlName] || controlName;
    }
}
