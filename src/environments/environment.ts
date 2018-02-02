// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {menuSpec} from './menuSpec';

export const environment = {
    production: false,
    MEMBER_NODE_CONNECTION: {
        // host: 'devnet.setl.io',
        // host: 'uk-lon-li-006.opencsd.io',
        // host: 'staging.iznes.io',
        host: window.location.hostname,
        // host: '10.0.1.106', // Ming's Socket Server
        // host: '10.0.1.163',  // Ollie's Socket Server
        // host: '10.0.1.176', // Dan's Socket Server
        // host: '10.0.1.175', // Mat's Socket Server
        port: 9788,
        path: 'db'
    },
    numberDivider: 100000,
    menuSpec,
    reportingNodeUrl: 'http://10.0.1.106:13544/sapi',
    messagesMenu: [
        {
            name: 'Inbox',
            desc: 'View your global inbox',
            icon: 'fa-inbox',
            type: 'inbox',
            active: true
        },
        {
            name: 'Actions',
            desc: 'Messages that require actions',
            icon: 'fa-rocket',
            type: 'action',
            active: false
        },
        {
            name: 'Sent Messages',
            desc: 'Messages sent by your account',
            icon: 'fa-envelope-o',
            type: 'sent',
            active: false
        },
        {
            name: 'Deleted Messages',
            desc: 'View messages that you deleted',
            icon: 'fa-trash-o',
            type: 'deleted',
            active: false
        },
    ],
    logoUrl: 'assets/images/logo-iznes.png',
    logoID: 'logo-iznes'
};
