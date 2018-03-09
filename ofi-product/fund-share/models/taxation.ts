export class ShareTaxation {
    tisTidReporting?: string = '';
    hasDailyDeliveryOfInterimProfit?: boolean = false;
    hasReducedLuxembourgTax?: boolean = false;
    luxembourgTax?: number = null;
    hasSwissTaxReporting?: boolean = false;
    swissTaxStatusRuling?: boolean = false;
    isEligibleForTaxDeferredFundSwitchInSpain?: boolean = false;
    hasUKReportingStatus?: boolean = false;
    ukReportingStatusValidFrom?: string = '';
    ukReportingStatusValidUntil?: string = '';
    hasUKConfirmationOfExcessAmount?: boolean = false;
    isUSTaxFormsW8W9Needed?: boolean = false;
    isFlowThroughEntityByUSTaxLaw?: boolean = false;
    fatcaStatusV2?: string = '';
    isSubjectToFATCAWithholdingTaxation?: boolean = false;
}