import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {immutableHelper} from '@setl/utils';
import {select, NgRedux} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';
import * as moment from 'moment';

import {investorInvitation} from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import {MultilingualService} from '@setl/multilingual';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInviteInvestorsComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;
    investor: any;
    languages = [
        {id: 'fr', text: 'Français'},
        {id: 'en', text: 'English'},
        // {id: 'tch', text: '繁體中文'},
        // {id: 'sch', text: '中文'}
    ];

    enums = {
        status: {
            [-2]: {
                label: 'Rejected',
                type: 'danger',
            },
            [-1]: {
                label: 'Accepted',
                type: 'success',
            },
            [0]: {
                label: 'Draft',
                type: 'info',
            },
            [1]: {
                label: 'Waiting For Approval',
                type: 'warning',
            },
            [2]: {
                label: 'Awaiting Informations',
                type: 'warning',
            },
        }
    }

    inviteItems: investorInvitation[];

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'investorInvitations', 'data']) investorInvitations$;

    /* Constructor. */
    constructor(private _fb: FormBuilder,
                private _changeDetectorRef: ChangeDetectorRef,
                private _location: Location,
                private alertsService: AlertsService,
                private _ofiKycService: OfiKycService,
                private _toasterService: ToasterService,
                public _translate: MultilingualService,
                private redux: NgRedux<any>) {

        this.invitationForm = this._fb.group({
            investors: this._fb.array([
                this._fb.group({
                    email: [
                        '',
                        Validators.compose([
                            Validators.required,
                            Validators.pattern(emailRegex),
                        ])
                    ],
                    language: [
                        '',
                        Validators.compose([
                            Validators.required
                        ])
                    ],
                    clientReference: [
                        '',
                    ],
                    firstName: [
                        '',
                    ],
                    lastName: [
                        '',
                    ]
                })
            ])
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
        this._ofiKycService.getInvitationsByUserAmCompany();

        this.investorInvitations$
            .takeUntil(this.unSubscribe)
            .subscribe((d: investorInvitation[]) => {
                this.inviteItems = d;
                if (this.inviteItems.length) {
                    this.inviteItems = this.inviteItems.map((invite) => {
                        const tokenUsedAt = invite.tokenUsedAt ? `Account created - ${moment(invite.tokenUsedAt).local().format('YYYY-MM-DD HH:mm:ss')}` : `Account not created`;
                        const kycStarted = invite.kycStarted ? moment(invite.kycStarted).local().format('YYYY-MM-DD HH:mm:ss') : '';
                        return {
                            ...invite,
                            inviteSent: moment(invite.inviteSent).local().format('YYYY-MM-DD HH:mm:ss'),
                            tokenUsedAt,
                            kycStarted,
                        };
                    })
                }
                this.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();
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
            return {'notUnique': true};
        }
        return;
    }

    addInvestor(formObj) {
        const control = <FormArray>formObj.controls['investors'];
        const addrCtrl = this._fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(emailRegex),
                    this.duplicateValidator.bind(this),
                ])
            ],
            language: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            clientReference: [
                '',
            ],
            firstName: [
                '',
            ],
            lastName: [
                '',
            ]
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

        this._ofiKycService.sendInvestInvitations(requestData).then((response) => {

            const emailAddressList = response[1].Data[0].existingEmailAddresses;
            const validEmailList = [];
            const invalidEmailList = [];

            formValues.investors.map(investor => {
                if (emailAddressList.indexOf(investor.email) === -1) {
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
        let message = '<p><b>An invitation email to IZNES was sent to:</b></p><table class="table grid"><tbody>';

        for (const email of emails) {
            message += '<tr><td>' + email + '</td></tr>';
        }
        message += '</tbody></table>';

        this.alertsService.create('success', message);
    }

    displayExistingEmailAddressToaster(invalidEmailAddressList: Array<string>) {
        invalidEmailAddressList.map((emailAddress) => {
            this._toasterService.pop(
                'warning',
                `A user has already created an account with this following email address "${emailAddress}".`
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
        this._location.back();
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}

/**
 * construct invitation request with form value.
 */
function constructInvitationRequest(formValue) {
    const investors = immutableHelper.reduce(formValue.investors, (result, item) => {
        result.push({
            email: item.get('email', ''),
            firstname: item.get('firstName', ''),
            lastname: item.get('lastName', ''),
            lang: item.get('language', 'fr'),
            clientreference: item.get('clientReference', '')
        });
        return result;
    }, []);

    return {
        assetManagerName: 'OFI',
        amCompanyName: 'OFI Am Management',
        investors
    };
}
