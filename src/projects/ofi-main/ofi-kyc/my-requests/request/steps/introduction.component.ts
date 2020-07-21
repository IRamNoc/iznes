import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@angular-redux/store';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { take } from 'rxjs/operators';
import { KycFormHelperService } from '../../kyc-form-helper.service';

/**
 * Kyc introduction screen component
 */
@Component({
    selector: 'kyc-step-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
})
export class NewKycIntroductionComponent {
    @Input() disclaimerSigned: boolean;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    readCheckbox: FormControl = new FormControl();

    constructor(
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        public helper: KycFormHelperService,
    ) {}

    ngOnInit() {
        if (this.disclaimerSigned) {
            this.readCheckbox.patchValue(true);
        }
    }

    handleSubmit() {
        // emit submitEvent, so the parent kyc wrapper can handle the submit event.
        this.submitEvent.emit({
            completed: true,
        });

        // loop through all the active kycs for the current kyc form, and update there completed step.
        this.requests$
        .pipe(take(1))
        .subscribe((requests) => {
            requests.forEach((request) => {
                this.sendRequestUpdateCurrentStep(request.kycID);
            });
        });
    }

    /**
     * Update current step of the kyc in the database.
     * @param {number} kycID
     */
    sendRequestUpdateCurrentStep(kycID) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep: 'introduction',
            currentGroup: this.newRequestService.context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    /* isStepValid
     * - this gets run by the form-steps component to enable/disable the next button
     */
    isStepValid() {
        return this.readCheckbox.value;
    }
}
