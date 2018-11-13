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

            let promise;
            const kycDocumentID = formGroupValidation.get('electronicSignatureDocument.kycDocumentID').value;
            if (kycDocumentID) {
                promise = this.sendRequestValidation(formGroupValidation, kycDocumentID, kycID);
            } else {
                const documentValue = formGroupValidation.get('electronicSignatureDocument').value;
                if (documentValue.name && documentValue.hash) {
                    promise = this.documentsService.sendRequestDocumentControl(documentValue, connectedWallet).then((data) => {
                        const kycDocumentID = getValue(data, 'kycDocumentID');

                        return this.sendRequestValidation(formGroupValidation, kycDocumentID, kycID);
                    });
                } else {
                    promise = this.sendRequestValidation(formGroupValidation, 0, kycID);
                }
            }

            promises.push(promise);

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
