import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';

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
    isRejectModalDisplayed: boolean;
    language: string;
    userDetail: any;
    investor: InvestorModel;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObs;
    @select(['user', 'myDetail']) authUserDetailObs;

    /**
     * Constructor
     *
     * @param {FormBuilder} fb
     * @param {ChangeDetectorRef} cdr
     * @param {Location} location
     */
    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private location: Location) {
        this.isRejectModalDisplayed = false;

        // Fake input value
        this.investor = {
            'companyName': { label: 'Company name:', value: 'OFI' },
            'firstName': { label: 'First name:', value: 'David' },
            'lastName': { label: 'Last name:', value: 'Duong' },
            'email': { label: 'Email address:', value: 'david.duong@setl.io' },
            'phoneNumber': { label: 'Phone number:', value: '0612345678' },
            'approvalDateRequest': { label: 'Date of approval request:', value: '2018-02-21' }
        };

        // Init
        this.initWaitingApprovalForm();
        this.initStatuses();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObs.subscribe((language) => this.getLanguage(language)));
        this.subscriptions.push(this.authUserDetailObs.subscribe((userDetail) => this.getUserDetail(userDetail)));
    }

    ngOnDestroy(): void {
        this.cdr.detach();

        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    initWaitingApprovalForm(): void {
        this.waitingApprovalFormGroup = this.fb.group({
            status: [1, Validators.required],
            additionalText: ['', Validators.required],
            isKycAccepted: [false, Validators.required]
        });
    }

    initStatuses(): void {
        this.statuses = [
            {
                id: 'reject',
                label: 'Reject',
                value: -1
            },
            {
                id: 'askForMoreInfo',
                label: 'Ask for more info',
                value: 0
            },
            {
                id: 'accept',
                label: 'Accept',
                value: 1
            }
        ];
    }

    getLanguage(language: string): void {
        this.language = language;
    }

    getUserDetail(userDetail): void {
        this.userDetail = userDetail;
    }

    handleStatusChange() {
        if (this.waitingApprovalFormGroup.controls['status'].value !== 1) {
            this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
        }
    }

    handleBackButtonClick() {
        this.resetForm();
        this.location.back();
    }

    handleSubmitButtonClick(): void {
        const status = this.waitingApprovalFormGroup.controls['status'].value;

        // Reject status
        if (status === -1) {
            this.isRejectModalDisplayed = true;
        } else {
            const additionalText = this.waitingApprovalFormGroup.controls['additionalText'].value;
            const isKycAccepted = this.waitingApprovalFormGroup.controls['isKycAccepted'].value;
            this.resetForm();
            this.location.back();
        }
    }

    handleModalCloseButtonClick() {
        this.isRejectModalDisplayed = false;
    }

    handleRejectButtonClick() {
        this.isRejectModalDisplayed = false;
    }

    resetForm(): void {
        this.isRejectModalDisplayed = false;
        this.waitingApprovalFormGroup.controls['status'].setValue(1);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }
}
