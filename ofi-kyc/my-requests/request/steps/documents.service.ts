import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { merge, get as getValue, values, isEmpty, filter } from 'lodash';

export const documentFormPaths = {
    kyclistshareholdersdoc: 'common',
    kyclistdirectorsdoc: 'common',
    kycbeneficialownersdoc: 'common',
    kyclistauthoriseddoc: 'common',
    kyctaxcertificationdoc: 'common',
    kycw8benefatcadoc: 'common',
    kycproofofapprovaldoc: 'pro',
    kycisincodedoc: 'pro',
    kycwolfsbergdoc: 'pro',
    kycstatuscertifieddoc: 'other',
    kyckbisdoc: 'other',
    kycannualreportdoc: 'other',
    kycidorpassportdoc: 'other',
};

@Injectable()
export class DocumentsService {
    constructor(
        private requestsService: RequestsService,
        private newRequestService:  NewRequestService,
    ) {
    }

    sendRequest(form, requests, connectedWallet) {
        const promises = [];
        const context = this.newRequestService.context;
        const extracted = this.getValues(form.value);

        requests.forEach((request) => {
            const kycID = request.kycID;

            extracted.forEach((documentControl) => {
                const documentPromise = this.sendRequestDocumentControl(documentControl, connectedWallet).then((data) => {
                    const kycDocumentID = getValue(data, 'kycDocumentID');

                    if (kycDocumentID) {
                        this.sendRequestDocumentPermission(kycID, kycDocumentID);
                    }
                });

                promises.push(documentPromise);
            });
            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestDocumentControl(controlValue, connectedWallet) {
        const messageBody = {
            RequestName: 'updatekycdocument',
            walletID: connectedWallet,
            ...controlValue,
        };

        return this.requestsService.sendRequest(messageBody).then(response => getValue(response, [1, 'Data', 0]));
    }

    sendRequestDocumentPermission(kycID, kycDocumentID) {
        const messageBody = {
            RequestName: 'updatekycdocumentpermissions',
            kycID,
            kycDocumentID,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: 'documents',
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getValues(formValue) {
        let merged = merge(
            getValue(formValue, 'common'),
            getValue(formValue, 'other', {}),
            getValue(formValue, 'pro', {}),
        );

        merged = filter(merged, 'hash');
        return values(merged);
    }

    getCurrentFormDocumentsData(kycID, connectedWallet) {
        const globalDocumentsData = this.requestsService.getKycDocuments(0, connectedWallet);
        const documentsData = this.requestsService.getKycDocuments(kycID, connectedWallet);

        return Promise.all([globalDocumentsData, documentsData]);
    }

    getDocument(documentID){
        return this.requestsService.getKycDocument(documentID);
    }
}
