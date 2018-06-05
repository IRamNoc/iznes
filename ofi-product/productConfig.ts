import { Validators } from '@angular/forms';

const unitTrustItems = [ // Unit Trust / Unit Investment Trust (UIT)
    { id: '0', text: 'GB Authorised unit trust (AUT)' },
    { id: '1', text: 'US For US UIT refer to "US Mutual Fund"' },
    { id: '2', text: 'KY (Exempted) Unit trust' },
    { id: '3', text: 'IE Unit trust' },
    { id: '4', text: 'VG Unit trust' },
    { id: '5', text: 'VM Unit trust' },
    { id: '6', text: 'GG Unit trust' },
    { id: '7', text: 'JE Unit trust' },
    { id: '8', text: 'HK Unit trust' },
    { id: '9', text: 'SG Unit trust' },
    { id: '10', text: 'MT Unit trust' },
];

export const validators = {
    date: {
        day: Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-((0[1-9])|([1-2]\d)|(3[0-1]))$/),
        month: Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])$/),
    },
    alphanumeric: Validators.pattern(/^[\w ]+$/),
    lei: Validators.pattern(/^(\w{20})?$/),
    giin: Validators.pattern(/^([0-9]{19})?$/),
    internalReference: Validators.maxLength(50),
    additionnalNotes: Validators.maxLength(500),
};

export enum typeOfEuDirective {
    UCITS = '0',
    AIF = '1',
    Other = '2',
}

export enum isFundStructure {
    FUND,
    UMBRELLA,
}

export enum isEuDirective {
    NO,
    YES,
}

export enum openOrCloseEnded {
    CLOSE_ENDED,
    OPEN_ENDED,
}

export enum isFundOfFund {
    NO,
    YES,
}

export enum isDedicatedFund {
    NO,
    YES,
}

export enum hasEmbeddedDirective {
    NO,
    YES,
}

export enum hasCapitalPreservation {
    NO,
    YES,
}

export enum hasCppi {
    NO,
    YES,
}

export enum hasHedgeFundStrategy {
    NO,
    YES,
}

export enum isLeveraged {
    NO,
    YES,
}

export enum has130_30Strategy {
    NO,
    YES,
}

export enum isFundTargetingEos {
    NO,
    YES,
}

export enum isFundTargetingSri {
    NO,
    YES,
}

export enum isPassiveFund {
    NO,
    YES,
}

export enum hasSecurityiesLending {
    NO,
    YES,
}

export enum hasSwap {
    NO,
    YES,
}

export enum hasDurationHedge {
    NO,
    YES,
}

export enum useDefaultHolidayMgmt {
    NO,
    YES,
}

export const enums = {
    typeOfEuDirective,
    isFundStructure,
    isEuDirective,
    openOrCloseEnded,
    isFundOfFund,
    isDedicatedFund,
    hasEmbeddedDirective,
    hasCapitalPreservation,
    hasCppi,
    hasHedgeFundStrategy,
    isLeveraged,
    has130_30Strategy,
    isFundTargetingEos,
    isFundTargetingSri,
    isPassiveFund,
    hasSecurityiesLending,
    hasSwap,
    hasDurationHedge,
    useDefaultHolidayMgmt,
};

