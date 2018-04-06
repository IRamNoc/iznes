import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import {ActivatedRoute, Router} from '@angular/router';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {MessageKycConfig, MessagesService} from '@setl/core-messages';
import {mDateHelper, SagaHelper} from '@setl/utils';
import {InvestorModel} from './model';
import {ToasterService} from 'angular2-toaster';
import {InitialisationService, MyWalletsService} from "@setl/core-req-services";
import {CLEAR_REQUESTED} from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import {ConfirmationService} from '@setl/utils';

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
    statuses: Array<object>;
    isRejectModalDisplayed: boolean;
    language: string;
    userDetail: any;
    investor: InvestorModel;
    kycId: number;
    initialStatusId: number;
    statusId: number;
    amKycList: Array<any>;
    amCompanyName: string;
    invitedID: number;

    /* Public statuses */
    APPROVED_STATUS = Statuses.approved;
    REJECTED_STATUS = Statuses.rejected;
    ASK_FOR_MORE_INFO_STATUS = Statuses.askMoreInfo;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObs;
    @select(['user', 'myDetail']) userDetailObs;
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;

    /**
     * Constructor
     *
     * @param {FormBuilder} fb
     * @param {ChangeDetectorRef} cdr
     * @param {Location} location
     * @param {OfiKycService} kycService
     * @param {NgRedux<any>} redux
     * @param {ActivatedRoute} route
     * @param alertsService
     * @param messagesService
     */
    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private location: Location,
                private kycService: OfiKycService,
                private redux: NgRedux<any>,
                private route: ActivatedRoute,
                private alertsService: AlertsService,
                private confirmationService: ConfirmationService,
                private toast: ToasterService,
                private _router: Router,
                private walletsService: MyWalletsService,
                private messagesService: MessagesService) {

        this.isRejectModalDisplayed = false;
        this.kycId = null;
        this.initialStatusId = null;
        this.statusId = null;
        this.amKycList = [];
        this.amCompanyName = '';
        this.userDetail = {};

        // Get the parameter passed to URL
        this.route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

        this.initStatuses();
        this.initWaitingApprovalForm();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObs.subscribe((language) => this.getLanguage(language)));
        this.subscriptions.push(this.userDetailObs.subscribe((userDetail) => this.getUserDetail(userDetail)));
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
        if (this.initialStatusId == -2){
            this.statuses = [
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
        }else{
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
    }

    getLanguage(language: string): void {
        this.language = language;
    }

    getUserDetail(userDetail) {
        this.userDetail = userDetail;
    }

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this.kycService, this.redux);
        }
    }

    getAmKycList(amKycList: any) {
        if (amKycList.length > 0 && amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter(v => v.kycID === this.kycId)[0];

            const phoneNumber = (kyc.investorPhoneCode && kyc.investorPhoneNumber)
                ? `${kyc.investorPhoneCode} ${kyc.investorPhoneNumber}` : '';

            const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(kyc.lastUpdated, 'YYYY-MM-DD hh:mm:ss');
            const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');

            this.investor = {
                'companyName': { label: 'Company name:', value: kyc.investorCompanyName },
                'clientReference': { label: 'Client reference:', value: kyc.clientReference },
                'firstName': { label: 'First name:', value: kyc.investorFirstName },
                'lastName': { label: 'Last name:', value: kyc.investorLastName },
                'email': { label: 'Email address:', value: kyc.investorEmail },
                'phoneNumber': { label: 'Phone number:', value: phoneNumber },
                'approvalDateRequest': { label: 'Date of approval request:', value: approvalDateRequest }
            };

            this.initialStatusId = kyc.status;
            this.initStatuses();
            this.statusId = (kyc.status === Statuses.waitingApproval) ? Statuses.approved : kyc.status;
            this.amCompanyName = kyc.companyName;

            this.initWaitingApprovalForm();
            this.cdr.markForCheck();

            this.invitedID = kyc.invitedID;
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
                //this.isRejectModalDisplayed = true;

                this.confirmationService.create(
                    'Confirm Rejection?',
                    'Are you sure you want to reject this client\'s application?<br>You can also ask more information to this client in the previous page',
                    {confirmText: 'Reject the cient\'s application', declineText: 'Back to the approval page', btnClass: 'error'}).subscribe((ans) => {
                    if (ans.resolved){
                        this.handleRejectButtonClick();
                    }else{
                        this.handleModalCloseButtonClick();
                    }
                });
                break;

            case Statuses.askMoreInfo:
                this.onAskMoreInfoKyc();
                break;

            case Statuses.approved:
                this.onApproveKyc();
                break;
        }
    }

    onAskMoreInfoKyc() {
        const phoneNumber = (this.userDetail.phoneCode && this.userDetail.phoneNumber)
            ? `${this.userDetail.phoneCode} ${this.userDetail.phoneNumber}` : '';

        const payload = {
            kycID: this.kycId,
            investorEmail: this.investor.email.value,
            investorFirstName: this.investor.firstName.value,
            investorCompanyName: this.investor.companyName.value,
            amCompanyName: this.amCompanyName,
            amEmail: this.userDetail.emailAddress,
            amPhoneNumber: phoneNumber,
            amInfoText: this.waitingApprovalFormGroup.controls['additionalText'].value,
            lang: this.language
        };
        this.redux.dispatch({
            type: CLEAR_REQUESTED
        });
        this.kycService.askMoreInfo(payload).then(() => {
            this.toast.pop('success', 'An email has been sent to ' + this.investor.companyName.value + ' in order to ask for more information.');
            this.setAmKycListRequested(true);
            this._router.navigateByUrl('/kyc-am-documents');
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert('The KYC request has already been updated. The request requires the investor\'s attention now');
            }
        });
    }

    onApproveKyc() {
        const payload = {
            kycID: this.kycId,
            investorEmail: this.investor.email.value,
            investorFirstName: this.investor.firstName.value,
            investorCompanyName: this.investor.companyName.value,
            amCompanyName: this.amCompanyName,
            lang: this.language,
            invitedID: this.invitedID
        };

        this.redux.dispatch({
            type: CLEAR_REQUESTED
        });
        this.kycService.approve(payload).then((result) => {
            this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
            this.toast.pop('success', 'The KYC request has been successfully approved.');

            InitialisationService.requestWalletDirectory(this.redux, this.walletsService);

            return this.updateWallets(result[1].Data[0].investorWalletID);
        }).then((walletId) => {
            /* Send action message to investor */
            // this.sendActionMessageToInvestor(walletId);
            this.setAmKycListRequested(true);

            /* Redirect to fund access page when the kyc is being approved */
            this._router.navigate(['fund-access', this.kycId]);
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert('The KYC request has already been updated. The request requires the investor\'s attention now');
            }
        });
    }

    updateWallets(walletId){
        return new Promise((resolve, reject)=>{
            const asyncTaskPipes = this.walletsService.requestWalletDirectory();
            this.redux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipes,
                {},
                ()=>{resolve(walletId);}
            ));
        })
    }

    sendActionMessageToInvestor(investorWalletId: number) {
        const subject = (this.language === 'fr-Latn')
            ? `Documents KYC: ${this.amCompanyName} a approuvé vos documents KYC`
            : `KYC Documents: ${this.amCompanyName} approved your KYC documents`;

        const actionConfig = new MessageKycConfig();
        actionConfig.investorFirstName = this.investor.firstName.value;
        actionConfig.investorCompanyName = this.investor.companyName.value;
        actionConfig.amCompanyName = this.amCompanyName;

        this.messagesService.sendMessage(
            [investorWalletId],
            subject,
            '',
            actionConfig
        ).then((result) => {
            console.log('on message success: ', result);
        }).catch((error) => {
            console.log('on message fail: ', error);
        });
    }

    handleModalCloseButtonClick() {
        this.isRejectModalDisplayed = false;
    }

    handleRejectButtonClick() {
        this.isRejectModalDisplayed = false;

        const phoneNumber = (this.userDetail.phoneCode && this.userDetail.phoneNumber)
            ? `${this.userDetail.phoneCode} ${this.userDetail.phoneNumber}` : '';

        const payload = {
            kycID: this.kycId,
            investorEmail: this.investor.email.value,
            investorFirstName: this.investor.firstName.value,
            investorCompanyName: this.investor.companyName.value,
            amCompanyName: this.amCompanyName,
            amEmail: this.userDetail.emailAddress,
            amPhoneNumber: phoneNumber,
            amInfoText: this.waitingApprovalFormGroup.controls['additionalText'].value,
            lang: this.language
        };

        this.redux.dispatch({
            type: CLEAR_REQUESTED
        });

        this.kycService.reject(payload).then(() => {
            this.toast.pop('success', 'The KYC request has been successfully rejected.');
            this.setAmKycListRequested(true);
            this._router.navigateByUrl('/kyc-am-documents');
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert('The KYC request has already been updated. The request requires the investor\'s attention now');
            }
        });
    }

    resetForm(): void {
        this.isRejectModalDisplayed = false;
        this.waitingApprovalFormGroup.controls['status'].setValue(Statuses.approved);
        this.waitingApprovalFormGroup.controls['additionalText'].setValue('');
        this.waitingApprovalFormGroup.controls['isKycAccepted'].setValue(false);
    }

    showErrorAlert(message: string) {
        this.alertsService.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
