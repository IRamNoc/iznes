import { Injectable } from '@angular/core';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { get as getValue } from 'lodash';

@Injectable()
export class SelectAmcService {
    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
    ) {
    }

    createMultipleDrafts(values, connectedWallet) {
        return this.newRequestService.createMultipleDrafts(values, connectedWallet).then((ids) => {
            return this.postDraftCreation(ids);
        }).catch((err) => {
            console.log(err);
        });
    }

    postDraftCreation(ids) {
        const promises = [];
        const context = this.newRequestService.getContext(ids);
        ids.forEach((id) => {
            const kycID = id.kycID;
            const promise = this.sendRequestUpdateCurrentStep(kycID, context);

            promises.push(promise);
        });

        return Promise.all(promises).then(() => ids);
    }

    sendRequestUpdateCurrentStep(kycID, context, override = 'amcSelection') {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: override,
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    duplicate(selectedCompanies, kycToDuplicate, connectedWallet) {
        return this.newRequestService.duplicate(selectedCompanies, kycToDuplicate, connectedWallet).then((response) => {
            const ids = getValue(response, [1, 'Data']);
            return this.postDraftCreation(ids);
        });
    }
}
