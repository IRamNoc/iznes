import {Injectable} from '@angular/core';
import {RequestsService} from '../../requests.service';
import {NewRequestService} from '../new-request.service';

import * as moment from 'moment';

@Injectable()
export class SelectAmcService {

    constructor(
        private newRequestService: NewRequestService,
        private requestsService: RequestsService
    ) {
    }

    async createMultipleDrafts(values) {
        let ids = await this.newRequestService.createMultipleDrafts(values);
        let timestamp = moment().format('X');

        ids.forEach(id => {
            let kycID = id.kycID;
            this.sendRequestUpdateCurrentStep(kycID, timestamp);
        });

        return ids;
    }

    sendRequestUpdateCurrentStep(kycID, timestamp) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID: kycID,
            completedStep: 'amcSelection',
            currentGroup: timestamp
        };

        return this.requestsService.sendRequest(messageBody);
    }


}