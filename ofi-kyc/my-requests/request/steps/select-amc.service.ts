import { Injectable } from '@angular/core';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import * as moment from 'moment';

@Injectable()
export class SelectAmcService {
    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService,
    ) {
    }

    async createMultipleDrafts(values, connectedWallet) {
        const ids = await this.newRequestService.createMultipleDrafts(values, connectedWallet);
        const context = this.newRequestService.getContext(ids);
        ids.forEach(id => {
            const kycID = id.kycID;
            this.sendRequestUpdateCurrentStep(kycID, context);
        });

        return ids;
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: 'amcSelection',
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }
}
