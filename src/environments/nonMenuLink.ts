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
    ],
    system_admin: [...commonMenuLink],
    am: [
        ...commonMenuLink,
        '\/product-module\/nav-fund-view',
        '\/nav-fund-view\/[^\/]*\/audit',
        '\/centralisation-history\/[^\/]*',
        '\/kyc-documents\/client\/[^\/]*',
        '\/fund-access\/[^\/]*',
        '\/management-company',
        '\/reports\/holders-list\/funds\/[^\\/]*',
        '\/reports\/holders-list\/shares\/[^\\/]*',
        '\/invite-investors',
    ],
};
