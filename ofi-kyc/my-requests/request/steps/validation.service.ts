import { Injectable } from '@angular/core';
import { get as getValue, omit } from 'lodash';

import { NewRequestService } from '../new-request.service';
import { RequestsService } from '../../requests.service';
import { DocumentsService } from './documents.service';

@Injectable()
export class ValidationService {

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
        private documentsService: DocumentsService
    ) {
    }

    sendRequest(formGroupValidation, requests, connectedWallet) {
        let promises = [];
        let context = this.newRequestService.context;

        requests.forEach((request) => {
            const kycID = request.kycID;

            formGroupValidation.get('kycID').setValue(kycID);

            let validationPromise;
            let kycDocumentID = formGroupValidation.get('electronicSignatureDocument.kycDocumentID').value;
            if (kycDocumentID) {
                validationPromise = this.sendRequestValidation(formGroupValidation, kycDocumentID, kycID);
            } else {
                validationPromise = this.documentsService.sendRequestDocumentControl(formGroupValidation.get('electronicSignatureDocument').value, connectedWallet).then(data => {
                    let kycDocumentID = getValue(data, 'kycDocumentID');

                    this.sendRequestValidation(formGroupValidation, kycDocumentID, kycID);
                });
            }

            promises.push(validationPromise);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    private sendRequestValidation(formGroupValidation, kycDocumentID, kycID) {
        let extracted = this.newRequestService.getValues(formGroupValidation.value);
        extracted.kycID = kycID;
        extracted.electronicSignatureDocumentID = kycDocumentID;
        extracted = omit(extracted, 'electronicSignatureDocument');

        const messageBody = {
            RequestName: 'updatekycvalidation',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID: kycID,
            completedStep: 'validation',
            currentGroup: context
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getCurrentFormValidationData(kycID) {
        return this.requestsService.getKycValidation(kycID);
    }

}
