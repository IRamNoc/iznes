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
} from 'lodash';

import { NewRequestService } from '../new-request.service';
import { RequestsService } from '../../requests.service';
import { DocumentsService } from './documents.service';

@Injectable()
export class IdentificationService {

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
        private documentsService: DocumentsService,
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

            let formGroupBankingHolders = formGroupBanking.get('custodianHolders');
            let formGroupBankingHoldersValue = formGroupBankingHolders.value;
            formGroupBankingHoldersValue.forEach((singleHolderValue, key) => {
                let data = pickBy(singleHolderValue);
                data = Object.assign({}, data, { kycID });

                let bankingPromise = this.sendRequestBanking(data).then(data => {
                    (formGroupBankingHolders as FormArray).at(key).get('custodianID').patchValue(data.custodianID);
                });
                promises.push(bankingPromise);
            });

            const formGroupClassification = form.get('classificationInformation');
            formGroupClassification.get('kycID').setValue(kycID);
            const classificationPromise = this.sendRequestClassification(formGroupClassification);
            promises.push(classificationPromise);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet) {
        const promises = [];

        formGroupBeneficiaries.controls.forEach((formGroupBeneficiary) => {
            const value = formGroupBeneficiary.value;
            const kycDocument = getValue(value, ['naturalPerson', 'document']);
            const kycDocumentID = getValue(kycDocument, 'kycDocumentID');
            const hash = getValue(kycDocument, 'hash');

            formGroupBeneficiary.get('kycID').setValue(kycID);

            let beneficiaryDocumentPromise;
            if (kycDocumentID) {
                this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID);
            } else if (hash) {
                beneficiaryDocumentPromise = this.documentsService.sendRequestDocumentControl(kycDocument, connectedWallet).then((data) => {
                    const kycDocumentID = getValue(data, 'kycDocumentID');
                    this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID);
                });
            } else {
                this.sendRequestBeneficiary(formGroupBeneficiary, null);
            }
            promises.push(beneficiaryDocumentPromise);

        });
        return promises;
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

    sendRequestBeneficiary(formGroupBeneficiary, documentID) {
        const value = formGroupBeneficiary.value;
        const firstLevel = omit(value, ['common', 'legalPerson', 'naturalPerson']);
        const values = merge(firstLevel, value.common, value.legalPerson, value.naturalPerson);
        const extracted = this.newRequestService.getValues(values);
        delete extracted.document;
        extracted.documentID = documentID;

        const messageBody = {
            RequestName: 'updatekyccompanybeneficiaries',
            ...extracted,
        };
        return this.requestsService.sendRequest(messageBody).then((data) => {
            const companyBeneficiariesID = getValue(data, [1, 'Data', 0, 'companyBeneficiariesID']);

            if (companyBeneficiariesID) {
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

    sendRequestClassification(formGroupClassification) {
        let formGroupClassificationValue = omit(formGroupClassification.value, ['nonPro', 'pro']);
        formGroupClassificationValue = merge(
            formGroupClassificationValue,
            formGroupClassification.value.nonPro,
            formGroupClassification.value.pro,
        );

        const extracted = this.newRequestService.getValues(formGroupClassificationValue);
        if (!isNil(extracted.activitiesBenefitFromExperience)) {
            extracted.activitiesBenefitFromExperience = Number(extracted.activitiesBenefitFromExperience);
        }
        if (!isNil(extracted.changeProfessionalStatus)) {
            extracted.changeProfessionalStatus = Number(extracted.changeProfessionalStatus);
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
    address: 'common',
    address2: 'common',
    zipCode: 'common',
    city: 'common',
    country: 'common',
    holdingPercentage: 'common',
    holdingType: 'common',

    firstName: 'naturalPerson',
    lastName: 'naturalPerson',
    nationality: 'naturalPerson',
    dateOfBirth: 'naturalPerson',
    cityOfBirth: 'naturalPerson',
    countryOfBirth: 'naturalPerson',

    legalName: 'legalPerson',
    nationalIdNumber: 'legalPerson',
    nationalIdNumberText: 'legalPerson',
    leiCode: 'legalPerson',
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