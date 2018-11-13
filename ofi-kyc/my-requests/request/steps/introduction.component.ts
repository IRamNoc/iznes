import { Component, Output, EventEmitter } from '@angular/core';
import { select } from '@angular-redux/store';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'kyc-step-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
})
export class NewKycIntroductionComponent {

    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
    ) {
    }

    handleSubmit() {
        this.submitEvent.emit({
            completed: true,
        });

        this.requests$
        .pipe(take(1))
        .subscribe((requests) => {
            requests.forEach((request) => {
                this.sendRequestUpdateCurrentStep(request.kycID);
            });
        });
    }

    sendRequestUpdateCurrentStep(kycID) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: 'introduction',
            currentGroup: this.newRequestService.context,
        };

        return this.requestsService.sendRequest(messageBody);
    }
}
