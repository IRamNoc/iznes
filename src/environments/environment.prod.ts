import {menuSpec} from './menuSpec';

export const environment = {
    production: true,
    MEMBER_NODE_CONNECTION: {
        host: window.location.hostname,
        port: 443,
        path: 'db'
    },
    numberDivider: 100000,
    menuSpec,
    messagesMenu: [
        {
            name: 'All Messages',
            desc: 'View your global inbox',
            icon: 'inbox',
            type: 'inbox',
            active: true
        },
        {
            name: 'Action Messages',
            desc: 'Messages that require actions',
            icon: 'balance',
            type: 'action',
            active: false
        },
        {
            name: 'Sent Messages',
            desc: 'Messages sent by your account',
            icon: 'pop-out',
            type: 'sent',
            active: false
        },
        {
            name: 'Deleted Messages',
            desc: 'View messages that you deleted',
            icon: 'trash',
            type: 'deleted',
            active: false
        },
    ]
};
