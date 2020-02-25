import { FormGroup } from '@angular/forms';
import { KycPartySelections } from '../../ofi-store/ofi-kyc/my-informations/model';

export interface PartyCompaniesInterface {
    iznes: boolean;
    nowcp: boolean;
    id2s: boolean;
}

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
    if ([70, 80, 90].indexOf(investorType) !== -1) return 'nowcp';
    if ([100, 110].indexOf(investorType) !== -1) return 'id2s';
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
        case 70:
            return { nowCPIssuer: true };
        case 80:
            return { nowCPInvestor: true };
        case 90:
            return { nowCPInvestor: true, nowCPIssuer: true };
        case 100:
            return { id2sIPA: true };
        case 110:
            return { id2sCustodian: true };
        default:
            return { iznes: true };
    }
}

/**
 * Listed comes from Identification > Company Information field “is this company listed?”
 */
export function isCompanyListed(f: FormGroup): boolean {
    return true;
}

/**
 * State-owned comes from Identification > Company Information field “Is company state-owned?” and over 50% owned
 */
export function isStateOwn(f: FormGroup): boolean {
    return true;
}

/**
 * Regulated comes from Identification > Company Information field “Is the activity regulated?”
 */
export function isCompanyUnregulated(): boolean {
    return true;
}


/**
 * High Risk Activity comes from Identification > Company Information field “Primary Sectors of Activity” and “Other sectors of activity” these can be checked against the list in Appendix A7
 */
export function isHighRiskActivity(): boolean {
    return true;
}

/**
 * High Risk Country comes from Identification > General Information > Location field “Country of Registration” these can be checked against the list in Appendix A8
 */
export function isHighRiskCountry(): boolean {
    return true;
}