export const fundItems = {
    domicileItems: [
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
        { id: 'LA', text: 'Lao Peoples Democratic Republic' },
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
    ],
    umbrellaItems: [
        {
            id: '0',
            text: 'none',
        },
    ],
    typeOfEuDirectiveItems: [
        {
            id: typeOfEuDirective.UCITS,
            text: 'UCITS',
        },
        {
            id: typeOfEuDirective.AIF,
            text: 'AIF',
        },
        {
            id: typeOfEuDirective.Other,
            text: 'Other',
        },
    ],
    UCITSVersionItems: [
        {
            id: '3',
            text: 'UCITS III',
        },
        {
            id: '4',
            text: 'UCITS IV',
        },
        {
            id: '5',
            text: 'UCITS V',
        },
        {
            id: '6',
            text: 'UCITS VI',
        },
    ],
    fundLegalFormItems: [
        { id: '0', text: 'Contractual Fund' },
        { id: '1', text: 'Company With Variable Capital (SICAV)' },
        { id: '2', text: 'Open-ended Investment Company (OEIC)' },
        { id: '3', text: 'Company With Fixed Capital (SICAF)' },
        { id: '4', text: 'Unit Trust' },
        { id: '5', text: 'Unit Investment Trust (UIT)' },
        { id: '6', text: 'Limited Partnership (LP)' },
        { id: '7', text: 'Limited Liability Partnership (LLP)' },
        { id: '8', text: 'Exempted Limited Partnership (ELP)' },
        { id: '9', text: 'Company treated as Limited Partnership' },
        { id: '10', text: 'Limited Company' },
        { id: '11', text: 'Limited Liability Company (LLC)' },
        { id: '12', text: 'Exempted Limited Liability Company' },
        { id: '13', text: 'Exempted Company' },
        { id: '14', text: 'Corporation' },
        { id: '15', text: 'International Business Company (IBC)' },
        { id: '16', text: 'Cell Company (ICC / PCC)' },
        { id: '17', text: 'Trust' },
        { id: '18', text: 'US Mutual Fund' },
        { id: '19', text: 'US Face Amount Certificate Company (FAC)' },
        { id: '20', text: 'US engaged Partnership' },
        { id: '21', text: 'Delaware Limited Partnership' },
        { id: '22', text: 'Delaware Limited Liability Company' },
        { id: '23', text: 'Delaware Statutory Trust' },
        { id: '24', text: 'Other' },
    ],
    nationalNomenclatureOfLegalFormItems: {
        0: [ // Contractual Fund
            { id: '0', text: 'LU Fonds commun de placement (FCP)' },
            { id: '1', text: 'FR Fonds commun de placement (FCP)' },
            { id: '2', text: 'BE Fonds commun de placement (FCP)' },
            { id: '3', text: 'CH Vertraglicher Anlagefonds' },
            { id: '4', text: 'IE Common contractual fund (CCF)' },
            { id: '5', text: 'DE Sondervermögen im Eigentum der Kapitalverwaltungsgesellschaft oder im Miteigentum der Anleger (KAGB §92, Abs. 1)' },
            { id: '6', text: 'AT Kapitalanlagefonds verwaltet durch eine Kapitalanlagegesellschaft (Miteigentumsfonds)' },
            { id: '7', text: 'LI Investmentfonds (vertraglicher Anlagefonds)' },
            { id: '8', text: 'ES Fondo de inversión' },
            { id: '9', text: 'IT Fondo comune di investimento, Fondo speculativo' },
            { id: '10', text: 'MT Mutual fund' },
        ],
        1: [ // Company with variable capital (SICAV)
            { id: '0', text: 'LU Société d\'investissement à capital variable' },
            { id: '1', text: 'FR Société d\'investissement à capital variable' },
            { id: '2', text: 'BE Société d\'investissement à capital variable' },
            { id: '3', text: 'GB Investment company with variable capital (ICVC)' },
            { id: '4', text: 'IE Investment company with variable capital (ICVC)' },
            { id: '5', text: 'CH Investmentgesellschaft mit variablem Kapital' },
            { id: '6', text: 'DE Investmentaktiengesellschaft (InvAG) mit veränderlichem Kapital (KAGB §108ff)' },
            { id: '7', text: 'DE Offene Investmentkommanditgesellschaft (InvKG) (KAGB §124ff)' },
            { id: '8', text: 'LI Investmentgesellschaft mit veränderlichem Kapital' },
            { id: '9', text: 'ES Sociedad de inversión de capital variable' },
            { id: '10', text: 'IT Società di investimento a capitale variabile' },
            { id: '11', text: 'MT Investment company with variable share capital' },
        ],
        2: [ // Open-Ended Investment Company (OEIC)
            { id: '0', text: 'GB Open-ended investment company (OEIC)' },
            { id: '1', text: 'IE Open-ended investment company (OEIC)' },
            { id: '2', text: 'SG Open-ended investment company (OEIC)' },
            { id: '3', text: 'ID Open-ended investment company (OEIC)' },
        ],
        3: [ // Company with fixed Capital (SICAF)
            { id: '0', text: 'LU Société d\'investissement à capital fixe' },
            { id: '1', text: 'CH Investmentgesellschaft mit festem Kapital' },
            { id: '2', text: 'FR Société d\'investissement à capital fixe' },
            { id: '3', text: 'BE Société d\'investissement à capital fixe' },
            { id: '4', text: 'DE Investmentaktiengesellschaft (InvAG) mit fixem Kapital' },
            { id: '5', text: 'MT Investment company with fixed share capital' },
        ],
        4: unitTrustItems, // Unit Trust / Unit Investment Trust (UIT)
        5: unitTrustItems,
        6: [ // Limited Partnership (LP)
            { id: '0', text: 'CH Kommanditgesellschaft für kollektive Kapitalanlage (KGK)' },
            { id: '1', text: 'LI Kollektivtreuhänderschaft' },
            { id: '2', text: 'GB English limited partnership, Scottish limited partnership' },
            { id: '3', text: 'IE Investment limited partnership (ILP)' },
            { id: '4', text: 'VG Limited partnership' },
            { id: '5', text: 'GG Limited partnership' },
            { id: '6', text: 'JE Limited partnership' },
            { id: '7', text: 'SG Limited partnership' },
            { id: '8', text: 'US Limited partnership (limited partnership organised under US laws other than the State of Delaware)' },
            { id: '9', text: 'MT Investment partnership' },

        ],
        7: [ // Limited Liability Partnership (LLP)
            { id: '0', text: 'SG Limited Liability Partnership' },
        ],
        8: [ // Exempted Limited Partnership (ELP)
            { id: '0', text: 'KY Exempted Limited Partnership' },
            { id: '1', text: 'BM Exempted Limited Partnership' },
        ],
        9: [ // Company treated as Limited Partnership
            { id: '0', text: 'Company treated as Limited Partnership' },
        ],
        10: [ // Limited Company
            { id: '0', text: 'GB UK investment trust company (UK listed PLC\'s)' },
            { id: '1', text: 'IE Irish Collective Asset-management Vehicle (ICAV)' },
            { id: '2', text: 'US Corporation' },
            { id: '3', text: 'GG Company' },
            { id: '4', text: 'JE Company' },
        ],
        11: [ // Limited Liability Company (LLC)
            { id: '0', text: 'HK Mutual fund' },
            { id: '1', text: 'US Limited liability company (organised under US laws other than the State of Delaware)' },
        ],
        12: [ // Exempted Limited Liability Company
            { id: '0', text: 'Exempted Limited Liability Company' },
        ],
        13: [ // Exempted Company
            { id: '0', text: 'KY Exempted company' },
            { id: '1', text: 'KY Exempted Segregated portfolio company (SPC)' },
            { id: '2', text: 'KY Exempted Limited duration company (LDC)' },
            { id: '3', text: 'BM BVI business company' },
            { id: '4', text: 'BM Segregated portfolio company (SPC)' },
            { id: '5', text: 'BM Mutual fund (defined in the Companies Act as "a company limited by shares … and stating in its memorandum that it is a mutual fund.")' },
        ],
        14: [ // Corporation
            { id: '0', text: 'Corporation' },
        ],
        15: [ // International Business Company (IBC)
            { id: '0', text: 'International Business Company (IBC)' },
        ],
        16: [ // Cell Company (ICC / PCC)
            { id: '0', text: 'GG Protected cell company (PCC)' },
            { id: '1', text: 'JE Protected cell company (PCC)' },
            { id: '2', text: 'JE Incorporated cell company (ICC)' },
        ],
        17: [ // Trust
            { id: '0', text: 'Trust' },
        ],
        18: [ // US Mutual Fund
            { id: '0', text: 'US SEC registered Mutual fund' },
        ],
        19: [ // US Face amount certificate company (FAC)
            { id: '0', text: 'US Face amount certificate company (FAC)' },
        ],
        20: [ // US engaged Partnership
            { id: '0', text: 'US engaged Partnership' },
        ],
        21: [ // Delaware Limited Partnership
            { id: '0', text: 'US Delaware limited partnership' },
        ],
        22: [ // Delaware Limited Liability Company
            { id: '0', text: 'US Delaware limited liability company' },
        ],
        23: [ // Delaware Statutory Trust
            { id: '0', text: 'US Delaware statutory trust' },
        ],
        24: [ // Other
            { id: '0', text: 'Other' },
        ],
    },
    homeCountryLegalTypeItems: {
        CH: [
            { id: '0', text: 'Securities fund' },
            { id: '1', text: 'Real estate fund' },
            { id: '2', text: 'Other funds for traditional investments' },
            { id: '3', text: 'Other funds for alternative investments' },
        ],
        LU: [
            { id : '0', text: 'Partie I' },
            { id : '1', text: 'Partie II' },
            { id : '2', text: 'Specialized investment fund (SIF)' },
        ],
        IE: [
            { id : '0', text: 'Retail fund' },
            { id : '1', text: 'Qualifying investor fund (QIF)' },
            { id : '2', text: 'Professional investor fund (PIF)' },
            { id : '3', text: 'Foreign fund' },
        ],
        DE: [
            { id : '0', text: 'Inländischer OGAW (162ff KAGB)' },
            { id : '1', text: 'Offener inländischer Publikums-AIF (214ff KAGB)' },
            { id : '2', text: 'Geschlossener inländischer Publikums-AIF (261ff KAGB)' },
            { id : '3', text: 'Offener inländischer Spezial-AIF (278ff KAGB)' },
            { id : '4', text: 'Geschlossener inländischer Spezial-AIF (285ff KAGB)' },
        ],
        SG: [
            { id : '0', text: 'Authorised CIS' },
            { id : '1', text: 'Restricted authorised CIS' },
        ],
    },
    fundCurrencyItems: [
        {
            id: '0', text: 'EUR Euro',
        },
        {
            id: '1', text: 'USD US Dollar',
        },
        {
            id: '2', text: 'GBP Pound Sterling',
        },
        {
            id: '3', text: 'CHF Swiss Franc',
        },
        {
            id: '4', text: 'JPY Yen',
        },
        {
            id: '5', text: 'AUD Australian Dollar',
        },
        {
            id: '6', text: 'NOK Norwegian Krone',
        },
        {
            id: '7', text: 'SEK Swedish Krona',
        },
        {
            id: '8', text: 'ZAR Rand',
        },
        {
            id: '9', text: 'RUB Russian Ruble',
        },
        {
            id: '10', text: 'SGD Singapore Dollar',
        },
        {
            id: '11', text: 'AED United Arab Emirates Dirham',
        },
        {
            id: '12', text: 'CNY Yuan Renminbi',
        },
        {
            id: '13', text: 'PLN Zloty',
        },
    ],
    portfolioCurrencyHedgeItems: [
        { id : '1', text: 'No Hedge' },
        { id : '2', text: 'Full Portfolio Hedge' },
        { id : '3', text: 'Currency overlay' },
        { id : '4', text: 'Partial Hedge' },
    ],
    fundAdministratorItems: [
        { id : '1', text: 'Fund Admin 1' },
        { id : '2', text: 'Fund Admin 2' },
        { id : '3', text: 'Fund Admin 3' },
    ],
    custodianBankItems: [
        { id : '1', text: 'Custodian Bank 1' },
        { id : '2', text: 'Custodian Bank 2' },
        { id : '3', text: 'Custodian Bank 3' },
    ],
    investmentManagerItems: [
        { id : '1', text: 'Investment Manager 1' },
        { id : '2', text: 'Investment Manager 2' },
        { id : '3', text: 'Investment Manager 3' },
    ],
    principalPromoterItems: [
        { id : '1', text: 'Principal Promoter 1' },
        { id : '2', text: 'Principal Promoter 2' },
        { id : '3', text: 'Principal Promoter 3' },
    ],
    payingAgentItems: [
        { id : '1', text: 'Paying Agent 1' },
        { id : '2', text: 'Paying Agent 2' },
        { id : '3', text: 'Paying Agent 3' },
    ],
    investmentAdvisorItems: [
        { id : '1', text: 'Investment Advisor 1' },
        { id : '2', text: 'Investment Advisor 2' },
        { id : '3', text: 'Investment Advisor 3' },
    ],
    auditorItems: [
        { id : '1', text: 'Auditor 1' },
        { id : '2', text: 'Auditor 2' },
        { id : '3', text: 'Auditor 3' },
    ],
    taxAuditorItems: [
        { id : '1', text: 'Tax Auditor 1' },
        { id : '2', text: 'Tax Auditor 2' },
        { id : '3', text: 'Tax Auditor 3' },
    ],
    legalAdvisorItems: [
        { id : '1', text: 'Legal Advisor 1' },
        { id : '2', text: 'Legal Advisor 2' },
        { id : '3', text: 'Legal Advisor 3' },
    ],
    capitalPreservationPeriodItems: [
        { id : '1', text: 'Daily' },
        { id : '2', text: 'Twice a week' },
        { id : '3', text: 'Weekly' },
        { id : '4', text: 'Twice a month' },
        { id : '5', text: 'Monthly' },
        { id : '6', text: 'Quarterly' },
        { id : '7', text: 'Twice a year' },
        { id : '8', text: 'Annually' },
    ],
    transferAgentItems: [
        { id : '1', text: 'transfer agent 1' },
        { id : '2', text: 'transfer agent 2' },
        { id : '3', text: 'transfer agent 3' },
    ],
    centralizingAgentItems: [
        { id : '1', text: 'centralizing agent 1' },
        { id : '2', text: 'centralizing agent 2' },
        { id : '3', text: 'centralizing agent 3' },
    ],
};

export default {
    enums,
    fundItems,
    validators,
};
