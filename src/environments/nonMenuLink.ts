const commonMenuLink = [
    '\/messages\/[^\/]*', '\/messages\/inbox\/[^\/]*',
];

export const nonMenuLink = {
    investor: [
        ...commonMenuLink,
        '\/new-investor\/informations',
        '\/new-investor\/already-done\/[^\/]*',
        '\/product-module\/product-caracteristic\/[^\/]*',
        '\/my-requests\/[^\/]*',
    ],
    system_admin: [...commonMenuLink],
    am: [
        ...commonMenuLink,
        '\/product-module\/nav-fund-view',
        '\/nav-fund-view\/[^\/]*\/audit',
        '\/centralization-history\/[^\/]*',
        '\/centralization-history\/[^\/]*',
        '\/kyc-documents\/client\/[^\/]*',
        '\/fund-access\/[^\/]*',
    ],
};
