import {Injectable} from '@angular/core';
import {RequestsService} from '../../requests.service';
import * as moment from 'moment';

import {merge, get as getValue, values} from 'lodash';

export const documentFormPaths = {
    kyclistshareholdersdoc: 'common',
    kyclistdirectorsdoc: 'common',
    kycbeneficialownersdoc: 'common',
    kyclistauthoriseddoc: 'common',
    kyctaxcertificationdoc: 'common',
    kycw8benefatcadoc: 'common',
    kycproofofapprovaldoc: 'listedCompany',
    kycisincodedoc: 'listedCompany',
    kycwolfsbergdoc: 'listedCompany',
    kycstatuscertifieddoc: 'other',
    kyckbisdoc: 'other',
    kycannualreportdoc: 'other',
    kycidorpassportdoc: 'other',
};

@Injectable()
export class DocumentsService {

    constructor(
        private requestsService: RequestsService
    ) {
    }

    sendRequest(form, requests, connectedWallet) {
        let promises = [];
        let timestamp = moment().format('X');

        let extracted = this.getValues(form.value);

        requests.forEach(request => {
            let kycID = request.kycID;

            extracted.forEach(documentControl => {
                let documentPromise = this.sendRequestDocumentControl(documentControl, connectedWallet, kycID).then(data => {
                    let kycDocumentID = getValue(data, 'kycDocumentID');

                    if(kycDocumentID){
                        this.sendRequestDocumentPermission(kycID, kycDocumentID);
                    }
                });

                promises.push(documentPromise);
            });

            let updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, timestamp);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestDocumentControl(controlValue, connectedWallet, kycID) {
        const messageBody = {
            RequestName: 'updatekycdocument',
            walletID: connectedWallet,
            ...controlValue
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestDocumentPermission(kycID, kycDocumentID) {
        const messageBody = {
            RequestName: 'updatekycdocumentpermissions',
            kycID: kycID,
            kycDocumentID: kycDocumentID
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, timestamp){
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID : kycID,
            completedStep : 'documents',
            currentGroup : timestamp
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getValues(formValue) {
        let merged = merge(
            getValue(formValue, 'common'),
            getValue(formValue, 'other', {}),
            getValue(formValue, 'listedCompany', {})
        );

        return values(merged);
    }

    getCurrentFormDocumentsData(kycID, connectedWallet) {
        return this.requestsService.getKycDocuments(kycID, connectedWallet);
    }

}