export interface Endpoints {
    alreadyDoneWaitingForApproval: string;
    alreadyDoneConfirmation: string;
}

export default {
    alreadyDoneWaitingForApproval: '/new-investor/already-done/waiting-for-validation',
    alreadyDoneConfirmation: '/new-investor/already-done/confirmation',
};

const section = {
    IDENTIFICATION: 'Identification',
    RISK_PROFILE: 'Risk Profile',
    DOCUMENTS: 'Documents',
};

export const kycEnums = {
    status: {
        [-2]: 'rejected',
        [-1]: 'accepted',
        [0]: 'draft',
        [1]: 'waiting for approval',
        [2]: 'awaiting informations',
    },
    section,
    subsection: {
        ['general information']: section.IDENTIFICATION,
        ['company information']: section.IDENTIFICATION,
        ['beneficiaries']: section.IDENTIFICATION,
        ['banking information']: section.IDENTIFICATION,
        ['classification confirmation']: section.IDENTIFICATION,
        ['investments nature']: section.RISK_PROFILE,
        ['investments objectives']: section.RISK_PROFILE,
        ['investments constraints']: section.RISK_PROFILE,
        ['documents']: section.DOCUMENTS,
    },
};
