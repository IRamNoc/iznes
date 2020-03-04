import { FormGroup, Form } from '@angular/forms';
import { KycPartySelections } from '../../ofi-store/ofi-kyc/my-informations/model';
import { InvestorType } from '../../shared/investor-types';
import { get } from 'lodash';
import { formStepsFull } from './requests.config';


export interface PartyCompaniesInterface {
    iznes: boolean;
    nowcp: boolean;
    id2s: boolean;
}

const highRiskActivities = [
    'Tobacco',
	'Catering',
	'Buildingconstructionandpublicworks',
	'Shippingofgoods',
	'Transportation',
	'Miningactivities',
	'Realestate',
	'Other',
];

/* NOTE
    - Bahamas: high risk but not in country list
    - Korea, Democratic People's Republic of: high risk but we only have 'Korea' in country list
    - Kosovo: high risk but not in country list */
const highRiskCountries = [
    'AM', // Armenia
	'BI', // Burundi
	'KH', // Cambodia
	'AO', // Angola
	'BZ', // Belize
	'CF', // Central African Republic
	'TD', // Chad
	'CD', // Congo, the Democratic Republic of the
	'AF', // Afghanistan
	'ER', // Eritrea
	'GQ', // Equatorial Guinea
	'CU', // Cuba
	'IS', // Iceland
	'PA', // Panama
	'GH', // Ghana
	'LK', // Sri Lanka
	'MN', // Mongolia
	'PK', // Pakistan
	'TN', // Tunisia
	'TT', // Trinidad and Tobago
	'GW', // Guinea-Bissau
	'GY', // Guyana
	'HT', // Haiti
	'KG', // Kyrgyzstan
	'LA', // Lao Peoples Democratic Republic
    'LR', // Liberia
    'LS', // Lesotho
    'MG', // Madagascar
    'ML', // Mali
    'MM', // Myanmar
    'MR', // Mauritania
    'MV', // Maldives
    'MW', // Malawi
    'NP', // Nepal
    'PS', // 'Palestinian Territory, Occupied'
    'SL', // Sierra Leone
    'SR', // Suriname
    'TJ', // Tajikistan
    'ZM', // Zambia
    'IQ', // Iraq
    'IR', // Iran, Islamic Republic Of
    'KR', // Korea
    'LY', // Libyan Arab Jamahiriya
    'MZ', // Mozambique
    'SD', // Sudan
    'SO', // Somalia
    'SY', // Syrian Arab Republic
    'TL', // Timor-Leste
    'VE', // Venezuela
    'YE', // Yemen
    'ZW', // Zimbabwe
    'BW', // Botswana
];

/**
 * Whether IZNES was selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isIZNES(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.iznes;
}

/**
 * Whether ID2s IPA was selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isID2SIPA(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.id2sIPA;
}

/**
 * Whether ID2S Custodian was selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isID2SCustodian(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.id2sCustodian;
}

/**
 * Whether both NowCP Investor and Issuer were selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isNowCPBoth(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.nowCPIssuer && selectionState.nowCPInvestor;
}

/**
 * Whether NowCP Invetor was selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isNowCPInvestor(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.nowCPInvestor;
}

/**
 * Whether NowCP Issuer was selected in Party Selections
 *
 * @param {KycPartySelections} selectionState
 * @returns {boolean}
 */
export function isNowCPIssuer(selectionState: KycPartySelections): boolean {
    return selectionState && selectionState.nowCPIssuer;
}

/**
 * Returns an object of the parties that the investor has selected
 *
 * @param {KycPartySelections} selectionState
 * @returns {PartyCompaniesInterface}
 */
export function getPartyCompanies(selectionState: KycPartySelections): PartyCompaniesInterface {
    return {
        iznes: isIZNES(selectionState),
        nowcp: isNowCPInvestor(selectionState) || isNowCPIssuer(selectionState),
        id2s: isID2SIPA(selectionState) || isID2SCustodian(selectionState),
    }
}

/**
 * Returns a string of the name of the party who invited the investor
 *
 * @param {number} investorType
 * @returns {'iznes'|'nowcp'|'id2s'}
 */
export function getPartyNameFromInvestorType(investorType: number): 'iznes'|'nowcp'|'id2s' {
    const nowcp = [
        InvestorType.NowCPKycIssuer,
        InvestorType.NowCPKycInvestor,
        InvestorType.NowCPKycBothInvestorAndIssuer];
    if (nowcp.indexOf(investorType) !== -1) {
        return 'nowcp';
    }

    const id2s = [
        InvestorType.ID2SKycIPA,
        InvestorType.ID2SKycCustodian,
    ];
    if (id2s.indexOf(investorType) !== -1) {
        return 'id2s';
    }

    return 'iznes';
}

/**
 * Returns a KycPartySelections formatted object of the party who invited the investor
 *
 * @param {number} investorType
 * @returns {KycPartySelections}
 */
export function getPartySelectionFromInvestorType(investorType: number): KycPartySelections {
    switch (investorType) {
        case InvestorType.NowCPKycIssuer:
            return { nowCPIssuer: true };
        case InvestorType.NowCPKycInvestor:
            return { nowCPInvestor: true };
        case InvestorType.NowCPKycBothInvestorAndIssuer:
            return { nowCPInvestor: true, nowCPIssuer: true };
        case InvestorType.ID2SKycIPA:
            return { id2sIPA: true };
        case InvestorType.ID2SKycCustodian:
            return { id2sCustodian: true };
        default:
            return { iznes: true };
    }
}

/**
 * Listed comes from Identification > Company Information field “is this company listed?”
 */
export function isCompanyListed(f: FormGroup): boolean {
    return !!get(f, 'controls.identification.controls.companyInformation.controls.companyListed.value', 0);
}

/**
 * State-owned comes from Identification > Company Information field “Is company state-owned?” and over 50% owned
 */
export function isStateOwned(f: FormGroup): boolean {
    const stateOwned = !!get(f, 'controls.identification.controls.companyInformation.controls.companyStateOwned.value', 0);
    const percentCapitalHeldByState = get(f, 'controls.identification.controls.companyInformation.controls.percentCapitalHeldByState.value', 0)

    return stateOwned && percentCapitalHeldByState > 50;
}

/**
 * Regulated comes from Identification > Company Information field “Is the activity regulated?”
 */
export function isCompanyRegulated(f: FormGroup): boolean {
    return !!get(f, 'controls.identification.controls.companyInformation.controls.activityRegulated.value', 0);
}


/**
 * High Risk Activity comes from Identification > Company Information field “Primary Sectors of Activity” and “Other sectors of activity” these can be checked against the list in Appendix A7
 */
export function isHighRiskActivity(f: FormGroup): boolean {
    const primaryActivity = get(f, 'controls.identification.controls.companyInformation.controls.sectorActivity.value[0]', {});
    const otherActivities = get(f, 'controls.identification.controls.companyInformation.controls.otherSectorActivity.value', []) || [];
    const selectedActivities = [...otherActivities, primaryActivity];

    return !!selectedActivities.filter(a => highRiskActivities.indexOf(a.id) !== -1).length;
}

/**
 * High Risk Country comes from Identification > General Information > Location field “Country of Registration” these can be checked against the list in Appendix A8
 */
export function isHighRiskCountry(f: FormGroup): boolean {
    const selectedCountry = get(f, 'controls.identification.controls.generalInformation.controls.location.controls.countryRegistration.value[0].id', '')
    return highRiskCountries.indexOf(selectedCountry) !== -1;
}
