import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';

import * as moment from 'moment';
import {mapValues, isArray, isObject, reduce, pickBy, get as getValue, merge, omit, flatten} from 'lodash';

import {NewRequestService} from '../new-request.service';
import {RequestsService} from '../../requests.service';

@Injectable()
export class IdentificationService {

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService
    ) {
    }

    sendRequest(form, requests) {

        let promises = [];
        let timestamp = moment().format('X');

        requests.forEach(request => {
            let kycID = request.kycID;

            let formGroupGeneral = form.get('generalInformation');
            formGroupGeneral.get('kycID').setValue(kycID);
            let generalPromise = this.sendRequestGeneral(formGroupGeneral);
            promises.push(generalPromise);

            let formGroupCompany = form.get('companyInformation');
            let formGroupBeneficiaries = formGroupCompany.get('beneficiaries');
            formGroupBeneficiaries.controls.forEach(formGroupBeneficiary => {
                formGroupBeneficiary.get('kycID').setValue(kycID);
                let beneficiaryPromise = this.sendRequestBeneficiary(formGroupBeneficiary);
                promises.push(beneficiaryPromise);
            });

            formGroupCompany.get('kycID').setValue(kycID);
            let companyPromise = this.sendRequestCompany(formGroupCompany);
            promises.push(companyPromise);

            let formGroupBanking = form.get('bankingInformation');
            formGroupBanking.get('kycID').setValue(kycID);
            let bankingPromise = this.sendRequestBanking(formGroupBanking);
            promises.push(bankingPromise);

            let formGroupClassification = form.get('classificationInformation');
            formGroupClassification.get('kycID').setValue(kycID);
            let classificationPromise = this.sendRequestClassification(formGroupClassification);
            promises.push(classificationPromise);

            let updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, timestamp);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestUpdateCurrentStep(kycID, timestamp){
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID : kycID,
            completedStep : 'identification',
            currentGroup : timestamp
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

    sendRequestBeneficiary(formGroupBeneficiary) {
        let extracted = this.newRequestService.getValues(formGroupBeneficiary.value);

        const messageBody = {
            RequestName: 'insertkyccompanybeneficiaries',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestBanking(formGroupBanking) {
        let extracted = this.newRequestService.getValues(formGroupBanking.value);

        const messageBody = {
            RequestName: 'updatekycbanking',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestClassification(formGroupClassification) {
        let formGroupClassificationValue = omit(formGroupClassification.value, ['nonPro', 'pro']);
        formGroupClassificationValue = merge(
            formGroupClassificationValue,
            formGroupClassification.value.nonPro,
            formGroupClassification.value.pro
        );

        let extracted = this.newRequestService.getValues(formGroupClassificationValue);

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

}