import { KycPartySelections } from '../../../../ofi-store/ofi-kyc/my-informations/model';

/**
 * Permissions object defining which documents are to be shown or hidden, based on companies a user has signed up with
 * and other fields in the KYC form.
 */
export class DocumentPermissions {
    companies: KycPartySelections;
    rules: {
        [ruleName: string]: boolean;
    };
}

export class DocumentMetaCache {
    [docName: string]: {
        shouldShow: boolean;
        required: boolean
    };
}
