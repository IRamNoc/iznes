import {menuSpec} from './menuSpec';

export const environment = {
    production: true,
    MEMBER_NODE_CONNECTION: {
        host: window.location.hostname,
        port: 443,
        path: 'db'
    },
    numberDivider: 100000,
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
    logoID: 'logo-iznes',
    menuSpec
};
