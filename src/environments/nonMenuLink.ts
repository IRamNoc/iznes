const commonMenuLink = [
    '\/messages\/[^\/]*',
    '\/messages\/inbox\/[^\/]*',
];

export const nonMenuLink = {
    investor: [
        ...commonMenuLink,
        '\/new-investor\/informations',
        '\/new-investor\/already-done\/[^\/]*',
    ],
    system_admin: [...commonMenuLink],
    am: [
        ...commonMenuLink,
        '\/centralisation-history\/[^\/]*',
        '\/management-company',
    ],
};
