import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    SecurityContext,
    ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MessageKycConfig, MessagesService } from '@setl/core-messages';
import { mDateHelper, SagaHelper, ConfirmationService, LogService } from '@setl/utils';
import { InvestorModel } from './model';
import { ToasterService } from 'angular2-toaster';
import { InitialisationService, MyWalletsService } from '@setl/core-req-services';
import { CLEAR_REQUESTED } from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import { MultilingualService } from '@setl/multilingual';
import { investorStatusList } from '@ofi/ofi-main/ofi-kyc/my-requests/requests.config';
import { isEmpty } from 'lodash';
import { filter as rxFilter, take } from 'rxjs/operators';

enum Statuses {
    waitingApproval = 1,
    askMoreInfo = 2,
    approved = -1,
    rejected = -2,
}

@Component({
    selector: 'app-waiting-approval',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    completeKycModal;
    alreadyCompleted;
    investorID;
    isProOpen = true;
    message;

    approveKycModal;
    investorStatusList;
    optOptions = {
        choice : null,
        hasOptedFor : false,
        investorStatus : null,
    };

    /* Public statuses */
    APPROVED_STATUS = Statuses.approved;
    REJECTED_STATUS = Statuses.rejected;
    ASK_FOR_MORE_INFO_STATUS = Statuses.askMoreInfo;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObs;
    @select(['user', 'myDetail']) userDetailObs;
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsClassification']) kycClassification$;

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
                private router: Router,
                private walletsService: MyWalletsService,
                private logService: LogService,
                public translate: MultilingualService,
                private messagesService: MessagesService,
                private domSanitizer: DomSanitizer,
    ) {

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

        this.investorStatusList = investorStatusList;
    }

    ngOnInit(): void {
        this.subscriptions.push(this.requestLanguageObs.subscribe((language) => this.getLanguage(language)));
        this.subscriptions.push(this.userDetailObs.subscribe((userDetail) => this.getUserDetail(userDetail)));
        this.subscriptions.push(this.requestedAmKycListObs.subscribe((requested) => this.setAmKycListRequested(requested)));
        this.subscriptions.push(this.amKycListObs.subscribe((amKycList) => this.getAmKycList(amKycList)));

        this.getClassification();
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
            isKycAccepted: [false, Validators.required],
        });
    }

    initStatuses(): void {
        if (this.alreadyCompleted) {
            this.statuses = [
                {
                    id: 'reject',
                    label: this.translate.translate('Reject'),
                    value: Statuses.rejected,
                },
                {
                    id: 'accept',
                    label: this.translate.translate('Accept'),
                    value: Statuses.approved,
                },
            ];
        } else if (this.initialStatusId === -2) {
            this.statuses = [
                {
                    id: 'askForMoreInfo',
                    label: this.translate.translate('Ask For More Info'),
                    value: Statuses.askMoreInfo,
                },
                {
                    id: 'accept',
                    label: this.translate.translate('Accept'),
                    value: Statuses.approved,
                },
            ];
        } else {
            this.statuses = [
                {
                    id: 'reject',
                    label: this.translate.translate('Reject'),
                    value: Statuses.rejected,
                },
                {
                    id: 'askForMoreInfo',
                    label: this.translate.translate('Ask For More Info'),
                    value: Statuses.askMoreInfo,
                },
                {
                    id: 'accept',
                    label: this.translate.translate('Accept'),
                    value: Statuses.approved,
                },
            ];
        }
    }

    getLanguage(language: string): void {
        this.language = language;
    }

    getUserDetail(userDetail) {
        this.userDetail = userDetail;
    }

    getClassification() {
        this.kycClassification$
        .pipe(
            rxFilter(val => !isEmpty(val)),
            take(1))
        .subscribe((classification) => {
            this.optOptions.hasOptedFor = classification.optFor;
            this.optOptions.investorStatus = classification.investorStatus;
        });
    }

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this.kycService, this.redux);
        }
    }

    getAmKycList(amKycList: any) {
        if (amKycList.length > 0 && amKycList.findIndex(kyc => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter(v => v.kycID === this.kycId)[0];

            const phoneNumber = (kyc.investorPhoneCode && kyc.investorPhoneNumber)
                ? `${kyc.investorPhoneCode} ${kyc.investorPhoneNumber}` : '';

            const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(kyc.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
            const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');

            this.investor = {
                companyName: { label: 'Company name:', value: kyc.investorCompanyName },
                clientReference: { label: 'Client reference:', value: kyc.clientReference },
                firstName: { label: 'First name:', value: kyc.investorFirstName },
                lastName: { label: 'Last name:', value: kyc.investorLastName },
                email: { label: 'Email address:', value: kyc.investorEmail },
                phoneNumber: { label: 'Phone number:', value: phoneNumber },
                approvalDateRequest: { label: 'Date of approval request:', value: approvalDateRequest },
            };

            this.initialStatusId = kyc.status;
            this.alreadyCompleted = kyc.alreadyCompleted;
            this.initStatuses();
            this.statusId = (kyc.status === Statuses.waitingApproval) ? Statuses.approved : kyc.status;
            this.amCompanyName = kyc.companyName;
            this.investorID = kyc.investorUserID;

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
            // this.isRejectModalDisplayed = true;
            this.rejectConfirmation();
            break;

        case Statuses.askMoreInfo:
            this.askInfoConfirmation();
            break;

        case Statuses.approved:
            this.checkApprove();
            break;
        }
    }

    rejectConfirmation() {
        let additionalText = this.waitingApprovalFormGroup.controls['additionalText'].value.trim();
        additionalText = this.domSanitizer.sanitize(SecurityContext.HTML, additionalText);

        const translatedAdditionalText = this.translate.translate('@additionalText@', { 'additionalText': additionalText });

        const message = `${this.translate.translate('Are you sure you want to reject this client\'s application?')}<br>
        ${this.translate.translate('Here is the message that will be sent to the investor')}:<br /><textarea style="margin-top:15px;" disabled>${translatedAdditionalText}</textarea><br /> ${this.translate.translate('You can also ask for more information to this client in the previous page')}.`;

        const safeMessage = this.domSanitizer.bypassSecurityTrustHtml(message);

        this.confirmationService.create(
            this.translate.translate('Confirm Rejection'),
            (safeMessage as string),
            {
                confirmText: this.translate.translate('Reject the client\'s application'),
                declineText: this.translate.translate('Back to the approval page'),
                btnClass: 'error',
            }).subscribe((ans) => {
                if (ans.resolved) {
                    this.handleRejectButtonClick();
                }
            },
        );
    }

    askInfoConfirmation() {
        let additionalText = this.waitingApprovalFormGroup.controls['additionalText'].value.trim();
        additionalText = this.domSanitizer.sanitize(SecurityContext.HTML, additionalText);

        const translatedAdditionalText = this.translate.translate('@additionalText@', { 'additionalText': additionalText });

        const message = `${this.translate.translate('Are you sure you want to ask for more information?')}<br>${this.translate.translate('Here is the message that will be sent to the investor')}:<br /><textarea style="margin-top:15px;" disabled>${translatedAdditionalText}</textarea>`;
        
        const safeMessage = this.domSanitizer.bypassSecurityTrustHtml(message);
        this.confirmationService.create(
            this.translate.translate('Ask for more information'),
            (safeMessage as string),
            {
                confirmText: this.translate.translate('Ask for more information'),
                declineText: this.translate.translate('Back to the approval page'),
                btnClass: 'error',
            }).subscribe((ans) => {
                if (ans.resolved) {
                    this.onAskMoreInfoKyc();
                }
            },
        );
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
            lang: this.language,
        };
        this.redux.dispatch({
            type: CLEAR_REQUESTED,
        });
        this.kycService.askMoreInfo(payload).then(() => {
            this.toast.pop(
                'success',
                this.translate.translate(
                    'An email has been sent to @companyName@ in order to ask for more information.',
                    { 'companyName': this.investor.companyName.value },
                ),
            );
            this.setAmKycListRequested(true);
            this.router.navigateByUrl('/on-boarding/management');
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert(this.translate.translate('The KYC request has already been updated. The request requires the investor\'s attention now'));
            }
        });
    }

    checkApprove() {
        if (this.optOptions.hasOptedFor) {
            this.approveKycModal = true;
        } else {
            this.onApproveKyc();
        }
    }

    onApproveKyc() {
        const payload = {
            kycID: this.kycId,
            investorEmail: this.investor.email.value,
            investorFirstName: this.investor.firstName.value,
            investorCompanyName: this.investor.companyName.value,
            amCompanyName: this.amCompanyName,
            lang: this.language,
            invitedID: this.invitedID,
        };

        if (this.optOptions.hasOptedFor) {
            payload['changeAccepted'] = this.optOptions.choice;
            payload['currentClassification'] = this.optOptions.investorStatus;
        }

        this.redux.dispatch({
            type: CLEAR_REQUESTED,
        });
        this.kycService.approve(payload).then((result) => {
            this.waitingApprovalFormGroup.controls['isKycAccepted'].patchValue(false);
            this.toast.pop('success', this.translate.translate('The KYC request has been successfully approved.'));

            InitialisationService.requestWalletDirectory(this.redux, this.walletsService);

            return this.updateWallets(result[1].Data[0].investorWalletID);
        }).then((walletId) => {
            /* Send action message to investor */
            // this.sendActionMessageToInvestor(walletId);
            this.setAmKycListRequested(false);
            this.approveKycModal = false;

            setTimeout(
                () => {
                    /* Redirect to fund access page when the kyc is being approved */
                    this.router.navigate(['client-referential', this.kycId]);
                },
                1000,
            );
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert(this.translate.translate('The KYC request has already been updated. The request requires the investor\'s attention now'));
            }
        });
    }

    openCompleteKycModal() {
        this.completeKycModal = true;
    }

    saveCompleteKycModal(message) {
        this.kycService.notifyKycCompletion(this.investorID, message, this.kycId).then(() => {
            const message = this.translate.translate('The investor has been notified.');
            this.toast.pop('success', message);
            this.completeKycModal = false;
            this.cdr.markForCheck();
            this.redux.dispatch({
                type: CLEAR_REQUESTED,
            });
            this.router.navigateByUrl('/on-boarding/management');
        });
    }

    updateWallets(walletId) {
        return new Promise((resolve, reject) => {
            const asyncTaskPipes = this.walletsService.requestWalletDirectory();
            this.redux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipes,
                {},
                () => {
                    resolve(walletId);
                },
            ));
        });
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
            actionConfig,
        ).then((result) => {
            this.logService.log('on message success: ', result);
        }).catch((error) => {
            this.logService.log('on message fail: ', error);
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
            lang: this.language,
        };

        this.redux.dispatch({
            type: CLEAR_REQUESTED,
        });

        this.kycService.reject(payload).then(() => {
            this.toast.pop('success', this.translate.translate('The KYC request has been successfully rejected.'));
            this.setAmKycListRequested(true);
            this.router.navigateByUrl('/on-boarding/management');
        }).catch((error) => {
            const data = error[1].Data[0];

            if (data.Status === 'Fail') {
                this.showErrorAlert(this.translate.translate('The KYC request has already been updated. The request requires the investor\'s attention now'));
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
                        <td class="text-center text-danger">${this.translate.translate(message)}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
