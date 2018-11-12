export interface Endpoints {
    alreadyDoneWaitingForApproval: string;
    alreadyDoneConfirmation: string;
    home: string;
    myRequests: string;
}

export default {
    alreadyDoneWaitingForApproval: '/new-investor/already-done/waiting-for-validation',
    alreadyDoneConfirmation: '/new-investor/already-done/confirmation',
    home: '/login',
    myRequests: '/my-requests/list',
};

export const kycEnums = {
    status: {
        [-2]: {
            label: 'Rejected',
            type: 'danger',
        },
        [-1]: {
            label: 'Accepted',
            type: 'success',
        },
        [0]: {
            label: 'Draft',
            type: 'info',
        },
        [1]: {
            label: 'Waiting For Approval',
            type: 'warning',
        },
        [2]: {
            label: 'Awaiting Information',
            type: 'warning',
        },
    },
    documents: {
        kycproofofapprovaldoc: 'kycproofofapprovaldoc',
        kycisincodedoc: 'kycisincodedoc',
        kycwolfsbergdoc: 'kycwolfsbergdoc',
        kycstatuscertifieddoc: 'kycstatuscertifieddoc',
        kyckbisdoc: 'kyckbisdoc',
        kycannualreportdoc: 'kycannualreportdoc',
        kycidorpassportdoc: 'kycidorpassportdoc',
        kyclistshareholdersdoc: 'kyclistshareholdersdoc',
        kyclistdirectorsdoc: 'kyclistdirectorsdoc',
        kyclistauthoriseddoc: 'kyclistauthoriseddoc',
        kycbeneficialownersdoc: 'kycbeneficialownersdoc',
        kyctaxcertificationdoc: 'kyctaxcertificationdoc',
        kycw8benefatcadoc: 'kycw8benefatcadoc',
    },
};
