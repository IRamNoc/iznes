export interface Endpoints {
    alreadyDoneWaitingForApproval: string;
    alreadyDoneConfirmation: string;
    home: string;
    myRequests: string;
}

export default {
    alreadyDoneWaitingForApproval: '/new-investor/already-done/waiting-for-validation',
    alreadyDoneConfirmation: '/new-investor/already-done/confirmation',
    home: '/home',
    myRequests: '/onboarding-requests/list',
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
};
