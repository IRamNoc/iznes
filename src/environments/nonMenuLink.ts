const commonMenuLink = [
    '\/messages\/[^\/]*', '\/messages\/inbox\/[^\/]*',
];

export const nonMenuLink = {
    investor: [
        ...commonMenuLink,
        '\/new-investor\/informations',
        '\/new-investor\/already-done\/[^\/]*',
        '\/product-module\/product-characteristic\/[^\/]*',
        '\/my-requests\/[^\/]*',
        '\/kyc-audit-trail',
        '\/product-module\/product\/fund-share\/*',
    ],
    system_admin: [...commonMenuLink],
    am: [
        ...commonMenuLink,
        '\/product-module\/nav-fund-view',
        '\/nav-fund-view\/[^\/]*\/audit',
        '\/centralisation-history\/[^\/]*',
        '\/management-company',
        '\/invite-investors',
        '\/product-module\/product\/umbrella-fund\/\d+\/audit',
        '\/product-module\/product\/fund\/\d+\/audit',
    ],
};
