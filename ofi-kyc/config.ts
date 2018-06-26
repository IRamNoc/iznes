export interface Endpoints {
    alreadyDoneWaitingForApproval: string;
    alreadyDoneConfirmation: string;
};

export default {
    alreadyDoneWaitingForApproval: '/new-investor/already-done/waiting-for-validation',
    alreadyDoneConfirmation: '/new-investor/already-done/confirmation',
};

export const kycEnums = {
    status: {
        [-2]: 'rejected',
        [-1]: 'accepted',
        [0]: 'before kyc',
        [1]: 'waiting for approval',
        [2]: 'awaiting informations',
    },
};
