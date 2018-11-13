import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

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

@Injectable()
export class IdentificationService {

    stakeholderIdsToUpdate = {};

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
        private documentsService: DocumentsService,
        private beneficiaryService: BeneficiaryService,
    ) {
    }

    sendRequest(form, requests, connectedWallet) {
        const promises = [];
        const context = this.newRequestService.context;

        requests.forEach((request) => {
            const kycID = request.kycID;

            const formGroupGeneral = form.get('generalInformation');
            formGroupGeneral.get('kycID').setValue(kycID);
            const generalPromise = this.sendRequestGeneral(formGroupGeneral);
            promises.push(generalPromise);

            const formGroupCompany = form.get('companyInformation');
            const formGroupBeneficiaries = formGroupCompany.get('beneficiaries');
            promises.concat(this.handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet));

            formGroupCompany.get('kycID').setValue(kycID);
            const companyPromise = this.sendRequestCompany(formGroupCompany);
            promises.push(companyPromise);

            const formGroupBanking = form.get('bankingInformation');
            formGroupBanking.get('kycID').setValue(kycID);

            const formGroupBankingHolders = formGroupBanking.get('custodianHolders');
            const formGroupBankingHoldersValue = formGroupBankingHolders.value;
            formGroupBankingHoldersValue.forEach((singleHolderValue, key) => {
                let data = pickBy(singleHolderValue);
                data = Object.assign({}, data, { kycID });

                const bankingPromise = this.sendRequestBanking(data).then(data => {
                    (formGroupBankingHolders as FormArray).at(key).get('custodianID').patchValue(data.custodianID);
                });
                promises.push(bankingPromise);
            });

            const formGroupClassification = form.get('classificationInformation');
            formGroupClassification.get('kycID').setValue(kycID);
            const classificationPromises = this.prepareRequestClassification(formGroupClassification);
            promises.concat(classificationPromises);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet) {
        const promises = this.sendRequestBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet);

        let toResend: any = {
            controls : [],
        };

        // We first need to be sure we have all stakeholder ids before resending them with updated parent ids
        return Promise.all(promises).then(() => {
            formGroupBeneficiaries.controls.forEach((stakeholder) => {
                const parent = stakeholder.get('common.parent');
                const parentValue = getValue(parent, 'value[0].id');

                if (!parentValue) {
                    return;
                }
                const newValue = this.stakeholderIdsToUpdate[parentValue];
                const isOld = this.beneficiaryService.isLocalBeneficiaryId(parent);

                console.log('********** isold', isOld, 'newvalue', newValue, 'parent value', parentValue);
                if (isOld && newValue) {
                    parent.setValue([{ id: newValue }]);
                    console.log('****** pushing in toresend', JSON.stringify(stakeholder.value));
                    toResend.controls.push(stakeholder);
                }
            });

            this.beneficiaryService.fillInStakeholderSelects(formGroupBeneficiaries);

            console.log('****** checking to resend', toResend.controls);
            if (toResend.controls.length) {
                this.sendRequestBeneficiaries(toResend, kycID, connectedWallet);

                toResend = {};
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

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: 'identification',
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestGeneral(formGroupGeneral) {
        const extracted = this.newRequestService.getValues(formGroupGeneral.value);

        const messageBody = {
            RequestName: 'updatekycgeneral',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestCompany(formGroupCompany) {
        const formGroupCompanyValue = omit(formGroupCompany.value, ['beneficiaries']);
        const extracted = this.newRequestService.getValues(formGroupCompanyValue);

        const messageBody = {
            RequestName: 'updatekyccompany',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet){
        const promises = [];

        formGroupBeneficiaries.controls.forEach((formGroupBeneficiary) => {
            const value = formGroupBeneficiary.value;
            const kycDocument = getValue(value, ['naturalPerson', 'document']);
            const kycDocumentID = getValue(kycDocument, 'kycDocumentID');
            const hash = getValue(kycDocument, 'hash');

            formGroupBeneficiary.get('kycID').setValue(kycID);

            let beneficiaryPromise;
            if (kycDocumentID) {
                beneficiaryPromise = this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID);
            } else if (hash) {
                beneficiaryPromise = this.documentsService.sendRequestDocumentControl(kycDocument, connectedWallet).then((data) => {
                    const kycDocumentID = getValue(data, 'kycDocumentID');

                    return this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID);
                });
            } else {
                beneficiaryPromise = this.sendRequestBeneficiary(formGroupBeneficiary, null);
            }

            promises.push(beneficiaryPromise);
        });

        return promises;
    }

    sendRequestBeneficiary(formGroupBeneficiary, documentID) {
        const value = formGroupBeneficiary.value;
        const firstLevel = omit(value, ['common', 'legalPerson', 'naturalPerson']);
        const values = merge(firstLevel, value.common, value.legalPerson, value.naturalPerson);
        const extracted = this.newRequestService.getValues(values);

        const oldCompanyBeneficiariesID = extracted.companyBeneficiariesID;
        const parent = extracted.parent;
        console.log('******** old', oldCompanyBeneficiariesID);
        if (this.beneficiaryService.isLocalBeneficiaryId(oldCompanyBeneficiariesID)) {
            delete extracted.companyBeneficiariesID;
        }
        if (this.beneficiaryService.isLocalBeneficiaryId(parent)) {
            delete extracted.parent;
        }

        delete extracted.document;
        extracted.documentID = documentID;

        const messageBody = {
            RequestName: 'updatekyccompanybeneficiaries',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody).then((data) => {
            const companyBeneficiariesID = getValue(data, [1, 'Data', 0, 'companyBeneficiariesID']);
            console.log('****** is there a company id?', companyBeneficiariesID, data);
            if (companyBeneficiariesID) {
                console.log('***** testing old', oldCompanyBeneficiariesID);
                if (this.beneficiaryService.isLocalBeneficiaryId(oldCompanyBeneficiariesID)) {
                    this.stakeholderIdsToUpdate[oldCompanyBeneficiariesID] = Number(companyBeneficiariesID);
                    console.log('****** stakeholder', this.stakeholderIdsToUpdate);
                }

                formGroupBeneficiary.controls['companyBeneficiariesID'].setValue(companyBeneficiariesID);
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
    nationality : 'common',
    votingPercentage : 'common',

    firstName : 'naturalPerson',
    lastName : 'naturalPerson',
    dateOfBirth : 'naturalPerson',
    cityOfBirth : 'naturalPerson',
    countryOfBirth : 'naturalPerson',

    legalName : 'legalPerson',
    nationalIdNumber : 'legalPerson',
    nationalIdNumberText : 'legalPerson',
    leiCode : 'legalPerson',
};

export function buildBeneficiaryObject(data) {
    const beneficiary = {};

    data = pickBy(data);
    forEach(data, (value, key) => {
        let path = getValue(beneficiaryFormPaths, key, '');
        path = path ? [path, key].join('.') : key;

        setValue(beneficiary, path, value);
    });

    return beneficiary;
}
