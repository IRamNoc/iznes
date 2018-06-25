import {Injectable} from '@angular/core';

import {NewRequestService} from '../new-request.service';

import {mapValues, isArray, isObject, reduce, pickBy, get as getValue, merge, omit} from 'lodash';

@Injectable()
export class IdentificationService{

    constructor(
        private newRequestService : NewRequestService
    ){}

    sendRequest(form){
        let promises = [];

        let formGroupGeneral = form.get('generalInformation');
        let generalPromise = this.sendRequestGeneral(formGroupGeneral);
        promises.push(generalPromise);

        let formGroupCompany = form.get('companyInformation');
        let companyPromise = this.sendRequestCompany(formGroupCompany);
        promises.push(companyPromise);

        let formGroupBanking = form.get('bankingInformation');
        let bankingPromise = this.sendRequestBanking(formGroupBanking);
        promises.push(bankingPromise);

        let formGroupClassification = form.get('classificationInformation');
        let classificationPromise = this.sendRequestClassification(formGroupClassification);
        promises.push(classificationPromise);

        Promise.all(promises).then(response => {
            console.log('all done!');
        });
    }

    sendRequestGeneral(formGroupGeneral){
        let extracted = this.getValues(formGroupGeneral.value);

        const messageBody = {
            RequestName : 'updatekycgeneral',
            ...extracted
        };

        return this.newRequestService.buildRequest(messageBody);
    }
    sendRequestCompany(formGroupCompany){
        let formGroupCompanyValue = omit(formGroupCompany.value, ['beneficiaries']);
        let extracted = this.getValues(formGroupCompanyValue);

        const messageBody = {
            RequestName : 'updatekyccompany',
            ...extracted
        };

        return this.newRequestService.buildRequest(messageBody);
    }
    sendRequestBanking(formGroupBanking){
        let extracted = this.getValues(formGroupBanking.value);

        const messageBody = {
            RequestName : 'updatekycbanking',
            ...extracted
        };

        return this.newRequestService.buildRequest(messageBody);
    }
    sendRequestClassification(formGroupClassification){
        let formGroupClassificationValue = formGroupClassification.value;
        formGroupClassificationValue = merge(
            getValue(formGroupClassificationValue, 'pro', {}),
            getValue(formGroupClassificationValue, 'nonPro', {})
        );
        let extracted = this.getValues(formGroupClassificationValue);

        const messageBody = {
            RequestName : 'updatekycclassification',
            ...extracted
        };

        return this.newRequestService.buildRequest(messageBody);
    }

    getValues(group){
        return mapValues(group, single => {
            if(isArray(single)){
                return reduce(single, (acc, curr) => {
                    let val = curr.id ? curr.id : curr;

                    return acc ? [acc, val].join(' ') : val;
                }, '')
            } else if(isObject(single)){
                let filtered = pickBy(single);
                return Object.keys(filtered).join(' ');
            }

            return single;
        });
    }

}