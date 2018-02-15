/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import {SET_HIGHLIGHT_LIST, setAppliedHighlight, clearAppliedHighlight} from '@setl/core-store';

import { fromJS } from 'immutable';

import {MultilingualService} from '@setl/multilingual';
import {immutableHelper, MoneyValuePipe, NumberConverterService, APP_CONFIG, AppConfig, commonHelper} from '@setl/utils';
import * as math from 'mathjs';

@Component({
    selector: 'app-my-informations',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiMyInformationsComponent implements OnInit, OnDestroy {

    appConfig: AppConfig;
    showModal = false;

    // Locale
    language = 'fr-Latn';

    hasFilledAdditionnalInfos = false;
    additionnalForm: FormGroup;
    formSaved = false;

    private subscriptions: Array<any> = [];

    phoneNumbersCountryCodes = [{ id: '+7 840', text: 'Abkhazia (+7 840)' }, { id: '+93', text: 'Afghanistan (+93)' }, { id: '+355', text: 'Albania (+355)' }, { id: '+213', text: 'Algeria (+213)' }, { id: '+1 684', text: 'American Samoa (+1 684)' }, { id: '+376', text: 'Andorra (+376)' }, { id: '+244', text: 'Angola (+244)' }, { id: '+1 264', text: 'Anguilla (+1 264)' }, { id: '+1 268', text: 'Antigua and Barbuda (+1 268)' }, { id: '+54', text: 'Argentina (+54)' }, { id: '+374', text: 'Armenia (+374)' }, { id: '+297', text: 'Aruba (+297)' }, { id: '+247', text: 'Ascension (+247)' }, { id: '+61', text: 'Australia (+61)' }, { id: '+672', text: 'Australian External Territories (+672)' }, { id: '+43', text: 'Austria (+43)' }, { id: '+994', text: 'Azerbaijan (+994)' }, { id: '+1 242', text: 'Bahamas (+1 242)' }, { id: '+973', text: 'Bahrain (+973)' }, { id: '+880', text: 'Bangladesh (+880)' }, { id: '+1 246', text: 'Barbados (+1 246)' }, { id: '+1 268', text: 'Barbuda (+1 268)' }, { id: '+375', text: 'Belarus (+375)' }, { id: '+32', text: 'Belgium (+32)' }, { id: '+501', text: 'Belize (+501)' }, { id: '+229', text: 'Benin (+229)' }, { id: '+1 441', text: 'Bermuda (+1 441)' }, { id: '+975', text: 'Bhutan (+975)' }, { id: '+591', text: 'Bolivia (+591)' }, { id: '+387', text: 'Bosnia and Herzegovina (+387)' }, { id: '+267', text: 'Botswana (+267)' }, { id: '+55', text: 'Brazil (+55)' }, { id: '+246', text: 'British Indian Ocean Territory (+246)' }, { id: '+1 284', text: 'British Virgin Islands (+1 284)' }, { id: '+673', text: 'Brunei (+673)' }, { id: '+359', text: 'Bulgaria (+359)' }, { id: '+226', text: 'Burkina Faso (+226)' }, { id: '+257', text: 'Burundi (+257)' }, { id: '+855', text: 'Cambodia (+855)' }, { id: '+237', text: 'Cameroon (+237)' }, { id: '+1', text: 'Canada (+1)' }, { id: '+238', text: 'Cape Verde (+238)' }, { id: '+ 345', text: 'Cayman Islands (+ 345)' }, { id: '+236', text: 'Central African Republic (+236)' }, { id: '+235', text: 'Chad (+235)' }, { id: '+56', text: 'Chile (+56)' }, { id: '+86', text: 'China (+86)' }, { id: '+61', text: 'Christmas Island (+61)' }, { id: '+61', text: 'Cocos-Keeling Islands (+61)' }, { id: '+57', text: 'Colombia (+57)' }, { id: '+269', text: 'Comoros (+269)' }, { id: '+242', text: 'Congo (+242)' }, { id: '+243', text: 'Congo, Dem. Rep. of (Zaire) (+243)' }, { id: '+682', text: 'Cook Islands (+682)' }, { id: '+506', text: 'Costa Rica (+506)' }, { id: '+385', text: 'Croatia (+385)' }, { id: '+53', text: 'Cuba (+53)' }, { id: '+599', text: 'Curacao (+599)' }, { id: '+537', text: 'Cyprus (+537)' }, { id: '+420', text: 'Czech Republic (+420)' }, { id: '+45', text: 'Denmark (+45)' }, { id: '+246', text: 'Diego Garcia (+246)' }, { id: '+253', text: 'Djibouti (+253)' }, { id: '+1 767', text: 'Dominica (+1 767)' }, { id: '+1 809', text: 'Dominican Republic (+1 809)' }, { id: '+670', text: 'East Timor (+670)' }, { id: '+56', text: 'Easter Island (+56)' }, { id: '+593', text: 'Ecuador (+593)' }, { id: '+20', text: 'Egypt (+20)' }, { id: '+503', text: 'El Salvador (+503)' }, { id: '+240', text: 'Equatorial Guinea (+240)' }, { id: '+291', text: 'Eritrea (+291)' }, { id: '+372', text: 'Estonia (+372)' }, { id: '+251', text: 'Ethiopia (+251)' }, { id: '+500', text: 'Falkland Islands (+500)' }, { id: '+298', text: 'Faroe Islands (+298)' }, { id: '+679', text: 'Fiji (+679)' }, { id: '+358', text: 'Finland (+358)' }, { id: '+33', text: 'France (+33)' }, { id: '+596', text: 'French Antilles (+596)' }, { id: '+594', text: 'French Guiana (+594)' }, { id: '+689', text: 'French Polynesia (+689)' }, { id: '+241', text: 'Gabon (+241)' }, { id: '+220', text: 'Gambia (+220)' }, { id: '+995', text: 'Georgia (+995)' }, { id: '+49', text: 'Germany (+49)' }, { id: '+233', text: 'Ghana (+233)' }, { id: '+350', text: 'Gibraltar (+350)' }, { id: '+30', text: 'Greece (+30)' }, { id: '+299', text: 'Greenland (+299)' }, { id: '+1 473', text: 'Grenada (+1 473)' }, { id: '+590', text: 'Guadeloupe (+590)' }, { id: '+1 671', text: 'Guam (+1 671)' }, { id: '+502', text: 'Guatemala (+502)' }, { id: '+224', text: 'Guinea (+224)' }, { id: '+245', text: 'Guinea-Bissau (+245)' }, { id: '+595', text: 'Guyana (+595)' }, { id: '+509', text: 'Haiti (+509)' }, { id: '+504', text: 'Honduras (+504)' }, { id: '+852', text: 'Hong Kong SAR China (+852)' }, { id: '+36', text: 'Hungary (+36)' }, { id: '+354', text: 'Iceland (+354)' }, { id: '+91', text: 'India (+91)' }, { id: '+62', text: 'Indonesia (+62)' }, { id: '+98', text: 'Iran (+98)' }, { id: '+964', text: 'Iraq (+964)' }, { id: '+353', text: 'Ireland (+353)' }, { id: '+972', text: 'Israel (+972)' }, { id: '+39', text: 'Italy (+39)' }, { id: '+225', text: 'Ivory Coast (+225)' }, { id: '+1 876', text: 'Jamaica (+1 876)' }, { id: '+81', text: 'Japan (+81)' }, { id: '+962', text: 'Jordan (+962)' }, { id: '+7 7', text: 'Kazakhstan (+7 7)' }, { id: '+254', text: 'Kenya (+254)' }, { id: '+686', text: 'Kiribati (+686)' }, { id: '+965', text: 'Kuwait (+965)' }, { id: '+996', text: 'Kyrgyzstan (+996)' }, { id: '+856', text: 'Laos (+856)' }, { id: '+371', text: 'Latvia (+371)' }, { id: '+961', text: 'Lebanon (+961)' }, { id: '+266', text: 'Lesotho (+266)' }, { id: '+231', text: 'Liberia (+231)' }, { id: '+218', text: 'Libya (+218)' }, { id: '+423', text: 'Liechtenstein (+423)' }, { id: '+370', text: 'Lithuania (+370)' }, { id: '+352', text: 'Luxembourg (+352)' }, { id: '+853', text: 'Macau SAR China (+853)' }, { id: '+389', text: 'Macedonia (+389)' }, { id: '+261', text: 'Madagascar (+261)' }, { id: '+265', text: 'Malawi (+265)' }, { id: '+60', text: 'Malaysia (+60)' }, { id: '+960', text: 'Maldives (+960)' }, { id: '+223', text: 'Mali (+223)' }, { id: '+356', text: 'Malta (+356)' }, { id: '+692', text: 'Marshall Islands (+692)' }, { id: '+596', text: 'Martinique (+596)' }, { id: '+222', text: 'Mauritania (+222)' }, { id: '+230', text: 'Mauritius (+230)' }, { id: '+262', text: 'Mayotte (+262)' }, { id: '+52', text: 'Mexico (+52)' }, { id: '+691', text: 'Micronesia (+691)' }, { id: '+1 808', text: 'Midway Island (+1 808)' }, { id: '+373', text: 'Moldova (+373)' }, { id: '+377', text: 'Monaco (+377)' }, { id: '+976', text: 'Mongolia (+976)' }, { id: '+382', text: 'Montenegro (+382)' }, { id: '+1664', text: 'Montserrat (+1664)' }, { id: '+212', text: 'Morocco (+212)' }, { id: '+95', text: 'Myanmar (+95)' }, { id: '+264', text: 'Namibia (+264)' }, { id: '+674', text: 'Nauru (+674)' }, { id: '+977', text: 'Nepal (+977)' }, { id: '+31', text: 'Netherlands (+31)' }, { id: '+599', text: 'Netherlands Antilles (+599)' }, { id: '+1 869', text: 'Nevis (+1 869)' }, { id: '+687', text: 'New Caledonia (+687)' }, { id: '+64', text: 'New Zealand (+64)' }, { id: '+505', text: 'Nicaragua (+505)' }, { id: '+227', text: 'Niger (+227)' }, { id: '+234', text: 'Nigeria (+234)' }, { id: '+683', text: 'Niue (+683)' }, { id: '+672', text: 'Norfolk Island (+672)' }, { id: '+850', text: 'North Korea (+850)' }, { id: '+1 670', text: 'Northern Mariana Islands (+1 670)' }, { id: '+47', text: 'Norway (+47)' }, { id: '+968', text: 'Oman (+968)' }, { id: '+92', text: 'Pakistan (+92)' }, { id: '+680', text: 'Palau (+680)' }, { id: '+970', text: 'Palestinian Territory (+970)' }, { id: '+507', text: 'Panama (+507)' }, { id: '+675', text: 'Papua New Guinea (+675)' }, { id: '+595', text: 'Paraguay (+595)' }, { id: '+51', text: 'Peru (+51)' }, { id: '+63', text: 'Philippines (+63)' }, { id: '+48', text: 'Poland (+48)' }, { id: '+351', text: 'Portugal (+351)' }, { id: '+1 787', text: 'Puerto Rico (+1 787)' }, { id: '+974', text: 'Qatar (+974)' }, { id: '+262', text: 'Reunion (+262)' }, { id: '+40', text: 'Romania (+40)' }, { id: '+7', text: 'Russia (+7)' }, { id: '+250', text: 'Rwanda (+250)' }, { id: '+685', text: 'Samoa (+685)' }, { id: '+378', text: 'San Marino (+378)' }, { id: '+966', text: 'Saudi Arabia (+966)' }, { id: '+221', text: 'Senegal (+221)' }, { id: '+381', text: 'Serbia (+381)' }, { id: '+248', text: 'Seychelles (+248)' }, { id: '+232', text: 'Sierra Leone (+232)' }, { id: '+65', text: 'Singapore (+65)' }, { id: '+421', text: 'Slovakia (+421)' }, { id: '+386', text: 'Slovenia (+386)' }, { id: '+677', text: 'Solomon Islands (+677)' }, { id: '+27', text: 'South Africa (+27)' }, { id: '+500', text: 'South Georgia and the South Sandwich Islands (+500)' }, { id: '+82', text: 'South Korea (+82)' }, { id: '+34', text: 'Spain (+34)' }, { id: '+94', text: 'Sri Lanka (+94)' }, { id: '+249', text: 'Sudan (+249)' }, { id: '+597', text: 'Suriname (+597)' }, { id: '+268', text: 'Swaziland (+268)' }, { id: '+46', text: 'Sweden (+46)' }, { id: '+41', text: 'Switzerland (+41)' }, { id: '+963', text: 'Syria (+963)' }, { id: '+886', text: 'Taiwan (+886)' }, { id: '+992', text: 'Tajikistan (+992)' }, { id: '+255', text: 'Tanzania (+255)' }, { id: '+66', text: 'Thailand (+66)' }, { id: '+670', text: 'Timor Leste (+670)' }, { id: '+228', text: 'Togo (+228)' }, { id: '+690', text: 'Tokelau (+690)' }, { id: '+676', text: 'Tonga (+676)' }, { id: '+1 868', text: 'Trinidad and Tobago (+1 868)' }, { id: '+216', text: 'Tunisia (+216)' }, { id: '+90', text: 'Turkey (+90)' }, { id: '+993', text: 'Turkmenistan (+993)' }, { id: '+1 649', text: 'Turks and Caicos Islands (+1 649)' }, { id: '+688', text: 'Tuvalu (+688)' }, { id: '+1 340', text: 'U.S. Virgin Islands (+1 340)' }, { id: '+256', text: 'Uganda (+256)' }, { id: '+380', text: 'Ukraine (+380)' }, { id: '+971', text: 'United Arab Emirates (+971)' }, { id: '+44', text: 'United Kingdom (+44)' }, { id: '+1', text: 'United States (+1)' }, { id: '+598', text: 'Uruguay (+598)' }, { id: '+998', text: 'Uzbekistan (+998)' }, { id: '+678', text: 'Vanuatu (+678)' }, { id: '+58', text: 'Venezuela (+58)' }, { id: '+84', text: 'Vietnam (+84)' }, { id: '+1 808', text: 'Wake Island (+1 808)' }, { id: '+681', text: 'Wallis and Futuna (+681)' }, { id: '+967', text: 'Yemen (+967)' }, { id: '+260', text: 'Zambia (+260)' }, { id: '+255', text: 'Zanzibar (+255)' }, { id: '+263', text: 'Zimbabwe (+263)' }];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private _fb: FormBuilder,
                private multilingualService: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;

        // language
        this.subscriptions.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));

        this.additionnalForm = this._fb.group({
            email: [
                'email@auto.com',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ])
            ],
            firstName: [
                'Put automatically',
                Validators.compose([
                    Validators.required,
                ])
            ],
            lastName: [
                'Put automatically',
                Validators.compose([
                    Validators.required,
                ])
            ],
            invitedBy: [
                'Put automatically',
                Validators.compose([
                    Validators.required,
                ])
            ],
            companyName: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            phoneCode: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            phoneNumber: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ]
        });
    }

    ngOnInit() {
        this.switchPhoneCode();
    }

    switchPhoneCode() {
        if (this.additionnalForm && this.additionnalForm.controls) {
            switch (this.language) {
                case 'fr-Latn':
                    this.additionnalForm.controls['phoneCode'].patchValue([{id: '+33', text: 'France (+33)'}]);
                    break;
                case 'en-Latn':
                    this.additionnalForm.controls['phoneCode'].patchValue([{id: '+44', text: 'United Kingdom (+44)'}]);
                    break;
                default:
                    this.additionnalForm.controls['phoneCode'].patchValue([{id: '+33', text: 'France (+33)'}]);
                    break;
            }
        }
    }

    getLanguage(requested): void {
        if (requested) {
            this.language = requested;
            this.switchPhoneCode();
        }
    }

    saveAdditionnal(formValues) {
        const listImu = fromJS([
            {id: 'dropdown-user'},
            {id: 'menu-account-module'},
        ]);

        let listToRedux = [];
        listToRedux = listImu.reduce((result, item) => {

            result.push({
                id: item.get('id', ''),
            });

            return result;
        }, []);

        this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: listToRedux});
        this._ngRedux.dispatch(setAppliedHighlight());

        this.formSaved = true;
        this.showModal = true;
    }

    closeModal() {
        this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: [{}]});
        this._ngRedux.dispatch(clearAppliedHighlight());
        this.showModal = false;
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
