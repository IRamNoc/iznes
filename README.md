## Menu/url access control
The access is check against allowed urls for each user type.

The allowed urls are derive from the following in the environment files:
 - **menuSpec**
 - **nonMenuLink**

### Logic of getting urls from menuSpec 
Each menu item should have **router_link** and **dynamic_link**(optional).
The **router_link** is static comparision.  **dynamic_link** is regular expression string.
example of menu item:
```
const userAdminWallets = {
    label: 'Wallets',
    label_txt: 'txt_wallets',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-user-admin-wallets',
    router_link: '/user-administration/wallets/0',
    dynamic_link: '/user-administration/wallets/[^\/]*',
};
```

Within the **menuSpec**, a property called **disabled** can also use to specify restricted urls 
example:
```
disabled: ['/my-order', 'my-report'],
```


### Logic of getting urls from nonMenuLink
The nonMenuLink object is recommend to import from the following file
path from a project
```
src/environments/nonMenuLink.ts
```
and import to environment file.

Example of **nonMenuLink**
```
const commonMenuLink = [
    '\/messages\/[^\/]*', '\/messages\/inbox\/[^\/]*',
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
        '\/product-module\/nav-fund-view',
        '\/nav-fund-view\/[^\/]*\/audit',
        '\/centralization-history\/[^\/]*',
        '\/centralization-history\/[^\/]*',
        '\/kyc-documents\/client\/[^\/]*',
        '\/fund-access\/[^\/]*',
    ],
};
``` 

Each urls specified within the **nonMenuLink** is regular expression string.

## Access control on/off flag
As some system would not ready for the changes.

The access control function can be turn off.
By setting the **applyRestrictUrl** within environment file to **false**

OllieTest1

