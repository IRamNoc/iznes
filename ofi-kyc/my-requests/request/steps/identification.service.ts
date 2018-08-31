import {Injectable} from '@angular/core';
import {FormArray} from '@angular/forms';
import {MemberSocketService} from '@setl/websocket-service';

import {mapValues, isArray, isObject, reduce, pickBy, get as getValue, merge, omit, flatten, pick, isNil} from 'lodash';

import {NewRequestService} from '../new-request.service';
import {RequestsService} from '../../requests.service';
import {DocumentsService} from './documents.service';

@Injectable()
export class IdentificationService {

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
        private documentsService: DocumentsService
    ) {
    }

    sendRequest(form, requests, connectedWallet) {

        let promises = [];
        let context = this.newRequestService.context;

        requests.forEach(request => {
            let kycID = request.kycID;

            let formGroupGeneral = form.get('generalInformation');
            formGroupGeneral.get('kycID').setValue(kycID);
            let generalPromise = this.sendRequestGeneral(formGroupGeneral);
            promises.push(generalPromise);

            let formGroupCompany = form.get('companyInformation');
            let formGroupBeneficiaries = formGroupCompany.get('beneficiaries');
            promises.concat(this.handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet));

            formGroupCompany.get('kycID').setValue(kycID);
            let companyPromise = this.sendRequestCompany(formGroupCompany);
            promises.push(companyPromise);

            let formGroupBanking = form.get('bankingInformation');
            formGroupBanking.get('kycID').setValue(kycID);

            let formGroupBankingCustom = formGroupBanking.get('custodianHolderCustom');
            let formGroupBankingCustomValue = formGroupBankingCustom.value;
            let formGroupBankingValue = omit(formGroupBanking.value, 'custodianHolderCustom');
            formGroupBankingCustomValue.forEach((singleCustomValue, key) => {
                let data = merge({}, singleCustomValue, formGroupBankingValue);
                data = pickBy(data);

                let bankingPromise = this.sendRequestBanking(data).then(data => {
                    (formGroupBankingCustom as FormArray).at(key).get('custodianID').patchValue(data.custodianID);
                });
                promises.push(bankingPromise);
            });


            let formGroupClassification = form.get('classificationInformation');
            formGroupClassification.get('kycID').setValue(kycID);
            let classificationPromise = this.sendRequestClassification(formGroupClassification);
            promises.push(classificationPromise);

            let updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    handleBeneficiaries(formGroupBeneficiaries, kycID, connectedWallet){
        let promises = [];

        formGroupBeneficiaries.controls.forEach(formGroupBeneficiary => {

            let kycDocumentID = formGroupBeneficiary.get('document.kycDocumentID').value;
            let beneficiaryDocumentPromise;
            if (kycDocumentID) {
                formGroupBeneficiary.get('kycID').setValue(kycID);
                this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID)
            } else {
                beneficiaryDocumentPromise = this.documentsService.sendRequestDocumentControl(formGroupBeneficiary.get('document').value, connectedWallet).then(data => {
                    formGroupBeneficiary.get('kycID').setValue(kycID);
                    let kycDocumentID = getValue(data, 'kycDocumentID');
                    this.sendRequestBeneficiary(formGroupBeneficiary, kycDocumentID);
                });
            }
            promises.push(beneficiaryDocumentPromise);

        });
        return promises;
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID: kycID,
            completedStep: 'identification',
            currentGroup: context
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestGeneral(formGroupGeneral) {
        let extracted = this.newRequestService.getValues(formGroupGeneral.value);

        const messageBody = {
            RequestName: 'updatekycgeneral',
            ...extracted
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestCompany(formGroupCompany) {
        let formGroupCompanyValue = omit(formGroupCompany.value, ['beneficiaries']);
        let extracted = this.newRequestService.getValues(formGroupCompanyValue);

        const messageBody = {
            RequestName: 'updatekyccompany',
            ...extracted
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestBeneficiary(formGroupBeneficiary, documentID) {
        let extracted = this.newRequestService.getValues(formGroupBeneficiary.value);
        delete extracted.document;
        extracted.documentID = documentID;

        const messageBody = {
            RequestName: 'updatekyccompanybeneficiaries',
            ...extracted
        };
        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestBanking(formGroupBankingValue) {
        let extracted = this.newRequestService.getValues(formGroupBankingValue);

        const messageBody = {
            RequestName: 'updatekycbanking',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody).then(response => getValue(response, [1, 'Data', 0]));
    }

    sendRequestClassification(formGroupClassification) {
        let formGroupClassificationValue = omit(formGroupClassification.value, ['nonPro', 'pro']);
        formGroupClassificationValue = merge(
            formGroupClassificationValue,
            formGroupClassification.value.nonPro,
            formGroupClassification.value.pro
        );

        let extracted = this.newRequestService.getValues(formGroupClassificationValue);
        if (!isNil(extracted.activitiesBenefitFromExperience)) {
            extracted.activitiesBenefitFromExperience = Number(extracted.activitiesBenefitFromExperience);
        }
        if (!isNil(extracted.changeProfessionalStatus)) {
            extracted.changeProfessionalStatus = Number(extracted.changeProfessionalStatus);
        }

        const messageBody = {
            RequestName: 'updatekycclassification',
            ...extracted
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