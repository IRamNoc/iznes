export type AccountAdminResponse = AccountAdminSuccessResponse | AccountAdminErrorResponse;

export type AccountAdminSuccessResponse = [
    null,
    {
        Data: [any],
        Status: string,
    },
    undefined
];

export type AccountAdminErrorResponse = [
    null,
    {
        Data: [{
            Message: string,
            Status: string,
        }],
        Status: string,
    },
    undefined
];

export type RequestCallback = (data: AccountAdminResponse) => void;
