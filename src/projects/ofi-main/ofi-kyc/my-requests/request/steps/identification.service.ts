import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { take } from 'rxjs/operators';

import {
    mapValues,
    isArray,
    isObject,
    reduce,
    pickBy,
    get as getValue,
    set as setValue,
    merge,
    omit,
    flatten,
    pick,
    isNil,
    forEach,
    clone,
    find,
} from 'lodash';

import { NewRequestService } from '../new-request.service';
import { RequestsService } from '../../requests.service';
import { DocumentsService } from './documents.service';
import { BeneficiaryService } from './identification/beneficiary.service';
import { setMyKycStakeholderRelations } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request';
import { MyKycRequestedIds } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Injectable()
export class IdentificationService {

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'stakeholderRelations']) stakeholderRelations$;

    stakeholderIdsToUpdate = {};
    stakeholdersRelationTable = [];
    previousStakeholdersRelationTable = [];

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
        private documentsService: DocumentsService,
        private beneficiaryService: BeneficiaryService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    getPreviousRelations() {
        this.stakeholderRelations$.pipe(take(1))
            .subscribe((relations) => {
                this.previousStakeholdersRelationTable = relations;
            });
    }

    /**
     * Send request to membernode, for each of the current active kyc(s) to update 'General Information'
     * And update the completed step for the kycs
     * @param {FormGroup} form
     * @param {MyKycRequestedIds} requests
     * @return {Promise<any[]>}
     */
    sendRequestGeneralInformation(form: FormGroup, requests: MyKycRequestedIds) {
        const promises = [];
        const context = this.newRequestService.context;

        requests.forEach((request) => {

            const kycID = request.kycID;

            form.get('kycID').setValue(kycID);
            const generalPromise = this.sendRequestGeneral(form);
            promises.push(generalPromise);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'generalInformation', context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    /**
     * Send request to membernode, for each of the current active kyc(s) to update 'Company Information'
     * And update the completed step for the kycs
     * @param {FormGroup} form
     * @param {MyKycRequestedIds} requests
     * @return {Promise<any[]>}
     */
    sendRequestCompanyInformation(form: FormGroup, requests: MyKycRequestedIds) {
        const promises = [];
        const context = this.newRequestService.context;

        requests.forEach((request) => {

            const kycID = request.kycID;

            form.get('kycID').setValue(kycID);
            const companyPromise = this.sendRequestCompany(form);
            promises.push(companyPromise);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'companyInformation', context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises).then(() => {
            // update tthe stakeholderRelationTable in redux? not sure why we need to do this.
            this.ngRedux.dispatch(setMyKycStakeholderRelations(this.stakeholdersRelationTable));
        });
    }

    sendRequestBeneficiaryList(form, requests, connectedWallet) {
        this.getPreviousRelations();
        this.stakeholdersRelationTable = [];

        const promises = [];
        const context = this.newRequestService.context;
        requests.forEach((request, index) => {

            const kycID = request.kycID;

            const formGroupBeneficiaries = form;

            this.stakeholdersRelationTable.push({ kycID, stakeholderIDs: [] });
            const beneficiariesPromises = this.handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet, index);

            promises.push(beneficiariesPromises);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'stakeholders', context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises).then(() => {
            this.ngRedux.dispatch(setMyKycStakeholderRelations(this.stakeholdersRelationTable));
        });
    }

    sendRequestBankingInformation(form, requests) {
        const promises = [];
        const context = this.newRequestService.context;
        requests.forEach((request, index) => {

            const kycID = request.kycID;

            form.get('kycID').setValue(kycID);

            const formGroupBankingHolders = form.get('custodianHolders');
            const formGroupBankingHoldersValue = formGroupBankingHolders.value;
            formGroupBankingHoldersValue.forEach((singleHolderValue, key) => {
                let data = pickBy(singleHolderValue);
                data = Object.assign({}, data, { kycID });

                const bankingPromise = this.sendRequestBanking(data).then((data) => {
                    (formGroupBankingHolders as FormArray).at(key).get('custodianID').patchValue(data.custodianID);
                });
                promises.push(bankingPromise);
            });

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'bankAccounts', context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises).then(() => {
            this.ngRedux.dispatch(setMyKycStakeholderRelations(this.stakeholdersRelationTable));
        });
    }

    sendRequestClassificationInformation(form, requests) {
        const promises = [];
        const context = this.newRequestService.context;
        requests.forEach((request, index) => {

            const kycID = request.kycID;

            form.get('kycID').setValue(kycID);
            const classificationPromises = this.prepareRequestClassification(form);
            promises.concat(classificationPromises);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'classification', context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises).then(() => {
            this.ngRedux.dispatch(setMyKycStakeholderRelations(this.stakeholdersRelationTable));
        });
    }

    handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet, kycIndex) {
        const beneficiaryValues = formGroupBeneficiaries.value;
        const promises = this.sendRequestBeneficiaries(beneficiaryValues, kycID, connectedWallet).then((responses) => {
            formGroupBeneficiaries.controls.forEach((beneficiary, index) => {
                if (kycIndex === 0) {
                    beneficiary.get('companyBeneficiariesID').setValue(responses[index]);
                }
                beneficiary.get('kycID').setValue(kycID);
                beneficiaryValues[index].companyBeneficiariesID = responses[index];
            });

            return beneficiaryValues;
        });

        let toResend: any[] = [];

        // We first need to be sure we have all stakeholder ids before resending them with updated parent ids
        return promises.then((beneficiaryValues) => {
            beneficiaryValues.forEach((rawStakeholder, index) => {
                const stakeholder = clone(rawStakeholder);
                const parent = stakeholder.common.parent;
                const parentValue = getValue(parent, [0, 'id']);

                let newValue = this.stakeholderIdsToUpdate[parentValue];

                if (parentValue !== -1) {
                    const position = this.getPositionInRelations(this.stakeholdersRelationTable, parentValue);

                    if (position !== null) {
                        const foundRelation = find(this.stakeholdersRelationTable, ['kycID', kycID]);
                        newValue = foundRelation.stakeholderIDs[position];
                    }

                    if (newValue) {
                        const value = [{ id: newValue }];
                        if (kycIndex === 0) {
                            formGroupBeneficiaries.get(`${index}.common.parent`).setValue(value);
                        }
                        stakeholder.common.parent = value;
                        toResend.push(stakeholder);
                    }
                }
            });

            this.beneficiaryService.fillInStakeholderSelects(formGroupBeneficiaries);

            if (toResend.length) {
                const promises = this.sendRequestBeneficiaries(toResend, kycID, connectedWallet);

                toResend = [];

                return promises;
            }
        });
    }

    deleteBeneficiary(kycID, id) {
        const messageBody = {
            RequestName: 'deletekyccompanybeneficiaries',
            kycID,
            id,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    /**
     * Update kyc completed step in the database
     * @param {number} kycID
     * @param {string} completedStep
     * @param {string} context: e.g '34-3'
     * @return {Promise<any>}
     */
    sendRequestUpdateCurrentStep(kycID: number, completedStep: string, context: string): Promise<any> {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep,
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    /**
     * Send request to membernode to update 'Gerneral information' of the kyc.
     * @param {any} formGroupGeneral
     * @return {Promise<any>}
     */
    sendRequestGeneral(formGroupGeneral) {
        const extracted = this.newRequestService.getValues(formGroupGeneral.value);

        const messageBody = {
            RequestName: 'updatekycgeneral',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody);
    }

    /**
     * Send request to membernode to update 'Company information' of the kyc.
     * @param {any} formGroupGeneral
     * @return {Promise<any>}
     */
    sendRequestCompany(formGroupCompany) {
        const formGroupCompanyValue = omit(formGroupCompany.value, ['beneficiaries']);
        const extracted = this.newRequestService.getValues(formGroupCompanyValue);
        console.log('company form values', extracted);

        const messageBody = {
            RequestName: 'updatekyccompany',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestBeneficiaries(beneficiariesValue, kycID, connectedWallet) {
        const promises = [];

        beneficiariesValue.forEach((beneficiaryValue, index) => {
            const kycDocument = getValue(beneficiaryValue, ['common', 'document']);
            const kycDocumentID = getValue(kycDocument, 'kycDocumentID');
            const hash = getValue(kycDocument, 'hash');

            let beneficiaryPromise;
            if (kycDocumentID) {
                beneficiaryPromise = this.sendRequestBeneficiary(kycID, beneficiaryValue, kycDocumentID, index);
            } else if (hash) {
                beneficiaryPromise = this.documentsService.sendRequestDocumentControl(kycDocument, connectedWallet).then((data) => {
                    const kycDocumentID = getValue(data, 'kycDocumentID');

                    return this.sendRequestBeneficiary(kycID, beneficiaryValue, kycDocumentID, index);
                });
            } else {
                beneficiaryPromise = this.sendRequestBeneficiary(kycID, beneficiaryValue, null, index);
            }

            promises.push(beneficiaryPromise);
        });

        return Promise.all(promises);
    }

    getPositionInRelations(relationTable, companyBeneficiariesID) {
        let position = null;

        relationTable.forEach((relation) => {
            relation.stakeholderIDs.forEach((stakeholder, index) => {
                if (stakeholder === companyBeneficiariesID) {
                    position = index;
                }
            });
        });

        return position;
    }

    sendRequestBeneficiary(kycID, beneficiaryValue, documentID, index) {
        const firstLevel = omit(beneficiaryValue, ['common', 'legalPerson', 'naturalPerson']);
        const values = merge(firstLevel, beneficiaryValue.common, beneficiaryValue.legalPerson, beneficiaryValue.naturalPerson);
        const extracted = this.newRequestService.getValues(values);

        const oldCompanyBeneficiariesID = extracted.companyBeneficiariesID;
        const parent = extracted.parent;

        if (oldCompanyBeneficiariesID) {
            const currentKycID = kycID;
            const position = this.getPositionInRelations(this.previousStakeholdersRelationTable, oldCompanyBeneficiariesID);

            if (position !== null) {
                const foundRelation = find(this.previousStakeholdersRelationTable, ['kycID', currentKycID]);
                extracted.companyBeneficiariesID = foundRelation.stakeholderIDs[position];
            }
        }

        if (this.beneficiaryService.isLocalBeneficiaryId(oldCompanyBeneficiariesID)) {
            delete extracted.companyBeneficiariesID;
        }
        if (this.beneficiaryService.isLocalBeneficiaryId(parent)) {
            delete extracted.parent;
        }

        delete extracted.document;
        extracted.documentID = documentID;

        extracted.kycID = kycID;

        const messageBody = {
            RequestName: 'updatekyccompanybeneficiaries',
            ...extracted,
        };

        return this.requestsService.sendRequest(messageBody).then((data) => {
            const companyBeneficiariesID = getValue(data, [1, 'Data', 0, 'companyBeneficiariesID']);

            if (companyBeneficiariesID) {
                if (this.beneficiaryService.isLocalBeneficiaryId(oldCompanyBeneficiariesID)) {
                    this.stakeholderIdsToUpdate[oldCompanyBeneficiariesID] = Number(companyBeneficiariesID);
                }
                const relation = find(this.stakeholdersRelationTable, ['kycID', extracted.kycID]);

                if (relation) {
                    relation.stakeholderIDs[index] = companyBeneficiariesID;
                }

                return companyBeneficiariesID;
            }
        });
    }

    sendRequestBanking(formGroupBankingValue) {
        const extracted = this.newRequestService.getValues(formGroupBankingValue);

        const messageBody = {
            RequestName: 'updatekycbanking',
            ...extracted,
        };

        return this.requestsService.sendRequest(messageBody).then(response => getValue(response, [1, 'Data', 0]));
    }

    deleteHolder(custodianID) {
        const messageBody = {
            RequestName: 'deletekycbanking',
            custodianID,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    prepareRequestClassification(formGroupClassification) {
        const promises = [];
        const formGroupClassificationValue = formGroupClassification.value;
        const kycID = formGroupClassificationValue.kycID;
        const optFor = formGroupClassificationValue.optFor;
        const optForValues = formGroupClassificationValue.optForValues;

        if (optFor && optForValues) {
            const formValue = clone(formGroupClassificationValue);
            const optForValue = find(optForValues, ['id', kycID]);

            formValue.optFor = optForValue.opted;

            const promise = this.sendRequestClassification(formValue);
            promises.push(promise);
        } else {
            const promise = this.sendRequestClassification(formGroupClassificationValue);
            promises.push(promise);
        }

        return promises;
    }

    sendRequestClassification(formGroupClassification) {
        let formGroupClassificationValue = omit(formGroupClassification, ['nonPro', 'optForValues']);

        formGroupClassificationValue = merge(
            formGroupClassificationValue,
            formGroupClassification.nonPro,
        );

        const extracted = this.newRequestService.getValues(formGroupClassificationValue);
        if (!isNil(extracted.activitiesBenefitFromExperience)) {
            extracted.activitiesBenefitFromExperience = Number(extracted.activitiesBenefitFromExperience);
        }

        const messageBody = {
            RequestName: 'updatekycclassification',
            ...extracted,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getCurrentFormGeneralData(kycID) {
        return this.requestsService.getKycGeneral(kycID);
    }

    getCurrentFormCompanyData(kycID) {
        return this.requestsService.getKycCompany(kycID);
    }

    getCurrentFormBankingData(kycID) {
        return this.requestsService.getKycBanking(kycID);
    }

    getCurrentFormClassificationData(kycID) {
        return this.requestsService.getKycClassification(kycID);
    }

    getCurrentFormCompanyBeneficiariesData(kycID) {
        return this.requestsService.getKycBeneficiaries(kycID);
    }
}

const beneficiaryFormPaths = {
    parent: 'common',
    address: 'common',
    address2: 'common',
    zipCode: 'common',
    city: 'common',
    country: 'common',
    countryTaxResidence: 'common',
    holdingPercentage: 'common',
    holdingType: 'common',
    nationality: 'common',
    votingPercentage: 'common',
    relationType: 'common',
    exerciseControl: 'common',

    firstName: 'naturalPerson',
    lastName: 'naturalPerson',
    dateOfBirth: 'naturalPerson',
    cityOfBirth: 'naturalPerson',
    countryOfBirth: 'naturalPerson',
    isLegalRepresentative: 'naturalPerson',
    isPoliticallyExposed: 'naturalPerson',

    legalName: 'legalPerson',
    nationalIdNumberType: 'legalPerson',
    otherNationalIdNumberType: 'legalPerson',
    nationalIdNumberText: 'legalPerson',
    leiCode: 'legalPerson',
};

export function buildBeneficiaryObject(responseData) {
    const beneficiary = {};

    // Remove null value
    const data = pickBy(responseData, v => v !== null);

    forEach(data, (value, key) => {
        let path = getValue(beneficiaryFormPaths, key, '');
        path = path ? [path, key].join('.') : key;

        setValue(beneficiary, path, value);
    });

    return beneficiary;
}
