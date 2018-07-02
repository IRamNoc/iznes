import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';

import {NewRequestService} from '../new-request.service';

import {mapValues, isArray, isObject, reduce, pickBy, get as getValue, merge, omit, flatten} from 'lodash';

@Injectable()
export class IdentificationService {

    requests;

    constructor(
        private newRequestService: NewRequestService,
        private memberSocketService: MemberSocketService
    ) {
    }

    getRequest() {
        const messageBody = 1;
    }

    sendRequest(form, _requests) {
        this.requests = _requests;

        let promises = [];

        this.requests.forEach(request => {
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
        });

        return Promise.all(promises)
    }

    sendRequestGeneral(formGroupGeneral) {
        let extracted = this.getValues(formGroupGeneral.value);

        const messageBody = {
            RequestName: 'updatekycgeneral',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    sendRequestCompany(formGroupCompany) {
        let formGroupCompanyValue = omit(formGroupCompany.value, ['beneficiaries']);
        let extracted = this.getValues(formGroupCompanyValue);

        const messageBody = {
            RequestName: 'updatekyccompany',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    sendRequestBeneficiary(formGroupBeneficiary) {
        let extracted = this.getValues(formGroupBeneficiary.value);

        const messageBody = {
            RequestName: 'insertkyccompanybeneficiaries',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    sendRequestBanking(formGroupBanking) {
        let extracted = this.getValues(formGroupBanking.value);

        const messageBody = {
            RequestName: 'updatekycbanking',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    sendRequestClassification(formGroupClassification) {
        let formGroupClassificationValue = omit(formGroupClassification.value, ['nonPro', 'pro']);
        formGroupClassificationValue = merge(
            formGroupClassificationValue,
            formGroupClassification.value.nonPro,
            formGroupClassification.value.pro
        );

        let extracted = this.getValues(formGroupClassificationValue);

        const messageBody = {
            RequestName: 'updatekycclassification',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    getValues(group) {
        return mapValues(group, single => {
            if (isArray(single)) {
                return reduce(single, (acc, curr) => {
                    let val = curr.id ? curr.id : curr;

                    return acc ? [acc, val].join(' ') : val;
                }, '')
            } else if (isObject(single)) {
                let filtered = pickBy(single);
                return Object.keys(filtered).join(' ');
            }

            return single;
        });
    }

}