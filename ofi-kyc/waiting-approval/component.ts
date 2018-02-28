import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {ActivatedRoute} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import {InvestorModel} from './model';

enum Statuses {
    waitingApproval = 1,
    askMoreInfo = 2,
    approved = -1,
    rejected = -2
}

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
    statusId: number;
    amKycList: Array<any>;
    amCompanyName: string;

    /* Public statuses */
    APPROVED_STATUS = Statuses.approved;
    REJECTED_STATUS = Statuses.rejected;
    ASK_FOR_MORE_INFO_STATUS = Statuses.askMoreInfo;

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
     * @param toasterService
     */
    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private location: Location,
                private kycService: OfiKycService,
                private ngRedux: NgRedux<any>,
                private route: ActivatedRoute,
                private toasterService: ToasterService) {

        this.isRejectModalDisplayed = false;
        this.kycId = null;
        this.statusId = null;
        this.amKycList = [];
        this.amCompanyName = '';

        // Get the parameter passed to URL
        this.route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

        //
        this.initStatuses();
        this.initWaitingApprovalForm();
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
        const status = this.statusId || Statuses.approved;

        this.waitingApprovalFormGroup = this.fb.group({
            status: [status, Validators.required],
            additionalText: ['', Validators.required],
            isKycAccepted: [false, Validators.required]
        });
    }

    initStatuses(): void {
        this.statuses = [
            {
                id: 'reject',
                label: 'Reject',
                value: Statuses.rejected
            },
            {
                id: 'askForMoreInfo',
                label: 'Ask for more info',
                value: Statuses.askMoreInfo
            },
            {
                id: 'accept',
                label: 'Accept',
                value: Statuses.approved
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
            const kyc = amKycList.filter((kyc) => kyc.kycID === this.kycId)[0];
            const phoneNumber = (kyc.phoneCode && kyc.phoneNumber) ? `${kyc.phoneCode} ${kyc.phoneNumber}` : '';
            const approvalDateRequest = '';

            this.investor = {
                'companyName': { label: 'Company name:', value: kyc.investorCompanyName },
                'firstName': { label: 'First name:', value: kyc.investorFirstName },
                'lastName': { label: 'Last name:', value: kyc.investorLastName },
                'email': { label: 'Email address:', value: kyc.investorEmail },
                'phoneNumber': { label: 'Phone number:', value: phoneNumber },
                'approvalDateRequest': { label: 'Date of approval request:', value: approvalDateRequest }
            };

            this.statusId = (kyc.status === Statuses.waitingApproval) ? Statuses.approved : kyc.status;
            this.amCompanyName = kyc.companyName;

            this.initWaitingApprovalForm();
            this.cdr.markForCheck();
        }
    }

    handleStatusChange() {
        if (this.waitingApprovalFormGroup.controls['status'].value !== Statuses.approved) {
            this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
        }

        this.waitingApprovalFormGroup.controls['additionalText'].patchValue('');
    }

    handleBackButtonClick() {
        this.resetForm();
        this.location.back();
    }

    handleSubmitButtonDisabled() {
        const status = this.waitingApprovalFormGroup.controls['status'].value;
        const additionalText = this.waitingApprovalFormGroup.controls['additionalText'].value.trim();
        const isChecked = this.waitingApprovalFormGroup.controls['isKycAccepted'].value;

        return status === Statuses.approved && !isChecked
            || status === Statuses.rejected && additionalText.length === 0
            || status === Statuses.askMoreInfo && additionalText.length === 0;
    }

    handleSubmitButtonClick(): void {
        const status = this.waitingApprovalFormGroup.controls['status'].value;

        switch (status) {
            case Statuses.rejected:
                if (this.statusId === Statuses.waitingApproval) {
                    this.isRejectModalDisplayed = true;
                } else {
                    this.toasterService.pop(
                        'error',
                        'The KYC request has already been updated. The request requires the investor\'s intention now.'
                    );
                }
                break;

            case Statuses.askMoreInfo:
                this.kycService.askMoreInfo({ kycID: this.kycId }).then(() => {
                    this.toasterService.pop(
                        'success',
                        'The KYC request has been successfully updated and requires more information from the investor.'
                    );
                }).catch((error) => {
                    const data = error[1].Data[0];

                    if (data.Status === 'Fail' && data.Message === 'Permission Denied') {
                        this.toasterService.pop(
                            'error',
                            'The KYC request has already been updated. The request requires the investor\'s intention now.'
                        );
                    }
                });
                break;

            case Statuses.approved:
                const data = {
                    kycID: this.kycId,
                    investorEmail: this.investor.email.value,
                    investorFirstName: this.investor.firstName.value,
                    investorCompanyName: this.investor.companyName.value,
                    amCompanyName: this.amCompanyName,
                    lang: this.language
                };

                this.kycService.approve(data).then(() => {
                    this.toasterService.pop('success', 'The KYC request has been successfully approved');
                    this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
                }).catch((error) => {
                    const data = error[1].Data[0];

                    if (data.Status === 'Fail' && data.Message === 'Permission Denied') {
                        this.toasterService.pop(
                            'error',
                            'The KYC request has already been updated. The request requires the investor\'s intention now.'
                        );
                    }
                });
                break;
        }
    }

    handleModalCloseButtonClick() {
        this.isRejectModalDisplayed = false;
    }

    handleRejectButtonClick() {
        this.isRejectModalDisplayed = false;

        this.kycService.reject({ kycID: this.kycId }).then(() => {
            this.toasterService.pop('success', 'The KYC request has been successfully rejected');
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail' && data.Message === 'Permission Denied') {
                this.toasterService.pop(
                    'error',
                    'The KYC request has already been updated. The request requires the investor\'s intention now.'
                );
            }
        });
    }

    resetForm(): void {
        this.isRejectModalDisplayed = false;
        this.waitingApprovalFormGroup.controls['status'].setValue(Statuses.approved);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }
}
