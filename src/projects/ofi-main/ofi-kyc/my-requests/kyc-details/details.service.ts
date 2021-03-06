import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { get as getValue, toPairs, map, chain, value, omit, pickBy, pick, find, parseInt, isNil, toString, sortBy, isEmpty, isNull } from 'lodash';

import { FileDownloader } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
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
        private memberSocketService: MemberSocketService,
        private fileDownloader: FileDownloader,
    ) {
    }

    clearData() {
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
        // Handle formatting for kyc classification
        if (typeof data.optFor !== 'undefined') {
            if (data.investorStatus === requestsConfig.investorStatusList.nonPro) {
                data.optForPro = data.optFor;
            } else if (data.investorStatus !== requestsConfig.investorStatusList.nonPro) {
                data.optForNonPro = data.optFor;
            }

            delete data.optFor;
        }
        if (isNull(data.classificationChangeAccepted)) {
            data.classificationChangeAccepted = 0;
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
            .omit(this.omitNonProfessionalFields(data.investorStatus))
            .omit(this.omitConditionalFields(data))
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

    /**
     * Remove fields for non-professional investors
     *
     * @param {integer} investorStatus
     *
     * @return {Object} array of fields to omit
     */
    omitNonProfessionalFields(investorStatus) {
        if (investorStatus !== requestsConfig.investorStatusList.nonPro) {
            return [
                'activitiesBenefitFromExperience',
                'activitiesBenefitFromExperienceSpecification',
                'knowledgeFundsAndRisks',
                'knowledgeSkillsPlaceUCIOrders',
                'knowledgeUCI',
                'prospectusKIIDUnderstanding',
                'trainingKnowledgeSkills',
                'trainingKnowledgeSkillsSpecification',
            ];
        }

        return [];
    }

    /**
     * Conditionally remove fields from kyc data grids
     *
     * @param {Object} data
     *
     * @return {Object} omitFields
     */
    omitConditionalFields(data) {
        let omitFields = [];

        Object.keys(data).forEach((field) => {
            if (Object.keys(requestsConfig.omitConditionalFields).indexOf(field) !== -1) {
                if (requestsConfig.omitConditionalFields[field].condition.includes(data[field])) {
                    omitFields = [...omitFields, ...requestsConfig.omitConditionalFields[field].fields];
                }
            }
        });

        return omitFields;
    }

    order(data) {
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
            hash: document.hash,
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
                        } else {
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
            return controlValue !== null ? `${controlValue} %` : controlValue;
        }

        if (requestsConfig.currencyControls.indexOf(controlName) !== -1) {
            return `${controlValue} ???`;
        }

        if (list) {
            controlValue = toString(controlValue);
            return (controlValue as string).split(' ').reduce((acc, cur) => {
                let found = find(list, ['id', cur]);
                found = found ? found.text : cur;
                return acc ? [acc, found].join('|') : found;
            },                                                '');
        }

        return controlValue;
    }

    getBooleanValueFromControl(controlName, controlValue) {
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

    exportStakeholders(kycID, userID, registeredCompanyName) {
        const config = {
            method: 'exportKYCBeneficiariesCSV',
            token: this.memberSocketService.token,
            kycID,
            userId: userID,
            registeredCompanyName,
            timezoneoffset: new Date().getTimezoneOffset(),
        };

        this.fileDownloader.downLoaderFile(config);
    }
}
