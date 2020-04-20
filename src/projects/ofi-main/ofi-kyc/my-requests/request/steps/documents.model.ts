import { PartyCompaniesInterface } from "../../kyc-form-helper";

/**
 * Permissions object defining which documents are to be shown or hidden, based on companies a user has signed up with
 * and other fields in the KYC form.
 */
export class DocumentPermissions {
    companies: PartyCompaniesInterface;
    rules: {
        /**
         * Company is listed
         */
        rule1: boolean;
        /**
         * Company is regulated company or state- owned / public entities 
         */
        rule2: boolean;
        /**
         * Company is unregulated, unlisted, not state-owned and does not represent a high risk (risky activity or country):
         */
        rule3: boolean;
        /**
         * Company is unregulated, unlisted, not state-owned with a high activity risk 
         */
        rule4: boolean;
        /**
         * Company is unregulated, unlisted, not state-owned with a high country risk 
         */
        rule5: boolean;
        /**
         * Company is listed with a PEP
         */
        rule6: boolean;
        /**
         * Company is regulated company with a PEP
         */
        rule7: boolean;
        /**
         * Company is state-owned/public entities with a PEP
         */
        rule8: boolean;
    };
    overrides: { [key: string]: boolean };
}

export class DocumentMetaCache {
    [docName: string]: {
        shouldShow: boolean;
        required: boolean
    };
}
