import { FormGroup } from '@angular/forms';
import { KycPartySelections } from '../../ofi-store/ofi-kyc/my-informations/model';

export function isIZNES(selectionState: KycPartySelections): boolean {
    return true;
}

export function isID2SIPA(selectionState: KycPartySelections): boolean {
    return true;
}

export function isID2SCustodian(selectionState: KycPartySelections): boolean {
    return true;
}

export function isNowCPBoth(selectionState: KycPartySelections): boolean {
    return true;
}

export function isNowCPInvestor(selectionState: KycPartySelections): boolean {
    return true;
}

export function isNowCPIssuer(selectionState: KycPartySelections): boolean {
    return true;
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
