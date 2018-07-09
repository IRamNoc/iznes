import {Injectable} from '@angular/core';
import * as moment from 'moment';

import {NewRequestService} from '../new-request.service';
import {RequestsService} from '../../requests.service';

@Injectable()
export class ValidationService{

    constructor(
        private newRequestService : NewRequestService,
        private requestsService : RequestsService
    ){}

    sendRequest(formGroupValidation, requests){
        let promises = [];
        let timestamp = moment().format('X');

        requests.forEach( request => {
            let kycID = request.kycID;

            formGroupValidation.get('kycID').setValue(kycID);
            let validationPromise = this.sendRequestValidation(formGroupValidation);
            promises.push(validationPromise);

            let updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, timestamp);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    private sendRequestValidation(formGroupValidation){
        let extracted = this.newRequestService.getValues(formGroupValidation.value);

        const messageBody = {
            RequestName : 'updatekycvalidation',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, timestamp){
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID : kycID,
            completedStep : 'validation',
            currentGroup : timestamp
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getCurrentFormValidationData(kycID){
        return this.requestsService.getKycValidation(kycID);
    }

}