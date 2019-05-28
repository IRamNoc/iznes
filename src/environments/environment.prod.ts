import { menuSpec } from './menuSpec';
import { nonMenuLink } from './nonMenuLink';

export const environment = {
    nonMenuLink,
    menuSpec,
    production: true,
    applyRestrictUrl: true,
    MEMBER_NODE_CONNECTION: {
        host: window.location.hostname,
        port: 443,
        path: 'db',
    },
    numberDivider: 100000,
    reportingNodeUrl: '',
    messagesMenu: [
        {
            name: 'Inbox',
            desc: 'View your global inbox',
            icon: 'fa-inbox',
            type: 'inbox',
            level: 1,
            active: true,
        },
        {
            name: 'Action Messages',
            desc: 'Messages that require actions',
            icon: 'fa-rocket',
            type: 'action',
            level: 2,
            active: false,
        },
        {
            name: 'Sent Messages',
            desc: 'Messages sent by your account',
            icon: 'fa-envelope-o',
            type: 'sent',
            level: 1,
            active: false,
        },
        {
            name: 'Deleted Messages',
            desc: 'View messages that you deleted',
            icon: 'fa-trash-o',
            type: 'deleted',
            level: 1,
            active: false,
        },
    ],
    logoUrl: 'assets/images/logo-iznes-only.png',
    logoID: 'logo-iznes',
    platform: 'IZNES',
    platformLegal: 'IZNES',
    topbarLogoUrl: 'assets/images/logo-iznes-only.png',
    internalMessageSender: 'IZNES',
    backgroundImage: 'assets/images/iznes-login-bg.jpg',
    loginOverlay: false,
    topNavBarColour: '#002538',
    loginContent: {
        title: 'Investing in funds has never been so easy!',
        description: 'The pan-European platform for investment in UCITS units and recordkeeping in Blockchain ' +
        'compatible with the various distribution channels',
        btn: {
            text: 'Learn more',
            urlEN: 'https://www.iznes.io/en',
            urlFR: 'https://www.iznes.io/',
        },
    },
    walletPickerRight: true,
};
