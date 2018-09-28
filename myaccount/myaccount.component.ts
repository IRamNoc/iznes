/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { immutableHelper, APP_CONFIG, AppConfig } from '@setl/utils';
import { passwordValidator } from '@setl/utils/helper/validators/password.directive';

// Internal
import { Subscription } from 'rxjs/Subscription';

import { MyUserService } from '@setl/core-req-services';

import {
    getConnectedWallet,
    getMyDetail,
    SET_NEW_PASSWORD,
} from '@setl/core-store';
import { MemberSocketService } from '@setl/websocket-service';

interface TabState {
    detail: boolean;
    password: boolean;
    tfa: boolean;
    api: boolean;
}

@Component({
    styleUrls: ['./myaccount.component.scss'],
    templateUrl: './myaccount.component.html',
})

export class SetlMyAccountComponent implements OnDestroy, OnInit {
    language = 'en';

    countries = [
        { id: 'AF', text: 'Afghanistan' },
        { id: 'AX', text: 'Aland Islands' },
        { id: 'AL', text: 'Albania' },
        { id: 'DZ', text: 'Algeria' },
        { id: 'AS', text: 'American Samoa' },
        { id: 'AD', text: 'Andorra' },
        { id: 'AO', text: 'Angola' },
        { id: 'AI', text: 'Anguilla' },
        { id: 'AQ', text: 'Antarctica' },
        { id: 'AG', text: 'Antigua And Barbuda' },
        { id: 'AR', text: 'Argentina' },
        { id: 'AM', text: 'Armenia' },
        { id: 'AW', text: 'Aruba' },
        { id: 'AU', text: 'Australia' },
        { id: 'AT', text: 'Austria' },
        { id: 'AZ', text: 'Azerbaijan' },
        { id: 'BS', text: 'Bahamas' },
        { id: 'BH', text: 'Bahrain' },
        { id: 'BD', text: 'Bangladesh' },
        { id: 'BB', text: 'Barbados' },
        { id: 'BY', text: 'Belarus' },
        { id: 'BE', text: 'Belgium' },
        { id: 'BZ', text: 'Belize' },
        { id: 'BJ', text: 'Benin' },
        { id: 'BM', text: 'Bermuda' },
        { id: 'BT', text: 'Bhutan' },
        { id: 'BO', text: 'Bolivia' },
        { id: 'BA', text: 'Bosnia And Herzegovina' },
        { id: 'BW', text: 'Botswana' },
        { id: 'BV', text: 'Bouvet Island' },
        { id: 'BR', text: 'Brazil' },
        { id: 'IO', text: 'British Indian Ocean Territory' },
        { id: 'BN', text: 'Brunei Darussalam' },
        { id: 'BG', text: 'Bulgaria' },
        { id: 'BF', text: 'Burkina Faso' },
        { id: 'BI', text: 'Burundi' },
        { id: 'KH', text: 'Cambodia' },
        { id: 'CM', text: 'Cameroon' },
        { id: 'CA', text: 'Canada' },
        { id: 'CV', text: 'Cape Verde' },
        { id: 'KY', text: 'Cayman Islands' },
        { id: 'CF', text: 'Central African Republic' },
        { id: 'TD', text: 'Chad' },
        { id: 'CL', text: 'Chile' },
        { id: 'CN', text: 'China' },
        { id: 'CX', text: 'Christmas Island' },
        { id: 'CC', text: 'Cocos (Keeling) Islands' },
        { id: 'CO', text: 'Colombia' },
        { id: 'KM', text: 'Comoros' },
        { id: 'CG', text: 'Congo' },
        { id: 'CD', text: 'Congo, Democratic Republic' },
        { id: 'CK', text: 'Cook Islands' },
        { id: 'CR', text: 'Costa Rica' },
        { id: 'CI', text: 'Cote D\'Ivoire' },
        { id: 'HR', text: 'Croatia' },
        { id: 'CU', text: 'Cuba' },
        { id: 'CY', text: 'Cyprus' },
        { id: 'CZ', text: 'Czech Republic' },
        { id: 'DK', text: 'Denmark' },
        { id: 'DJ', text: 'Djibouti' },
        { id: 'DM', text: 'Dominica' },
        { id: 'DO', text: 'Dominican Republic' },
        { id: 'EC', text: 'Ecuador' },
        { id: 'EG', text: 'Egypt' },
        { id: 'SV', text: 'El Salvador' },
        { id: 'GQ', text: 'Equatorial Guinea' },
        { id: 'ER', text: 'Eritrea' },
        { id: 'EE', text: 'Estonia' },
        { id: 'ET', text: 'Ethiopia' },
        { id: 'FK', text: 'Falkland Islands (Malvinas)' },
        { id: 'FO', text: 'Faroe Islands' },
        { id: 'FJ', text: 'Fiji' },
        { id: 'FI', text: 'Finland' },
        { id: 'FR', text: 'France' },
        { id: 'GF', text: 'French Guiana' },
        { id: 'PF', text: 'French Polynesia' },
        { id: 'TF', text: 'French Southern Territories' },
        { id: 'GA', text: 'Gabon' },
        { id: 'GM', text: 'Gambia' },
        { id: 'GE', text: 'Georgia' },
        { id: 'DE', text: 'Germany' },
        { id: 'GH', text: 'Ghana' },
        { id: 'GI', text: 'Gibraltar' },
        { id: 'GR', text: 'Greece' },
        { id: 'GL', text: 'Greenland' },
        { id: 'GD', text: 'Grenada' },
        { id: 'GP', text: 'Guadeloupe' },
        { id: 'GU', text: 'Guam' },
        { id: 'GT', text: 'Guatemala' },
        { id: 'GG', text: 'Guernsey' },
        { id: 'GN', text: 'Guinea' },
        { id: 'GW', text: 'Guinea-Bissau' },
        { id: 'GY', text: 'Guyana' },
        { id: 'HT', text: 'Haiti' },
        { id: 'HM', text: 'Heard Island & Mcdonald Islands' },
        { id: 'VA', text: 'Holy See (Vatican City State)' },
        { id: 'HN', text: 'Honduras' },
        { id: 'HK', text: 'Hong Kong' },
        { id: 'HU', text: 'Hungary' },
        { id: 'IS', text: 'Iceland' },
        { id: 'IN', text: 'India' },
        { id: 'ID', text: 'Indonesia' },
        { id: 'IR', text: 'Iran, Islamic Republic Of' },
        { id: 'IQ', text: 'Iraq' },
        { id: 'IE', text: 'Ireland' },
        { id: 'IM', text: 'Isle Of Man' },
        { id: 'IL', text: 'Israel' },
        { id: 'IT', text: 'Italy' },
        { id: 'JM', text: 'Jamaica' },
        { id: 'JP', text: 'Japan' },
        { id: 'JE', text: 'Jersey' },
        { id: 'JO', text: 'Jordan' },
        { id: 'KZ', text: 'Kazakhstan' },
        { id: 'KE', text: 'Kenya' },
        { id: 'KI', text: 'Kiribati' },
        { id: 'KR', text: 'Korea' },
        { id: 'KW', text: 'Kuwait' },
        { id: 'KG', text: 'Kyrgyzstan' },
        { id: 'LA', text: 'Lao People\'s Democratic Republic' },
        { id: 'LV', text: 'Latvia' },
        { id: 'LB', text: 'Lebanon' },
        { id: 'LS', text: 'Lesotho' },
        { id: 'LR', text: 'Liberia' },
        { id: 'LY', text: 'Libyan Arab Jamahiriya' },
        { id: 'LI', text: 'Liechtenstein' },
        { id: 'LT', text: 'Lithuania' },
        { id: 'LU', text: 'Luxembourg' },
        { id: 'MO', text: 'Macao' },
        { id: 'MK', text: 'Macedonia' },
        { id: 'MG', text: 'Madagascar' },
        { id: 'MW', text: 'Malawi' },
        { id: 'MY', text: 'Malaysia' },
        { id: 'MV', text: 'Maldives' },
        { id: 'ML', text: 'Mali' },
        { id: 'MT', text: 'Malta' },
        { id: 'MH', text: 'Marshall Islands' },
        { id: 'MQ', text: 'Martinique' },
        { id: 'MR', text: 'Mauritania' },
        { id: 'MU', text: 'Mauritius' },
        { id: 'YT', text: 'Mayotte' },
        { id: 'MX', text: 'Mexico' },
        { id: 'FM', text: 'Micronesia, Federated States Of' },
        { id: 'MD', text: 'Moldova' },
        { id: 'MC', text: 'Monaco' },
        { id: 'MN', text: 'Mongolia' },
        { id: 'ME', text: 'Montenegro' },
        { id: 'MS', text: 'Montserrat' },
        { id: 'MA', text: 'Morocco' },
        { id: 'MZ', text: 'Mozambique' },
        { id: 'MM', text: 'Myanmar' },
        { id: 'NA', text: 'Namibia' },
        { id: 'NR', text: 'Nauru' },
        { id: 'NP', text: 'Nepal' },
        { id: 'NL', text: 'Netherlands' },
        { id: 'AN', text: 'Netherlands Antilles' },
        { id: 'NC', text: 'New Caledonia' },
        { id: 'NZ', text: 'New Zealand' },
        { id: 'NI', text: 'Nicaragua' },
        { id: 'NE', text: 'Niger' },
        { id: 'NG', text: 'Nigeria' },
        { id: 'NU', text: 'Niue' },
        { id: 'NF', text: 'Norfolk Island' },
        { id: 'MP', text: 'Northern Mariana Islands' },
        { id: 'NO', text: 'Norway' },
        { id: 'OM', text: 'Oman' },
        { id: 'PK', text: 'Pakistan' },
        { id: 'PW', text: 'Palau' },
        { id: 'PS', text: 'Palestinian Territory, Occupied' },
        { id: 'PA', text: 'Panama' },
        { id: 'PG', text: 'Papua New Guinea' },
        { id: 'PY', text: 'Paraguay' },
        { id: 'PE', text: 'Peru' },
        { id: 'PH', text: 'Philippines' },
        { id: 'PN', text: 'Pitcairn' },
        { id: 'PL', text: 'Poland' },
        { id: 'PT', text: 'Portugal' },
        { id: 'PR', text: 'Puerto Rico' },
        { id: 'QA', text: 'Qatar' },
        { id: 'RE', text: 'Reunion' },
        { id: 'RO', text: 'Romania' },
        { id: 'RU', text: 'Russian Federation' },
        { id: 'RW', text: 'Rwanda' },
        { id: 'BL', text: 'Saint Barthelemy' },
        { id: 'SH', text: 'Saint Helena' },
        { id: 'KN', text: 'Saint Kitts And Nevis' },
        { id: 'LC', text: 'Saint Lucia' },
        { id: 'MF', text: 'Saint Martin' },
        { id: 'PM', text: 'Saint Pierre And Miquelon' },
        { id: 'VC', text: 'Saint Vincent And Grenadines' },
        { id: 'WS', text: 'Samoa' },
        { id: 'SM', text: 'San Marino' },
        { id: 'ST', text: 'Sao Tome And Principe' },
        { id: 'SA', text: 'Saudi Arabia' },
        { id: 'SN', text: 'Senegal' },
        { id: 'RS', text: 'Serbia' },
        { id: 'SC', text: 'Seychelles' },
        { id: 'SL', text: 'Sierra Leone' },
        { id: 'SG', text: 'Singapore' },
        { id: 'SK', text: 'Slovakia' },
        { id: 'SI', text: 'Slovenia' },
        { id: 'SB', text: 'Solomon Islands' },
        { id: 'SO', text: 'Somalia' },
        { id: 'ZA', text: 'South Africa' },
        { id: 'GS', text: 'South Georgia And Sandwich Isl.' },
        { id: 'ES', text: 'Spain' },
        { id: 'LK', text: 'Sri Lanka' },
        { id: 'SD', text: 'Sudan' },
        { id: 'SR', text: 'Suriname' },
        { id: 'SJ', text: 'Svalbard And Jan Mayen' },
        { id: 'SZ', text: 'Swaziland' },
        { id: 'SE', text: 'Sweden' },
        { id: 'CH', text: 'Switzerland' },
        { id: 'SY', text: 'Syrian Arab Republic' },
        { id: 'TW', text: 'Taiwan' },
        { id: 'TJ', text: 'Tajikistan' },
        { id: 'TZ', text: 'Tanzania' },
        { id: 'TH', text: 'Thailand' },
        { id: 'TL', text: 'Timor-Leste' },
        { id: 'TG', text: 'Togo' },
        { id: 'TK', text: 'Tokelau' },
        { id: 'TO', text: 'Tonga' },
        { id: 'TT', text: 'Trinidad And Tobago' },
        { id: 'TN', text: 'Tunisia' },
        { id: 'TR', text: 'Turkey' },
        { id: 'TM', text: 'Turkmenistan' },
        { id: 'TC', text: 'Turks And Caicos Islands' },
        { id: 'TV', text: 'Tuvalu' },
        { id: 'UG', text: 'Uganda' },
        { id: 'UA', text: 'Ukraine' },
        { id: 'AE', text: 'United Arab Emirates' },
        { id: 'GB', text: 'United Kingdom' },
        { id: 'US', text: 'United States' },
        { id: 'UM', text: 'United States Outlying Islands' },
        { id: 'UY', text: 'Uruguay' },
        { id: 'UZ', text: 'Uzbekistan' },
        { id: 'VU', text: 'Vanuatu' },
        { id: 'VE', text: 'Venezuela' },
        { id: 'VN', text: 'Viet Nam' },
        { id: 'VG', text: 'Virgin Islands, British' },
        { id: 'VI', text: 'Virgin Islands, U.S.' },
        { id: 'WF', text: 'Wallis And Futuna' },
        { id: 'EH', text: 'Western Sahara' },
        { id: 'YE', text: 'Yemen' },
        { id: 'ZM', text: 'Zambia' },
        { id: 'ZW', text: 'Zimbabwe' },
    ];

