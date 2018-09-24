const commonMenuLink = [
    '\/messages\/[^\/]*',
    '\/messages\/inbox\/[^\/]*',
];

export const nonMenuLink = {
    investor: [
        ...commonMenuLink,
        '\/new-investor\/informations',
        '\/new-investor\/already-done\/[^\/]*',
        '\/product-module\/product-characteristic\/[^\/]*',
        '\/product-module\/product\/fund-share\/*',
    ],
    system_admin: [...commonMenuLink],
    am: [
        ...commonMenuLink,
        '\/centralisation-history\/[^\/]*',
        '\/management-company',
    ],
};
