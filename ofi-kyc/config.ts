export interface Endpoints {
    alreadyDoneWaitingForApproval: string;
    alreadyDoneConfirmation: string;
};

export default {
    alreadyDoneWaitingForApproval: '/new-investor/already-done/waiting-for-validation',
    alreadyDoneConfirmation: '/new-investor/already-done/confirmation',
};

export const kycEnums = {
    documents: {
        kycproofofapprovaldoc: 'kycproofofapprovaldoc',
        kycisincodedoc: 'kycisincodedoc',
        kyclistshareholdersdoc: 'kyclistshareholdersdoc',
        kyclistdirectorsdoc: 'kyclistdirectorsdoc',
        kycbeneficialownersdoc: 'kycbeneficialownersdoc',
        kyclistauthoriseddoc: 'kyclistauthoriseddoc',
        kyctaxcertificationdoc: 'kyctaxcertificationdoc',
        kycw8benefatcadoc: 'kycw8benefatcadoc',
        kycwolfsbergdoc: 'kycwolfsbergdoc',
        kycstatuscertifieddoc: 'kycstatuscertifieddoc',
        kyckbisdoc: 'kyckbisdoc',
        kycannualreportdoc: 'kycannualreportdoc',
        kycidorpassportdoc: 'kycidorpassportdoc',
    }
};