import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {InvestorModel} from './model';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {ActivatedRoute} from '@angular/router';

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
    investor: InvestorModel;
    kycId: number;
    amKycList: Array<any>;
    amCompanyName: string;

    // Statuses
    APPROVED_STATUS = -1;
    REJECTED_STATUS = -2;
    ASK_FOR_MORE_INFO_STATUS = 2;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObs;
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;

    /**
     * Constructor
     *
     * @param {FormBuilder} fb
     * @param {ChangeDetectorRef} cdr
     * @param {Location} location
     * @param {OfiKycService} kycService
     * @param {NgRedux<any>} ngRedux
     * @param {ActivatedRoute} route
     */
    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private location: Location,
                private kycService: OfiKycService,
                private ngRedux: NgRedux<any>,
                private route: ActivatedRoute) {

        console.clear();

        // Get the parameter passed to URL
        this.route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

        //
        this.isRejectModalDisplayed = false;
        this.initWaitingApprovalForm();
        this.initStatuses();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObs.subscribe((language) => this.getLanguage(language)));
        this.subscriptions.push(this.requestedAmKycListObs.subscribe((requested) => this.setAmKycListRequested(requested)));
        this.subscriptions.push(this.amKycListObs.subscribe((amKycList) => this.getAmKycList(amKycList)));
    }

    ngOnDestroy(): void {
        this.cdr.detach();

        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    initWaitingApprovalForm(): void {
        this.waitingApprovalFormGroup = this.fb.group({
            status: [this.APPROVED_STATUS, Validators.required],
            additionalText: ['', Validators.required],
            isKycAccepted: [false, Validators.required]
        });
    }

    initStatuses(): void {
        this.statuses = [
            {
                id: 'reject',
                label: 'Reject',
                value: this.REJECTED_STATUS
            },
            {
                id: 'askForMoreInfo',
                label: 'Ask for more info',
                value: this.ASK_FOR_MORE_INFO_STATUS
            },
            {
                id: 'accept',
                label: 'Accept',
                value: this.APPROVED_STATUS
            }
        ];
    }

    getLanguage(language: string): void {
        this.language = language;
    }

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this.kycService, this.ngRedux);
        }
    }

    getAmKycList(amKycList: any) {
        if (amKycList.length > 0 && amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter((kyc) => kyc.kycID === this.kycId);

            this.investor = {
                'companyName': { label: 'Company name:', value: kyc.investorCompanyName },
                'firstName': { label: 'First name:', value: kyc.investorFirstName },
                'lastName': { label: 'Last name:', value: kyc.investorLastName },
                'email': { label: 'Email address:', value: kyc.investorEmail },
                'phoneNumber': { label: 'Phone number:', value: `${kyc.phoneCode} ${kyc.phoneNumber}` },
                'approvalDateRequest': { label: 'Date of approval request:', value: kyc.lastUpdated }
            };

            this.amCompanyName = kyc.amCompanyName;
        }
        // else {
        //     this.location.back();
        // }
    }

    handleStatusChange() {
        if (this.waitingApprovalFormGroup.controls['status'].value !== this.APPROVED_STATUS) {
            this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
        }
    }

    handleBackButtonClick() {
        this.resetForm();
        this.location.back();
    }

    handleSubmitButtonClick(): void {
        const status = this.waitingApprovalFormGroup.controls['status'].value;

        switch (status) {
            case this.REJECTED_STATUS:
                this.isRejectModalDisplayed = true;
                break;
            case this.ASK_FOR_MORE_INFO_STATUS:
                this.kycService.askMoreInfo(this.kycId)
                    .then((response) => {
                        console.log('on ask for more info success: ', response[0]);
                    }).catch((e) => {
                        console.log('on ask for more info fail: ', e);
                    }
                );

                this.resetForm();
                break;
            case this.APPROVED_STATUS:
                this.kycService.approve(this.kycId)
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

        this.kycService.reject(this.kycId)
            .then((response) => {
                console.log('on reject success: ', response[0]);
            }).catch((e) => {
                console.log('on reject fail: ', e);
            }
        );
    }

    resetForm(): void {
        this.isRejectModalDisplayed = false;
        this.waitingApprovalFormGroup.controls['status'].setValue(this.APPROVED_STATUS);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }
}
