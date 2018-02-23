import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select} from '@angular-redux/store';
import {InvestorModel} from './model';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'app-waiting-approval',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiWaitingApprovalComponent implements OnInit, OnDestroy {
    subscriptions: Array<any> = [];
    waitingApprovalFormGroup: FormGroup;
    statuses: Array<any>;
    isRejectModalDisplayed: boolean;
    language: string;
    userDetail: any;
    investor: InvestorModel;
    kycId: any;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObs;
    @select(['user', 'myDetail']) authUserDetailObs;

    /**
     * Constructor
     *
     * @param {FormBuilder} _fb
     * @param {ChangeDetectorRef} _cdr
     * @param {Location} _location
     * @param {OfiKycService} _kycService
     */
    constructor(private _fb: FormBuilder,
                private _cdr: ChangeDetectorRef,
                private _location: Location,
                private _kycService: OfiKycService) {

        console.clear();

        // Fake input value
        this.investor = {
            'companyName': { label: 'Company name:', value: 'OFI' },
            'firstName': { label: 'First name:', value: 'David' },
            'lastName': { label: 'Last name:', value: 'Duong' },
            'email': { label: 'Email address:', value: 'david.duong@setl.io' },
            'phoneNumber': { label: 'Phone number:', value: '0612345678' },
            'approvalDateRequest': { label: 'Date of approval request:', value: '2018-02-21' }
        };

        // TODO: set the real value of the kyc id once it's linked to stephen part
        // const lastIndex = this._location.path().lastIndexOf('/') + 1;
        // this.kycId = this._location.path().substr(lastIndex);
        this.kycId = 6;

        //
        this.isRejectModalDisplayed = false;
        this.initWaitingApprovalForm();
        this.initStatuses();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObs.subscribe((language) => this.getLanguage(language)));
        this.subscriptions.push(this.authUserDetailObs.subscribe((userDetail) => this.getUserDetail(userDetail)));
    }

    ngOnDestroy(): void {
        this._cdr.detach();

        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    initWaitingApprovalForm(): void {
        this.waitingApprovalFormGroup = this._fb.group({
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
        this._location.back();
    }

    handleSubmitButtonClick(): void {
        const status = this.waitingApprovalFormGroup.controls['status'].value;

        switch (status) {
            case -1:
                this.isRejectModalDisplayed = true;
                break;
            case 0:
                this._kycService.askMoreInfo(this.kycId)
                    .then((response) => {
                        console.log('on ask for more info success: ', response[0]);
                    }).catch((e) => {
                        console.log('on ask for more info fail: ', e);
                    }
                );

                this.resetForm();
                break;
            case 1:
                this._kycService.approve(this.kycId)
                    .then((response) => {
                        console.log('on approve success: ', response[0]);
                    }).catch((e) => {
                        console.log('on approve fail: ', e);
                    }
                );

                this.resetForm();
                break;
        }
    }

    handleModalCloseButtonClick() {
        this.isRejectModalDisplayed = false;
    }

    handleRejectButtonClick() {
        this.isRejectModalDisplayed = false;

        this._kycService.reject(this.kycId)
            .then((response) => {
                console.log('on reject success: ', response[0]);
            }).catch((e) => {
                console.log('on reject fail: ', e);
            }
        );
    }

    resetForm(): void {
        this.isRejectModalDisplayed = false;
        this.waitingApprovalFormGroup.controls['status'].setValue(1);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }
}