    userDetailsForm: FormGroup;
    changePassForm: FormGroup;
    enableTFAForm: FormGroup;

    displayName: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    mobilePhone: AbstractControl;
    addressPrefix: AbstractControl;
    address1: AbstractControl;
    address2: AbstractControl;
    address3: AbstractControl;  // City or Town
    address4: AbstractControl;  // State or Area
    postalCode: AbstractControl;
    country: AbstractControl;
    memorableQuestion: AbstractControl;
    memorableAnswer: AbstractControl;
    profileText: AbstractControl;

    userId: number;
    connectedWalletId: number;
    useTwoFactor: number;
    apiKey: string;
    copied = false;

    oldPassword: AbstractControl;
    password: AbstractControl;
    passwordConfirm: AbstractControl;

    appConfig: AppConfig;

    tabStates: TabState;

    public showPasswords = false;

    @select(['user', 'myDetail']) getUserDetails;
    @select(['user', 'authentication']) authentication$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    constructor(private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private ngRedux: NgRedux<any>,
                private memberSocketService: MemberSocketService,
                private changeDetectorRef: ChangeDetectorRef,
                private myUserService: MyUserService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        ngRedux.subscribe(() => this.updateState());

        // changeUserDetails form
        this.userDetailsForm = new FormGroup({
            displayName: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                ]),
            ),
            firstName: new FormControl(
                '',
                Validators.required,
            ),
            lastName: new FormControl(
                '',
                Validators.required,
            ),
            mobilePhone: new FormControl(
                '',
                Validators.required,
            ),
            addressPrefix: new FormControl(
                '',
            ),
            address1: new FormControl(
                '',
                Validators.required,
            ),
            address2: new FormControl(
                '',
            ),
            address3: new FormControl(    // City or Town
                '',
                Validators.required,
            ),
            address4: new FormControl(    // State or Area
                '',
            ),
            postalCode: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ),
            country: new FormControl(
                '',
                Validators.required,
            ),
            memorableQuestion: new FormControl(
                '',
            ),
            memorableAnswer: new FormControl(
                '',
            ),
            profileText: new FormControl(
                '',
            ),
        });

        this.displayName = this.userDetailsForm.controls['displayName'];
        this.firstName = this.userDetailsForm.controls['firstName'];
        this.lastName = this.userDetailsForm.controls['lastName'];
        this.mobilePhone = this.userDetailsForm.controls['mobilePhone'];
        this.addressPrefix = this.userDetailsForm.controls['addressPrefix'];
        this.address1 = this.userDetailsForm.controls['address1'];
        this.address2 = this.userDetailsForm.controls['address2'];
        this.address3 = this.userDetailsForm.controls['address3'];
        this.address4 = this.userDetailsForm.controls['address4'];
        this.postalCode = this.userDetailsForm.controls['postalCode'];
        this.country = this.userDetailsForm.controls['country'];
        this.memorableQuestion = this.userDetailsForm.controls['memorableQuestion'];
        this.memorableAnswer = this.userDetailsForm.controls['memorableAnswer'];
        this.profileText = this.userDetailsForm.controls['profileText'];

        this.updateState();

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(requested => this.getLanguage(requested)));
        this.getUserDetails.subscribe(getUserDetails => this.myUserDetails(getUserDetails));
    }

    ngOnInit() {
        this.tabStates = {
            detail: true,
            password: false,
            tfa: false,
            api: false,
        };

        this.subscriptionsArray.push(this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'tabname', 'detail');
            this.setTabActive(tabId);
        }));

        this.subscriptionsArray.push(this.authentication$.subscribe((auth) => {
            this.useTwoFactor = auth.useTwoFactor;
            this.apiKey = auth.apiKey;
        }));

        this.subscriptionsArray.push(this.connectedWalletId$.subscribe((id) => {
            this.connectedWalletId = id;
        }));

        // Set changePassword form
        const validator = this.appConfig.production ? passwordValidator : null;
        this.changePassForm = new FormGroup(
            {
                oldPassword: new FormControl(
                    '',
                    Validators.required,
                ),
                password: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                        validator,
                    ]),
                ),
                passwordConfirm: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ),
            },
            this.passwordValidator);

        this.oldPassword = this.changePassForm.controls['oldPassword'];
        this.password = this.changePassForm.controls['password'];
        this.passwordConfirm = this.changePassForm.controls['passwordConfirm'];

        // Set Enable Two-Factor Authentication Form
        this.enableTFAForm = new FormGroup(
            {
                enableTFA: new FormControl(Number(this.useTwoFactor)),
            },
        );
    }

    setTabActive(tabId: string) {
        this.tabStates = immutableHelper.map(this.tabStates, (value, key) => {
            return key === tabId;
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    getLanguage(requested): void {
        console.log(`Language changed from ${this.language} to ${requested}`);
        if (requested) {
            switch (requested) {
            case 'fra':
                this.language = 'fr';
                break;
            case 'eng':
                this.language = 'en';
                break;
            default:
                this.language = 'en';
                break;
            }
        }
    }

    passwordValidator(g: FormGroup) {
        const oldNew = g.get('oldPassword').value !== g.get('password').value ? null : { oldNew: true };
        const mismatch = g.get('password').value === g.get('passwordConfirm').value ? null : { mismatch: true };
        return (oldNew) ? oldNew : mismatch;
    }

    toggleShowPasswords() {
        this.showPasswords = (this.showPasswords === false) ? true : false;
    }

    changePass(formValues) {
        // Show loading alert
        this.alertsService.create('loading');

        const asyncTaskPipe = this.myUserService.saveNewPassword({
            oldPassword: formValues.oldPassword,
            newPassword: formValues.password,
        });

        // Get response
        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_NEW_PASSWORD],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    this.changePassForm.reset();
                    this.alertsService.generate('success', `
                        Your password has been successfully changed!
                    `);
                    const token = _.get(data, '[1].Data[0].Token', '');
                    this.memberSocketService.token = token;
                },
                (data) => {
                    console.error('error: ', data);
                    this.alertsService.generate('error', `
                        Password could not be changed. Please check and try again.
                    `);
                }, // fail
            ),
        );
    }

    enableTwoFactorAuthentication(formValues) {
        // Show loading alert
        this.alertsService.create('loading');

        const twoFactorAuthentication = String(Number(formValues.enableTFA));

        const asyncTaskPipe = this.myUserService.saveTwoFactorAuthentication({
            twoFactorAuthentication,
        });

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.alertsService.generate('success', 'Two-Factor Authentication preference has been saved.');

            },
            (data) => {
                console.error('error: ', data);
                this.alertsService.generate('error', 'Two-Factor Authentication preference could not be saved.');
            }),
        );
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const newWalletId = getConnectedWallet(newState);
        const myDetails = getMyDetail(newState);
    }

    myUserDetails(userDetails) {
        if (userDetails.displayName) this.displayName.setValue(userDetails.displayName);
        if (userDetails.firstName) this.firstName.setValue(userDetails.firstName);
        if (userDetails.lastName) this.lastName.setValue(userDetails.lastName);
        if (userDetails.mobilePhone) this.mobilePhone.setValue(userDetails.mobilePhone);
        if (userDetails.addressPrefix) this.addressPrefix.setValue(userDetails.addressPrefix);
        if (userDetails.address1) this.address1.setValue(userDetails.address1);
        if (userDetails.address2) this.address2.setValue(userDetails.address2);
        if (userDetails.address3) this.address3.setValue(userDetails.address3);
        if (userDetails.address4) this.address4.setValue(userDetails.address4);
        if (userDetails.postalCode) this.postalCode.setValue(userDetails.postalCode);
        if (userDetails.country) {
            try {
                this.country.setValue(JSON.parse(userDetails.country));
            } catch (e) {
                this.country.setValue([]);
            }
        } // array for ng-select
        if (userDetails.memorableQuestion) this.memorableQuestion.setValue(userDetails.memorableQuestion);
        if (userDetails.memorableAnswer) this.memorableAnswer.setValue(userDetails.memorableAnswer);
        if (userDetails.profileText) this.profileText.setValue(userDetails.profileText);
        this.userId = userDetails.userId;
    }

    submitDetails(formValues) {
        // Show loading alert
        this.alertsService.create('loading');

        const asyncTaskPipe = this.myUserService.saveMyUserDetails({
            displayName: formValues.displayName,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            mobilePhone: formValues.mobilePhone,
            addressPrefix: formValues.addressPrefix,
            address1: formValues.address1,
            address2: formValues.address2,
            address3: formValues.address3,
            address4: formValues.address4,
            postalCode: formValues.postalCode,
            country: JSON.stringify(formValues.country),
            memorableQuestion: formValues.memorableQuestion,
            memorableAnswer: formValues.memorableAnswer,
            profileText: formValues.profileText,
        });

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.alertsService.generate('success', 'User details have been successfully updated.');

            },
            (data) => {
                console.error('error: ', data);
                this.alertsService.generate('error', 'Failed to update user details.');
            }),
        );
    }

    handleCopyApiKey(event) {
        const textArea = document.createElement('textarea');
        textArea.setAttribute('style', 'width:1px;border:0;opacity:0;');
        document.body.appendChild(textArea);
        textArea.value = this.apiKey;
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.copied = true;
        setTimeout(
            () => {
                this.copied = false;
                this.changeDetectorRef.markForCheck();
            },
            500,
        );
    }

    hasError(path, error?) {
        const formControl: AbstractControl = path ? this.changePassForm.get(path) : this.changePassForm;

        if (!error) {
            return formControl.errors;
        }
        if (error !== 'required' && formControl.hasError('required')) {
            return false;
        }

        return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
    }

    isTouched(path) {
        const formControl: AbstractControl = this.changePassForm.get(path);

        return formControl.touched;
    }
}
