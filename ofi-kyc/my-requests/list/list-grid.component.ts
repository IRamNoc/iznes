import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {groupBy, find} from 'lodash';

import {KycStatus as statusList} from '../requests.service';
import {NewRequestService} from '../request/new-request.service';

@Component({
    selector: 'my-requests-list',
    templateUrl: './list-grid.component.html'
})
export class MyRequestsGridComponent {
    @Input('') kycList;

    statusList;

    constructor(
        private newRequestService: NewRequestService,
        private router : Router
    ) {
        this.statusList = statusList;
    }


    buttonToDisplay(status) {
        if ([statusList.Approved, statusList.WaitingForApproval, statusList.Rejected].indexOf(status) !== -1) {
            return "view";
        }

        if (status === statusList.WaitingForMoreInfo) {
            return "waitingInformation";
        }

        return "draft";
    }

    redirectToRelatedKycs(kycID) {
        let currentKyc = find(this.kycList, ['kycID', kycID]);
        let completedStep = currentKyc.completedStep;
        let extras = {};
        if(completedStep){
            extras = {
                queryParams : {
                    step : completedStep
                }
            };
        }

        let grouped = groupBy(this.kycList, 'currentGroup');
        let currentGroup = grouped[currentKyc.currentGroup];

        let kycIDs = [];
        currentGroup.forEach(kyc => {
            kycIDs.push({
                kycID: kyc.kycID,
                amcID: kyc.amManagementCompanyID
            });
        });

        this.newRequestService.storeCurrentKycs(kycIDs);

        this.router.navigate(['my-requests', 'new'], extras);
    }

}