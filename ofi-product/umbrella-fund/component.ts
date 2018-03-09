// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Inject} from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import {fromJS} from 'immutable';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute, Router, Params} from '@angular/router';

/* Internal */
import {Subscription} from 'rxjs/Subscription';

/* Services */
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

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
    umbrellaFundList = [];
    managementCompanyList = [];

    showTransferAgent = false;
    showCentralizingAgent = false;

    umbrellaFund: any;
    umbrellaFundID: any = 0;
    editForm = false;
    showModal = false;
    showConfirmModal = false;
    modalTitle = '';
    modalText = '';

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
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) requestedOfiUmbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;

    constructor(
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _numberConverterService: NumberConverterService,
        private _toasterService: ToasterService,
        private _ofiUmbrellaFundService: OfiUmbrellaFundService,
        private _ofiManagementCompanyService: OfiManagementCompanyService,
    ) {
        // param url
        this.subscriptionsArray.push(this._activatedRoute.params.subscribe(params => {
            this.umbrellaFundID = params['id'];
            if (typeof this.umbrellaFundID !== 'undefined' && this.umbrellaFundID !== '' && this.umbrellaFundID > 0) {
                this.editForm = true;
            }
        }));

        this.umbrellaFundForm = this._fb.group({
            umbrellaFundID: [
                '',
            ],
            umbrellaFundName: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            registerOffice: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            registerOfficeAddress: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            legalEntityIdentifier: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            domicile: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            umbrellaFundCreationDate: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            managementCompanyID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            fundAdministratorID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            custodianBankID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentManagerID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            investmentAdvisorID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            payingAgentID: [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            transferAgentID: [
                '',
            ],
            centralisingAgentID: [
                '',
            ],
            giin: [
                '',
            ],
            delegatedManagementCompanyID: [
                '',
            ],
            auditorID: [
                '',
            ],
            taxAuditorID: [
                '',
            ],
            principlePromoterID: [
                '',
            ],
            legalAdvisorID: [
                '',
            ],
            directors: [
                '',
            ],
        });

        this.subscriptionsArray.push(this.umbrellaFundForm.controls['domicile'].valueChanges.subscribe((form) => this.processFormChanges(form)));

        // language
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptionsArray.push(this.requestedOfiUmbrellaFundListOb.subscribe((requested) => this.getUmbrellaFundRequested(requested)));
        this.subscriptionsArray.push(this.umbrellaFundAccessListOb.subscribe((list) => this.getUmbrellaFundList(list)));
        this.subscriptionsArray.push(this.requestedOfiManagementCompanyListOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptionsArray.push(this.managementCompanyAccessListOb.subscribe((list) => this.getManagementCompanyList(list)));
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

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

    getUmbrellaFundRequested(requested): void {
        if (!requested) {
            OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this._ofiUmbrellaFundService, this.ngRedux);
        }
    }

    getUmbrellaFundList(list) {
        const listImu = fromJS(list);

        this.umbrellaFundList = listImu.reduce((result, item) => {

            result.push({
                umbrellaFundID: item.get('umbrellaFundID', 0),
                umbrellaFundName: item.get('umbrellaFundName', ''),
                registerOffice: item.get('registerOffice', ''),
                registerOfficeAddress: item.get('registerOfficeAddress', ''),
                legalEntityIdentifier: item.get('legalEntityIdentifier', 0),
                domicile: item.get('domicile', 0),
                umbrellaFundCreationDate: item.get('umbrellaFundCreationDate', ''),
                managementCompanyID: item.get('managementCompanyID', 0),
                fundAdministratorID: item.get('fundAdministratorID', 0),
                custodianBankID: item.get('custodianBankID', 0),
                investmentManagerID: item.get('investmentManagerID', 0),
                investmentAdvisorID: item.get('investmentAdvisorID', 0),
                payingAgentID: item.get('payingAgentID', 0),
                transferAgentID: item.get('transferAgentID', 0),
                centralisingAgentID: item.get('centralisingAgentID', 0),
                giin: item.get('giin', 0),
                delegatedManagementCompanyID: item.get('delegatedManagementCompanyID', 0),
                auditorID: item.get('auditorID', 0),
                taxAuditorID: item.get('taxAuditorID', 0),
                principlePromoterID: item.get('principlePromoterID', 0),
                legalAdvisorID: item.get('legalAdvisorID', 0),
                directors: item.get('directors', ''),
            });

            return result;
        }, []);

        if (this.editForm && this.umbrellaFundID !== 0 && this.managementCompanyList.length > 0) {
            this.fillForm();
        }

        this._changeDetectorRef.markForCheck();
    }

    getManagementCompanyRequested(requested): void {
        if (!requested) {
            OfiManagementCompanyService.defaultRequestManagementCompanyList(this._ofiManagementCompanyService, this.ngRedux);
        }
    }

    getManagementCompanyList(list) {
        const listImu = fromJS(list);

        this.managementCompanyList = listImu.reduce((result, item) => {

            result.push({
                id: item.get('companyID', 0),
                text: item.get('companyName', ''),
            });

            return result;
        }, []);

        if (this.editForm && this.umbrellaFundID !== 0 && this.managementCompanyList.length > 0) {
            this.fillForm();
        }

        this._changeDetectorRef.markForCheck();
    }

    fillForm(): void {
        this.umbrellaFund = this.umbrellaFundList.filter(element => element.umbrellaFundID.toString() === this.umbrellaFundID.toString());

        this.umbrellaFundForm.get('umbrellaFundID').patchValue(this.umbrellaFund[0].umbrellaFundID, {emitEvent: false});
        this.umbrellaFundForm.get('umbrellaFundName').patchValue(this.umbrellaFund[0].umbrellaFundName, {emitEvent: false});
        this.umbrellaFundForm.get('registerOffice').patchValue(this.umbrellaFund[0].registerOffice, {emitEvent: false});
        this.umbrellaFundForm.get('registerOfficeAddress').patchValue(this.umbrellaFund[0].registerOfficeAddress, {emitEvent: false});
        this.umbrellaFundForm.get('legalEntityIdentifier').patchValue(this.umbrellaFund[0].legalEntityIdentifier, {emitEvent: false});
        const domicile = this.countries.filter(element => element.id.toString() === this.umbrellaFund[0].domicile.toString());
        if (domicile.length > 0) {
            this.umbrellaFundForm.get('domicile').patchValue(domicile, {emitEvent: true});
        }
        this.umbrellaFundForm.get('umbrellaFundCreationDate').patchValue(this.umbrellaFund[0].umbrellaFundCreationDate, {emitEvent: false});
        const managementCompany = this.managementCompanyList.filter(element => element.id.toString() === this.umbrellaFund[0].managementCompanyID.toString());
        if (managementCompany.length > 0) {
            this.umbrellaFundForm.get('managementCompanyID').patchValue(managementCompany, {emitEvent: false});
        }
        console.log('fundAdministratorID', this.umbrellaFund[0].fundAdministratorID);
        const fundAdministrator = this.fundAdminOptions.filter(element => element.id.toString() === this.umbrellaFund[0].fundAdministratorID.toString());
        console.log('fundAdministrator', fundAdministrator);
        if (fundAdministrator.length > 0) {
            this.umbrellaFundForm.get('fundAdministratorID').patchValue(fundAdministrator, {emitEvent: false});
        }
        const custodianBank = this.custodianBankOptions.filter(element => element.id.toString() === this.umbrellaFund[0].custodianBankID.toString());
        if (custodianBank.length > 0) {
            this.umbrellaFundForm.get('custodianBankID').patchValue(custodianBank, {emitEvent: false});
        }
        const investmentManager = this.investmentManagerOptions.filter(element => element.id.toString() === this.umbrellaFund[0].investmentManagerID.toString());
        if (investmentManager.length > 0) {
            this.umbrellaFundForm.get('investmentManagerID').patchValue(investmentManager, {emitEvent: false});
        }
        const investmentAdvisor = this.investmentAdvisorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].investmentAdvisorID.toString());
        if (investmentAdvisor.length > 0) {
            this.umbrellaFundForm.get('investmentAdvisorID').patchValue(investmentAdvisor, {emitEvent: false});
        }
        const payingAgent = this.payingagentOptions.filter(element => element.id.toString() === this.umbrellaFund[0].payingAgentID.toString());
        if (payingAgent.length > 0) {
            this.umbrellaFundForm.get('payingAgentID').patchValue(payingAgent, {emitEvent: false});
        }
        this.umbrellaFundForm.get('transferAgentID').patchValue(this.umbrellaFund[0].transferAgentID, {emitEvent: false});
        this.umbrellaFundForm.get('centralisingAgentID').patchValue(this.umbrellaFund[0].centralisingAgentID, {emitEvent: false});
        this.umbrellaFundForm.get('giin').patchValue(this.umbrellaFund[0].giin, {emitEvent: false});
        const delegatedManagementCompany = this.managementCompanyList.filter(element => element.id.toString() === this.umbrellaFund[0].delegatedManagementCompanyID.toString());
        if (delegatedManagementCompany.length > 0) {
            this.umbrellaFundForm.get('delegatedManagementCompanyID').patchValue(delegatedManagementCompany, {emitEvent: false});
        }
        const auditor = this.auditorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].auditorID.toString());
        if (auditor.length > 0) {
            this.umbrellaFundForm.get('auditorID').patchValue(auditor, {emitEvent: false});
        }
        const taxAuditor = this.taxAuditorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].taxAuditorID.toString());
        if (taxAuditor.length > 0) {
            this.umbrellaFundForm.get('taxAuditorID').patchValue(auditor, {emitEvent: false});
        }
        const principlePromoter = this.principalPromoterOptions.filter(element => element.id.toString() === this.umbrellaFund[0].principlePromoterID.toString());
        if (principlePromoter.length > 0) {
            this.umbrellaFundForm.get('principlePromoterID').patchValue(principlePromoter, {emitEvent: false});
        }
        const legalAdvisor = this.legalAdvisorOptions.filter(element => element.id.toString() === this.umbrellaFund[0].legalAdvisorID.toString());
        if (legalAdvisor.length > 0) {
            this.umbrellaFundForm.get('legalAdvisorID').patchValue(legalAdvisor, {emitEvent: false});
        }
        this.umbrellaFundForm.get('directors').patchValue(this.umbrellaFund[0].directors, {emitEvent: false});

        this.umbrellaFundForm.updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    }

    processFormChanges(field): void {
        this.showTransferAgent = false;
        this.showCentralizingAgent = false;
        if (!!field && field.length > 0) {
            if (field[0].id === 'LU' || field[0].id === 'IE') {
                this.umbrellaFundForm.get('transferAgentID').setValidators(Validators.required);
                this.showTransferAgent = true;
            } else  if (field[0].id === 'FR') {
                this.umbrellaFundForm.get('centralisingAgentID').setValidators(Validators.required);
                this.showCentralizingAgent = true;
            } else {
                this.umbrellaFundForm.get('transferAgentID').patchValue(null, {emitEvent: false});
                this.umbrellaFundForm.get('transferAgentID').setValidators(null);
                this.umbrellaFundForm.get('centralisingAgentID').patchValue(null, {emitEvent: false});
                this.umbrellaFundForm.get('centralisingAgentID').setValidators(null);
            }
        } else {
            this.umbrellaFundForm.get('transferAgentID').patchValue(null, {emitEvent: false});
            this.umbrellaFundForm.get('transferAgentID').setValidators(null);
            this.umbrellaFundForm.get('centralisingAgentID').patchValue(null, {emitEvent: false});
            this.umbrellaFundForm.get('centralisingAgentID').setValidators(null);
        }
        // apply changes
        this.umbrellaFundForm.get('transferAgentID').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
        this.umbrellaFundForm.get('centralisingAgentID').updateValueAndValidity({emitEvent: false}); // emitEvent = true cause infinite loop (make a valueChange)
    }

    cancel() {
        this._router.navigateByUrl('/product-module/home');
    }

    save(formValues) {
        if (!!formValues.umbrellaFundID && formValues.umbrellaFundID !== '' && this.editForm) {
            // UPDATE
            const asyncTaskPipe = this._ofiUmbrellaFundService.updateUmbrellaFund(
                {
                    umbrellaFundID: formValues.umbrellaFundID,
                    umbrellaFundName: formValues.umbrellaFundName || '',
                    registerOffice: formValues.registerOffice || '',
                    registerOfficeAddress: formValues.registerOfficeAddress || '',
                    legalEntityIdentifier: formValues.legalEntityIdentifier || '',
                    domicile: (formValues.domicile.length > 0) ? formValues.domicile[0].id : 0,
                    umbrellaFundCreationDate: formValues.umbrellaFundCreationDate || '',
                    managementCompanyID: (formValues.managementCompanyID.length > 0) ? formValues.managementCompanyID[0].id : 0,
                    fundAdministratorID: (formValues.fundAdministratorID.length > 0) ? formValues.fundAdministratorID[0].id : 0,
                    custodianBankID: (formValues.custodianBankID.length > 0) ? formValues.custodianBankID[0].id : 0,
                    investmentManagerID: (formValues.investmentManagerID.length > 0) ? formValues.investmentManagerID[0].id : 0,
                    investmentAdvisorID: (formValues.investmentAdvisorID.length > 0) ? formValues.investmentAdvisorID[0].id : 0,
                    payingAgentID: (formValues.payingAgentID.length > 0) ? formValues.payingAgentID[0].id : 0,
                    transferAgentID: formValues.transferAgentID || 0,
                    centralisingAgentID: formValues.centralisingAgentID || 0,
                    giin: formValues.giin || 0,
                    delegatedManagementCompanyID: (formValues.delegatedManagementCompanyID.length > 0) ? formValues.delegatedManagementCompanyID[0].id : 0,
                    auditorID: (formValues.auditorID.length > 0) ? formValues.auditorID[0].id : 0,
                    taxAuditorID: (formValues.taxAuditorID.length > 0) ? formValues.taxAuditorID[0].id : 0,
                    principlePromoterID: (formValues.principlePromoterID.length > 0) ? formValues.principlePromoterID[0].id : 0,
                    legalAdvisorID: (formValues.legalAdvisorID.length > 0) ? formValues.legalAdvisorID[0].id : 0,
                    directors: formValues.directors || ''
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    // console.log('save success new fund', data); // success
                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                    this._toasterService.pop('success', formValues.umbrellaFundName + ' has been successfully updated!');
                    this._router.navigateByUrl('/product-module/home');
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this._changeDetectorRef.markForCheck();
                })
            );
        } else {
            // INSERT
            const asyncTaskPipe = this._ofiUmbrellaFundService.saveUmbrellaFund(
                {
                    umbrellaFundName: formValues.umbrellaFundName || '',
                    registerOffice: formValues.registerOffice || '',
                    registerOfficeAddress: formValues.registerOfficeAddress || '',
                    legalEntityIdentifier: formValues.legalEntityIdentifier || '',
                    domicile: (formValues.domicile.length > 0) ? formValues.domicile[0].id : 0,
                    umbrellaFundCreationDate: formValues.umbrellaFundCreationDate || '',
                    managementCompanyID: (formValues.managementCompanyID.length > 0) ? formValues.managementCompanyID[0].id : 0,
                    fundAdministratorID: (formValues.fundAdministratorID.length > 0) ? formValues.fundAdministratorID[0].id : 0,
                    custodianBankID: (formValues.custodianBankID.length > 0) ? formValues.custodianBankID[0].id : 0,
                    investmentManagerID: (formValues.investmentManagerID.length > 0) ? formValues.investmentManagerID[0].id : 0,
                    investmentAdvisorID: (formValues.investmentAdvisorID.length > 0) ? formValues.investmentAdvisorID[0].id : 0,
                    payingAgentID: (formValues.payingAgentID.length > 0) ? formValues.payingAgentID[0].id : 0,
                    transferAgentID: formValues.transferAgentID || 0,
                    centralisingAgentID: formValues.centralisingAgentID || 0,
                    giin: formValues.giin || 0,
                    delegatedManagementCompanyID: (formValues.delegatedManagementCompanyID.length > 0) ? formValues.delegatedManagementCompanyID[0].id : 0,
                    auditorID: (formValues.auditorID.length > 0) ? formValues.auditorID[0].id : 0,
                    taxAuditorID: (formValues.taxAuditorID.length > 0) ? formValues.taxAuditorID[0].id : 0,
                    principlePromoterID: (formValues.principlePromoterID.length > 0) ? formValues.principlePromoterID[0].id : 0,
                    legalAdvisorID: (formValues.legalAdvisorID.length > 0) ? formValues.legalAdvisorID[0].id : 0,
                    directors: formValues.directors || ''
                },
                this.ngRedux);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    // console.log('save success new fund', data); // success
                    OfiUmbrellaFundService.setRequested(false, this.ngRedux);
                    this._toasterService.pop('success', formValues.umbrellaFundName + ' has been successfully created!');
                    this._router.navigateByUrl('/product-module/home');
                },
                (data) => {
                    console.log('Error: ', data);
                    // this.modalTitle = 'Error';
                    // this.modalText = JSON.stringify(data);
                    // this.showTextModal = true;
                    this.showError(JSON.stringify(data));
                    this._changeDetectorRef.markForCheck();
                })
            );
        }
    }

    confirmModal(response) {

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
