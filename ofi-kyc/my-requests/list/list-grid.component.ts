import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {groupBy, find} from 'lodash';

import {KycStatus as statusList} from '../requests.service';
import {NewRequestService} from '../request/new-request.service';
import {convertUtcStrToLocalStr} from '@setl/utils/helper/m-date-wrapper/index';

@Component({
    selector: 'my-requests-list',
    templateUrl: './list-grid.component.html'
})
export class MyRequestsGridComponent {

    @Input() kycList;
    @Output() selectedKyc  = new EventEmitter<number>();

    statusList;

    constructor(
        private newRequestService: NewRequestService,
        private router : Router
    ) {
        this.statusList = statusList;
    }

    viewDetails(kycID){
        this.selectedKyc.emit(kycID);
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

    convertDate(date){
        return convertUtcStrToLocalStr(date, 'YYYY-MM-DD HH:mm:SS');
    }

    redirectToRelatedKycs(kycID) {
        let currentKyc = find(this.kycList, ['kycID', kycID]);
        let completedStep = currentKyc.completedStep;
        let extras = {};

        let grouped = groupBy(this.kycList, 'currentGroup');
        let currentGroup = grouped[currentKyc.currentGroup];

        let kycIDs = [];
        currentGroup.forEach(kyc => {
            kycIDs.push({
                kycID: kyc.kycID,
                amcID: kyc.amManagementCompanyID,
                context: kyc.context,
                completedStep,
            });
        });

        if(completedStep){
            extras = {
                queryParams : {
                    step : completedStep,
                    completed : currentGroup.reduce((acc, kyc) => acc && !!kyc.alreadyCompleted, true)
                }
            };
        }

        this.newRequestService.storeCurrentKycs(kycIDs);

        this.router.navigate(['my-requests', 'new'], extras);
    }

}