import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select} from '@angular-redux/store';
import {InvestorModel} from './model';

@Component({
    selector: 'app-waiting-approval',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiWaitingApprovalComponent implements OnInit, OnDestroy {
    subscriptions: Array<any> = [];
    waitingApprovalFormGroup: FormGroup;
    statuses: Object[];
    amCompanyName: string;
    language: string;

    @Input() icon: string;
    @Input() investor: InvestorModel;
    @Output() onSubmit = new EventEmitter<void>();

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    /**
     * Constructor
     *
     * @param {FormBuilder} fb
     * @param {ChangeDetectorRef} cdr
     */
    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        console.clear();

        this.language = 'fr-Latn';

        // Fake input value
        this.investor = {
            companyName: 'OFI',
            firstName: 'David',
            lastName: 'Duong',
            email: 'david.duong@setl.io',
            phoneNumber: '0612345678',
            approvalDateRequest: '2018-02-21'
        };

        this.icon = 'fa-check-circle';
        this.amCompanyName = 'MOIIII';

        //
        this.initWaitingApprovalForm();
        this.initStatuses();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObj.subscribe((language) => this.getLanguage(language)));
    }

    ngOnDestroy(): void {
        this.cdr.detach();

        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    initWaitingApprovalForm(): void {
        this.waitingApprovalFormGroup = this.fb.group({
            status: [-1, Validators.required],
            additionalText: ['', Validators.required],
            isKycAccepted: [false, Validators.required]
        });
    }

    initStatuses(): void {
        this.statuses = [
            {
                id: 'reject',
                label: 'Reject',
                value: 0
            },
            {
                id: 'askForMoreInfo',
                label: 'Ask for more info',
                value: 1
            },
            {
                id: 'accept',
                label: 'Accept',
                value: -1
            }
        ];
    }

    getLanguage(language: string): void {
        this.language = language;

        console.log('get language: ', this.language);
    }

    /**
     * Submit the form
     */
    handleSubmitClick(): void {
        console.log('on submit');
        console.log('status: ', this.waitingApprovalFormGroup.controls['status'].value);
        console.log('additionalText: ', this.waitingApprovalFormGroup.controls['additionalText'].value);
        console.log('isKycAccepted: ', this.waitingApprovalFormGroup.controls['isKycAccepted'].value);

        this.resetForm();
        // this.onSubmit.emit();
    }

    resetForm(): void {
        // this.initStatuses();

        this.waitingApprovalFormGroup.controls['status'].setValue(-1);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }
}
