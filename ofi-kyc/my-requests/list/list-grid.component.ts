import {Component, Input} from '@angular/core';
import {KycStatus as statusList} from '../requests.service';

@Component({
    selector: 'my-requests-list',
    templateUrl: './list-grid.component.html'
})
export class MyRequestsGridComponent {
    @Input('') kycList;

    statusList;

    constructor() {
        this.statusList = statusList;
    }


    buttonToDisplay(status) {
        if ([statusList.Approved, statusList.WaitingForApproval, statusList.Rejected].indexOf(status) !== -1) {
            return "view";
        }

        return "complete";
    }

}