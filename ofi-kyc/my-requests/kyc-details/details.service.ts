import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { get as getValue, toPairs, map, chain, value, omit, pickBy, pick, find, parseInt } from 'lodash';

import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import * as requestsConfig from '../requests.config';

@Injectable({
    providedIn: 'root'
})
export class KycDetailsService {

    constructor(
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>
    ) {
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
    }

    getFileByID(fileID) {
        return this.ofiKycService.requestKycDocumentByID(this.ngRedux, fileID);
    }

    toArray(data) {
        return chain(data)
        .omit([
            'kycID',
            'objectivesSameInvestmentCrossAm',
            'assetManagementCompanyID',
            'constraintsSameInvestmentCrossAm',
            'companyBeneficiariesID'
        ])
        .pickBy()
        .toPairs()
        .map(([controlName, controlValue]) => ({
            originalId: controlName,
            id: this.getNameFromControl(controlName),
            value: this.getValueFromControl(controlName, controlValue)
        }))
        .filter()
        .value()
            ;
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
        for (let row of rows) {
            if (requestsConfig.fileControls.indexOf(row.originalId) !== -1) {
                await this.getFileByID(row.value).then(response =>
                    {
                        let document = getValue(response, [1, 'Data', 0]);
                        row.hash = document.hash;
                        row.name = document.name;
                    },
                    () => {
                        return;
                    }
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
            try {
                return find(list, ['id', controlValue]).text;
            } catch (e) {

            }
        }

        return controlValue;
    }

    getNameFromControl(controlName) {
        return requestsConfig.controlToName[controlName] || controlName;
    }
}