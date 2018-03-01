// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Inject} from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import {fromJS} from 'immutable';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute, Router, Params} from '@angular/router';

/* Internal */
import {Subscription} from 'rxjs/Subscription';

/* Alert service. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';

/* Models */

/* Utils. */
import {APP_CONFIG, AppConfig, SagaHelper, NumberConverterService, commonHelper} from '@setl/utils';
import {Observable} from 'rxjs/Observable';
import * as math from 'mathjs';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-umbrella-fund',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UmbrellaFundComponent implements OnInit, AfterViewInit, OnDestroy {

    /* Public properties. */
    umbrellaFundForm: FormGroup;

    showTransferAgent = false;
    showCentralizingAgent = false;

    editForm = false;
    showModal = false;
    showConfirmModal = false;

    mainInformationOpen = true;
    optionalInformationOpen = false;

    // Locale
    language = 'fr';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    countries = [
        {id: 'AF', text: 'Afghanistan'},
        {id: 'AX', text: 'Aland Islands'},
        {id: 'AL', text: 'Albania'},
        {id: 'DZ', text: 'Algeria'},
        {id: 'AS', text: 'American Samoa'},
        {id: 'AD', text: 'Andorra'},
        {id: 'AO', text: 'Angola'},
        {id: 'AI', text: 'Anguilla'},
        {id: 'AQ', text: 'Antarctica'},
        {id: 'AG', text: 'Antigua And Barbuda'},
        {id: 'AR', text: 'Argentina'},
        {id: 'AM', text: 'Armenia'},
        {id: 'AW', text: 'Aruba'},
        {id: 'AU', text: 'Australia'},
        {id: 'AT', text: 'Austria'},
        {id: 'AZ', text: 'Azerbaijan'},
        {id: 'BS', text: 'Bahamas'},
        {id: 'BH', text: 'Bahrain'},
        {id: 'BD', text: 'Bangladesh'},
        {id: 'BB', text: 'Barbados'},
        {id: 'BY', text: 'Belarus'},
        {id: 'BE', text: 'Belgium'},
        {id: 'BZ', text: 'Belize'},
        {id: 'BJ', text: 'Benin'},
        {id: 'BM', text: 'Bermuda'},
        {id: 'BT', text: 'Bhutan'},
        {id: 'BO', text: 'Bolivia'},
        {id: 'BA', text: 'Bosnia And Herzegovina'},
        {id: 'BW', text: 'Botswana'},
        {id: 'BV', text: 'Bouvet Island'},
        {id: 'BR', text: 'Brazil'},
        {id: 'IO', text: 'British Indian Ocean Territory'},
        {id: 'BN', text: 'Brunei Darussalam'},
        {id: 'BG', text: 'Bulgaria'},
        {id: 'BF', text: 'Burkina Faso'},
        {id: 'BI', text: 'Burundi'},
        {id: 'KH', text: 'Cambodia'},
        {id: 'CM', text: 'Cameroon'},
        {id: 'CA', text: 'Canada'},
        {id: 'CV', text: 'Cape Verde'},
        {id: 'KY', text: 'Cayman Islands'},
        {id: 'CF', text: 'Central African Republic'},
        {id: 'TD', text: 'Chad'},
        {id: 'CL', text: 'Chile'},
        {id: 'CN', text: 'China'},
        {id: 'CX', text: 'Christmas Island'},
        {id: 'CC', text: 'Cocos (Keeling) Islands'},
        {id: 'CO', text: 'Colombia'},
        {id: 'KM', text: 'Comoros'},
        {id: 'CG', text: 'Congo'},
        {id: 'CD', text: 'Congo, Democratic Republic'},
        {id: 'CK', text: 'Cook Islands'},
        {id: 'CR', text: 'Costa Rica'},
        {id: 'CI', text: 'Cote D\'Ivoire'},
        {id: 'HR', text: 'Croatia'},
        {id: 'CU', text: 'Cuba'},
        {id: 'CY', text: 'Cyprus'},
        {id: 'CZ', text: 'Czech Republic'},
        {id: 'DK', text: 'Denmark'},
        {id: 'DJ', text: 'Djibouti'},
        {id: 'DM', text: 'Dominica'},
        {id: 'DO', text: 'Dominican Republic'},
        {id: 'EC', text: 'Ecuador'},
        {id: 'EG', text: 'Egypt'},
        {id: 'SV', text: 'El Salvador'},
        {id: 'GQ', text: 'Equatorial Guinea'},
        {id: 'ER', text: 'Eritrea'},
        {id: 'EE', text: 'Estonia'},
        {id: 'ET', text: 'Ethiopia'},
        {id: 'FK', text: 'Falkland Islands (Malvinas)'},
        {id: 'FO', text: 'Faroe Islands'},
        {id: 'FJ', text: 'Fiji'},
        {id: 'FI', text: 'Finland'},
        {id: 'FR', text: 'France'},
        {id: 'GF', text: 'French Guiana'},
        {id: 'PF', text: 'French Polynesia'},
        {id: 'TF', text: 'French Southern Territories'},
        {id: 'GA', text: 'Gabon'},
        {id: 'GM', text: 'Gambia'},
        {id: 'GE', text: 'Georgia'},
        {id: 'DE', text: 'Germany'},
        {id: 'GH', text: 'Ghana'},
        {id: 'GI', text: 'Gibraltar'},
        {id: 'GR', text: 'Greece'},
        {id: 'GL', text: 'Greenland'},
        {id: 'GD', text: 'Grenada'},
        {id: 'GP', text: 'Guadeloupe'},
        {id: 'GU', text: 'Guam'},
        {id: 'GT', text: 'Guatemala'},
        {id: 'GG', text: 'Guernsey'},
        {id: 'GN', text: 'Guinea'},
        {id: 'GW', text: 'Guinea-Bissau'},
        {id: 'GY', text: 'Guyana'},
        {id: 'HT', text: 'Haiti'},
        {id: 'HM', text: 'Heard Island & Mcdonald Islands'},
        {id: 'VA', text: 'Holy See (Vatican City State)'},
        {id: 'HN', text: 'Honduras'},
        {id: 'HK', text: 'Hong Kong'},
        {id: 'HU', text: 'Hungary'},
        {id: 'IS', text: 'Iceland'},
        {id: 'IN', text: 'India'},
        {id: 'ID', text: 'Indonesia'},
        {id: 'IR', text: 'Iran, Islamic Republic Of'},
        {id: 'IQ', text: 'Iraq'},
        {id: 'IE', text: 'Ireland'},
        {id: 'IM', text: 'Isle Of Man'},
        {id: 'IL', text: 'Israel'},
        {id: 'IT', text: 'Italy'},
        {id: 'JM', text: 'Jamaica'},
        {id: 'JP', text: 'Japan'},
        {id: 'JE', text: 'Jersey'},
        {id: 'JO', text: 'Jordan'},
        {id: 'KZ', text: 'Kazakhstan'},
        {id: 'KE', text: 'Kenya'},
        {id: 'KI', text: 'Kiribati'},
        {id: 'KR', text: 'Korea'},
        {id: 'KW', text: 'Kuwait'},
        {id: 'KG', text: 'Kyrgyzstan'},
        {id: 'LA', text: 'Lao People\'s Democratic Republic'},
        {id: 'LV', text: 'Latvia'},
        {id: 'LB', text: 'Lebanon'},
        {id: 'LS', text: 'Lesotho'},
        {id: 'LR', text: 'Liberia'},
        {id: 'LY', text: 'Libyan Arab Jamahiriya'},
        {id: 'LI', text: 'Liechtenstein'},
        {id: 'LT', text: 'Lithuania'},
        {id: 'LU', text: 'Luxembourg'},
        {id: 'MO', text: 'Macao'},
        {id: 'MK', text: 'Macedonia'},
        {id: 'MG', text: 'Madagascar'},
        {id: 'MW', text: 'Malawi'},
        {id: 'MY', text: 'Malaysia'},
        {id: 'MV', text: 'Maldives'},
        {id: 'ML', text: 'Mali'},
        {id: 'MT', text: 'Malta'},
        {id: 'MH', text: 'Marshall Islands'},
        {id: 'MQ', text: 'Martinique'},
        {id: 'MR', text: 'Mauritania'},
        {id: 'MU', text: 'Mauritius'},
        {id: 'YT', text: 'Mayotte'},
        {id: 'MX', text: 'Mexico'},
        {id: 'FM', text: 'Micronesia, Federated States Of'},
        {id: 'MD', text: 'Moldova'},
        {id: 'MC', text: 'Monaco'},
        {id: 'MN', text: 'Mongolia'},
        {id: 'ME', text: 'Montenegro'},
        {id: 'MS', text: 'Montserrat'},
        {id: 'MA', text: 'Morocco'},
        {id: 'MZ', text: 'Mozambique'},
        {id: 'MM', text: 'Myanmar'},
        {id: 'NA', text: 'Namibia'},
        {id: 'NR', text: 'Nauru'},
        {id: 'NP', text: 'Nepal'},
        {id: 'NL', text: 'Netherlands'},
        {id: 'AN', text: 'Netherlands Antilles'},
        {id: 'NC', text: 'New Caledonia'},
        {id: 'NZ', text: 'New Zealand'},
        {id: 'NI', text: 'Nicaragua'},
        {id: 'NE', text: 'Niger'},
        {id: 'NG', text: 'Nigeria'},
        {id: 'NU', text: 'Niue'},
        {id: 'NF', text: 'Norfolk Island'},
        {id: 'MP', text: 'Northern Mariana Islands'},
        {id: 'NO', text: 'Norway'},
        {id: 'OM', text: 'Oman'},
        {id: 'PK', text: 'Pakistan'},
        {id: 'PW', text: 'Palau'},
        {id: 'PS', text: 'Palestinian Territory, Occupied'},
        {id: 'PA', text: 'Panama'},
        {id: 'PG', text: 'Papua New Guinea'},
        {id: 'PY', text: 'Paraguay'},
        {id: 'PE', text: 'Peru'},
        {id: 'PH', text: 'Philippines'},
        {id: 'PN', text: 'Pitcairn'},
        {id: 'PL', text: 'Poland'},
        {id: 'PT', text: 'Portugal'},
        {id: 'PR', text: 'Puerto Rico'},
        {id: 'QA', text: 'Qatar'},
        {id: 'RE', text: 'Reunion'},
        {id: 'RO', text: 'Romania'},
        {id: 'RU', text: 'Russian Federation'},
        {id: 'RW', text: 'Rwanda'},
        {id: 'BL', text: 'Saint Barthelemy'},
        {id: 'SH', text: 'Saint Helena'},
        {id: 'KN', text: 'Saint Kitts And Nevis'},
        {id: 'LC', text: 'Saint Lucia'},
        {id: 'MF', text: 'Saint Martin'},
        {id: 'PM', text: 'Saint Pierre And Miquelon'},
        {id: 'VC', text: 'Saint Vincent And Grenadines'},
        {id: 'WS', text: 'Samoa'},
        {id: 'SM', text: 'San Marino'},
        {id: 'ST', text: 'Sao Tome And Principe'},
        {id: 'SA', text: 'Saudi Arabia'},
        {id: 'SN', text: 'Senegal'},
        {id: 'RS', text: 'Serbia'},
        {id: 'SC', text: 'Seychelles'},
        {id: 'SL', text: 'Sierra Leone'},
        {id: 'SG', text: 'Singapore'},
        {id: 'SK', text: 'Slovakia'},
        {id: 'SI', text: 'Slovenia'},
        {id: 'SB', text: 'Solomon Islands'},
        {id: 'SO', text: 'Somalia'},
        {id: 'ZA', text: 'South Africa'},
        {id: 'GS', text: 'South Georgia And Sandwich Isl.'},
        {id: 'ES', text: 'Spain'},
        {id: 'LK', text: 'Sri Lanka'},
        {id: 'SD', text: 'Sudan'},
        {id: 'SR', text: 'Suriname'},
        {id: 'SJ', text: 'Svalbard And Jan Mayen'},
        {id: 'SZ', text: 'Swaziland'},
        {id: 'SE', text: 'Sweden'},
        {id: 'CH', text: 'Switzerland'},
        {id: 'SY', text: 'Syrian Arab Republic'},
        {id: 'TW', text: 'Taiwan'},
        {id: 'TJ', text: 'Tajikistan'},
        {id: 'TZ', text: 'Tanzania'},
        {id: 'TH', text: 'Thailand'},
        {id: 'TL', text: 'Timor-Leste'},
        {id: 'TG', text: 'Togo'},
        {id: 'TK', text: 'Tokelau'},
        {id: 'TO', text: 'Tonga'},
        {id: 'TT', text: 'Trinidad And Tobago'},
        {id: 'TN', text: 'Tunisia'},
        {id: 'TR', text: 'Turkey'},
        {id: 'TM', text: 'Turkmenistan'},
        {id: 'TC', text: 'Turks And Caicos Islands'},
        {id: 'TV', text: 'Tuvalu'},
        {id: 'UG', text: 'Uganda'},
        {id: 'UA', text: 'Ukraine'},
        {id: 'AE', text: 'United Arab Emirates'},
        {id: 'GB', text: 'United Kingdom'},
        {id: 'US', text: 'United States'},
        {id: 'UM', text: 'United States Outlying Islands'},
        {id: 'UY', text: 'Uruguay'},
        {id: 'UZ', text: 'Uzbekistan'},
        {id: 'VU', text: 'Vanuatu'},
        {id: 'VE', text: 'Venezuela'},
        {id: 'VN', text: 'Viet Nam'},
        {id: 'VG', text: 'Virgin Islands, British'},
        {id: 'VI', text: 'Virgin Islands, U.S.'},
        {id: 'WF', text: 'Wallis And Futuna'},
        {id: 'EH', text: 'Western Sahara'},
        {id: 'YE', text: 'Yemen'},
        {id: 'ZM', text: 'Zambia'},
        {id: 'ZW', text: 'Zimbabwe'}
    ];

    fundAdminOptions = [
        {id: '1', text: 'Fund Admin 1'},
        {id: '2', text: 'Fund Admin 2'},
        {id: '3', text: 'Fund Admin 3'},
    ];

    custodianBankOptions = [
        {id: '1', text: 'Custodian bank 1'},
        {id: '2', text: 'Custodian bank 2'},
        {id: '3', text: 'Custodian bank 3'},
    ];

    investmentManagerOptions = [
        {id: '1', text: 'Investment Manager 1'},
        {id: '2', text: 'Investment Manager 2'},
        {id: '3', text: 'Investment Manager 3'},
    ];

    investmentAdvisorOptions = [
        {id: '1', text: 'Investment Advisor 1'},
        {id: '2', text: 'Investment Advisor 2'},
        {id: '3', text: 'Investment Advisor 3'},
    ];

    payingagentOptions = [
        {id: '1', text: 'Paying Agent 1'},
        {id: '2', text: 'Paying Agent 2'},
        {id: '3', text: 'Paying Agent 3'},
    ];

    auditorOptions = [
        {id: '1', text: 'Auditor 1'},
        {id: '2', text: 'Auditor 2'},
        {id: '3', text: 'Auditor 3'},
    ];

    taxAuditorOptions = [
        {id: '1', text: 'Tax Auditor 1'},
        {id: '2', text: 'Tax Auditor 2'},
        {id: '3', text: 'Tax Auditor 3'},
    ];

    principalPromoterOptions = [
        {id: '1', text: 'Principal Promoter 1'},
        {id: '2', text: 'Principal Promoter 2'},
        {id: '3', text: 'Principal Promoter 3'},
    ];

    legalAdvisorOptions = [
        {id: '1', text: 'Legal Advisor 1'},
        {id: '2', text: 'Legal Advisor 2'},
        {id: '3', text: 'Legal Advisor 3'},
    ];

    /* Private properties. */
    subscriptionsArray: Array<Subscription> = [];

    /* Redux observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    constructor(
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _numberConverterService: NumberConverterService,
    ) {
        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        this.umbrellaFundForm = this._fb.group({
            ufId: [
                '',
            ],
            umbrellaFundName: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            nameRegistredOffice: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            addressRegistredOffice: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            lei: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            country: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            creationDate: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            managementCompany: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            fundAdministrator: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            custodian: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentManager: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentAdvisor: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            payingAgent: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            transferAgent: [
                '',
            ],
            centralizingAgent: [
                '',
            ],
            giin: [
                '',
            ],
            delegatedManagementCompany: [
                '',
            ],
            auditor: [
                '',
            ],
            taxAuditor: [
                '',
            ],
            principalPromoter: [
                '',
            ],
            legalAdvisor: [
                '',
            ],
            directors: [
                '',
            ],
        });

        this.subscriptionsArray.push(this.umbrellaFundForm.valueChanges.subscribe((form) => this.processFormChanges(form)));
    }

    getLanguage(requested): void {
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

    processFormChanges(form): void {
        this.showTransferAgent = false;
        this.showCentralizingAgent = false;
        this.umbrellaFundForm.get('transferAgent').patchValue(null, {emitEvent: false});
        this.umbrellaFundForm.get('transferAgent').setValidators(null);
        this.umbrellaFundForm.get('centralizingAgent').patchValue(null, {emitEvent: false});
        this.umbrellaFundForm.get('centralizingAgent').setValidators(null);
        if (!!form.country && form.country.length > 0) {
            if (form.country[0].id === 'LU' || form.country[0].id === 'IE') {
                this.umbrellaFundForm.get('transferAgent').setValidators(Validators.required);
                this.showTransferAgent = true;
            }
            if (form.country[0].id === 'FR') {
                this.umbrellaFundForm.get('centralizingAgent').setValidators(Validators.required);
                this.showCentralizingAgent = true;
            }
        }
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {

    }

    cancel() {
        this._router.navigateByUrl('/product-module/home');
    }

    save(formValues) {

    }

    /**
     * Format Date
     * -----------
     * Formats a date to a string.
     * YYYY - 4 character year
     * YY - 2 character year
     * MM - 2 character month
     * DD - 2 character date
     * hh - 2 character hour (24 hour)
     * hH - 2 character hour (12 hour)
     * mm - 2 character minute
     * ss - 2 character seconds
     * @param  {string} formatString [description]
     * @param  {Date}   dateObj      [description]
     * @return {[type]}              [description]
     */
    private formatDate(formatString: string, dateObj: Date) {
        /* Return if we're missing a param. */
        if (!formatString || !dateObj) return false;

        /* Return the formatted string. */
        return formatString
            .replace('YYYY', dateObj.getFullYear().toString())
            .replace('YY', dateObj.getFullYear().toString().slice(2, 3))
            .replace('MM', this.numPad((dateObj.getMonth() + 1).toString()))
            .replace('DD', this.numPad(dateObj.getDate().toString()))
            .replace('hh', this.numPad(dateObj.getHours()))
            .replace('hH', this.numPad(dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()))
            .replace('mm', this.numPad(dateObj.getMinutes()))
            .replace('ss', this.numPad(dateObj.getSeconds()))
    }

    /**
     * Num Pad
     *
     * @param num
     * @returns {string}
     */
    private numPad(num) {
        return num < 10 ? '0' + num : num;
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    /**
     * ===============
     * Alert Functions
     * ===============
     */

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message) {
        /* Show the error. */
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

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message) {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
        this.alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

}
