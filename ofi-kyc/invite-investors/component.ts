import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import * as _ from 'lodash';
import { investorInvitation } from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiFundDataService } from '../../ofi-data-service/product/fund/ofi-fund-data-service';
import { PermissionsService } from '@setl/utils/services/permissions/permissions.service';

const emailRegex = /^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@AppObservableHandler
@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    providers: [OfiKycObservablesService],
})
export class OfiInviteInvestorsComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;
    investor: any;
    languages = this.translate.translate([
        { id: 'fr', text: 'Français' },
        { id: 'en', text: 'English' },
    ]);

    subscriptions: Array<any> = [];

    investorTypes: any;

    enums = {
        status: {},
    };

    panel: any;
    inviteItems: investorInvitation[];
    fundSelectList: {id: string, text: string}[];
    unSubscribe: Subject<any> = new Subject();

    isNowCpAm = false;

    @select(['user', 'siteSettings', 'language']) requestLanguageOb;

    /* Constructor. */
    constructor(private fb: FormBuilder,
                private changeDetectorRef: ChangeDetectorRef,
                private location: Location,
                private alertsService: AlertsService,
                private ofiKycService: OfiKycService,
                private toasterService: ToasterService,
                private ofiKycObservablesService: OfiKycObservablesService,
                @Inject('kycEnums') kycEnums,
                private ofiFundDataService: OfiFundDataService,
                public permissionsService: PermissionsService,
                public translate: MultilingualService) {

        this.enums.status = kycEnums.status;

        this.invitationForm = this.fb.group({
            investors: this.fb.array([
                this.fb.group({
                    email: [
                        '',
                        Validators.compose([
                            Validators.required,
                            Validators.pattern(emailRegex),
                        ]),
                    ],
                    language: [
                        '',
                        Validators.compose([
                            Validators.required,
                        ]),
                    ],
                    clientReference: [
                        '',
                    ],
                    investorType: [
                        '',
                        Validators.required,
                    ],
                    fundList: [
                        [],
                    ],
                    firstName: [
                        '',
                    ],
                    lastName: [
                        '',
                    ],
                    message: [
                        '',
                    ],
                }),
            ]),
        });

    }

    /**
     * Check whether we have multiple invites
     * Use to render the send invite button
     * @return {boolean}
     */
    get hasMultipleInvites(): boolean {
        const invitesControl: FormArray = <FormArray> this.invitationForm.controls['investors'];
        const numInvites: number = invitesControl.length;
        return (numInvites > 1);
    }

    ngOnInit(): void {
        this.initPanel();
        this.initInvestorTypes();

        (<any>this).appSubscribe(this.ofiKycObservablesService.getInvitationData(), (d: investorInvitation[]) => {
            this.inviteItems = d.filter(inv => inv.investorType < 40).map((invite) => {
                const tokenUsedAt = invite.tokenUsedAt ? moment(invite.tokenUsedAt).local().format('YYYY-MM-DD HH:mm:ss') : null;
                const kycStarted = invite.kycStarted ? moment(invite.kycStarted).local().format('YYYY-MM-DD HH:mm:ss') : '';
                return {
                    ...invite,
                    invitationLink: `${window.location.origin}/#/redirect/${invite.lang}/${invite.invitationToken}`,
                    inviteSent: moment(invite.inviteSent).local().format('YYYY-MM-DD HH:mm:ss'),
                    tokenUsedAt,
                    kycStarted,
                };
            });
            this.markForCheck();
        });

        (<any>this).appSubscribe(this.ofiFundDataService.getFundSelectList(), fundSelectList => this.fundSelectList = fundSelectList);

        this.subscriptions.push(this.requestLanguageOb.subscribe(() => {
            this.initPanel();
            this.initInvestorTypes();
        }));
    }

    initPanel() {
        this.panel = {
            title: this.translate.translate('Invites Recap'),
            open: true,
        };
    }

    async initInvestorTypes() {
        await this.permissionsService.hasPermission('nowCpAM', 'canRead').then(
            (hasPermission) => {
                this.isNowCpAm = hasPermission;
            },
        );
        if (this.isNowCpAm) {
            this.investorTypes = this.translate.translate([
                { id: 70, text: 'NowCP Issuer' },
                { id: 80, text: 'NowCP Investor' },
            ]);
        } else {
            this.investorTypes = this.translate.translate([
                { id: 10, text: 'Institutional Investor' },
                { id: 30, text: 'Retail Investor' },
            ]);
        }
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    duplicateValidator(control: FormControl) {
        if (!this.invitationForm.controls['investors'].value.length || !control.value.length) {
            return;
        }
        const emails = this.invitationForm.controls['investors'].value.map((item) => {
            return item['email'];
        });
        if (emails.indexOf(control.value) !== -1) {
            return { 'notUnique': true };
        }
        return;
    }

    addInvestor(formObj) {
        const control = <FormArray>formObj.controls['investors'];
        const addrCtrl = this.fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(emailRegex),
                    this.duplicateValidator.bind(this),
                ]),
            ],
            language: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            clientReference: [
                '',
            ],
            investorType: [
                '',
                Validators.required,
            ],
            fundList: [[]],
            pmFunds: [
                [],
            ],
            firstName: [
                '',
            ],
            lastName: [
                '',
            ],
            message: [
                '',
            ],
        });
        control.push(addrCtrl);
    }

    removeInvestor(formObj, i: number) {
        const control = <FormArray>formObj.controls['investors'];
        control.removeAt(i);
    }

    /**
     * Send out invitation(s)
     * @param formValues
     */
    save(formValues): void {
        const requestData = constructInvitationRequest(formValues);

        // Handle mandate investors seperately.

        // Standard investor flow.
        this.ofiKycService.sendInvestInvitations(requestData).then((response) => {
            const emailAddressList = response[1].Data[0].existingEmailAddresses;
            const alreadyInitiatedList = response[1].Data[0].alreadyInitiatedEmailAddresses;
            const validEmailList = [];
            const invalidEmailList = [];

            formValues.investors.map((investor) => {
                if ((emailAddressList.indexOf(investor.email) === -1) && alreadyInitiatedList.indexOf(investor.email) === -1) {
                    validEmailList.push(investor.email);
                } else {
                    invalidEmailList.push(investor.email);
                }
            });

            // Email addresses which are not linked to a user account
            if (validEmailList.length > 0) {
                this.displayInvitationSuccessModal(validEmailList);
            }

            // Email addresses which are already linked to a user account
            if (invalidEmailList.length > 0) {
                this.displayExistingEmailAddressToaster(invalidEmailList);
            }

            this.resetForm(formValues);
            this.markForCheck();
        });
    }

    displayInvitationSuccessModal(emails: Array<string>): void {
        let message = '<p><b>';

        message += this.translate.translate('An invitation email to IZNES was sent to:');
        message += '</b></p><table class="table grid" > <tbody>';

        for (const email of emails) {
            message += '<tr><td>' + email + '</td></tr>';
        }
        message += '</tbody></table>';

        this.alertsService.create('success', message);
    }

    displayExistingEmailAddressToaster(invalidEmailAddressList: Array<string>) {
        invalidEmailAddressList.map((emailAddress) => {
            this.toasterService.pop(
                'warning',
                this.translate.translate('A user has already created an account with the following email address: @emailAddress@', { 'emailAddress': emailAddress }),
            );
        });
    }

    resetForm(formObj) {
        if (formObj.investors.length > 1) {
            for (let i = formObj.investors.length; i > 1; i--) {
                this.removeInvestor(this.invitationForm, i - 1);
            }
        }
        this.invitationForm.reset();
    }

    goBack() {
        this.location.back();
    }

    markForCheck() {
        this.changeDetectorRef.markForCheck();
    }

    copyToClipboard(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    isRetailInvestor(investorType: FormControl): boolean {
        const val = investorType.value;
        const userType = _.get(val, '[0].id');
        if (userType === 30) {
            investorType.setErrors({ investorType: true });
            return true;
        }

        return false;
    }

    /**
     * Whether investor is Portfolio manager
     * @param {FormControl} investorType
     * @param {FormControl} fundList
     * @return {boolean}
     */
    isPortfolioManager(investorType: FormControl, fundList: FormControl): boolean {
        const val = investorType.value;
        const userType = _.get(val, '[0].id');
        if (userType === 20) {
            fundList.setValidators([Validators.required]);
            return true;
        }

        fundList.setValidators([]);
        fundList.updateValueAndValidity();

        return false;
    }

    ngOnDestroy() {
        for (const key of this.subscriptions) {
            key.unsubscribe();
        }
    }
}

/**
 * construct invitation request with form value.
 */
function constructInvitationRequest(formValue) {
    const investors = formValue.investors.reduce(
        (result, item) => {
            const investorType = _.get(item, ['investorType', 0], {}).id;
            // check the investor type
            if (investorType !== 10) {
                throw new Error('Only institutional investors are allowed');
            }

            // get the fundList in array of fundId
            const fundList = _.get(item, 'fundList') || [];
            const fundIdList = fundList.reduce(
                (acc, fund) => {
                    acc.push(fund.id);
                    return acc;
                },
                [],
            );

            result.push({
                investorType,
                email: _.get(item, 'email', ''),
                firstname: _.get(item, 'firstName', ''),
                lastname: _.get(item, 'lastName', ''),
                lang: _.get(item, 'language', 'fr'),
                clientreference: _.get(item, 'clientReference', ''),
                message: _.get(item, 'message', ''),
                fundList: fundIdList,
            });
            return result;
        },
        [],
    );

    return {
        assetManagerName: 'OFI',
        amCompanyName: 'OFI Am Management',
        investors,
    };
}
