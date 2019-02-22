// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { menuSpec } from './menuSpec';
import { nonMenuLink } from './nonMenuLink';

export const environment = {
    nonMenuLink,
    menuSpec,
    production: false,
    applyRestrictUrl: true,
    MEMBER_NODE_CONNECTION: {
        host: window.location.hostname,
        port: 9788,
        path: 'db'
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
            active: true
        },
        {
            name: 'Action Messages',
            desc: 'Messages that require actions',
            icon: 'fa-rocket',
            type: 'action',
            level: 2,
            active: false
        },
        {
            name: 'Sent Messages',
            desc: 'Messages sent by your account',
            icon: 'fa-envelope-o',
            type: 'sent',
            level: 1,
            active: false
        },
        {
            name: 'Deleted Messages',
            desc: 'View messages that you deleted',
            icon: 'fa-trash-o',
            type: 'deleted',
            level: 1,
            active: false
        },
    ],
    logoUrl: 'assets/images/logo-iznes-only.png',
    logoID: 'logo-iznes',
    platform: 'IZNES',
    platformLegal: 'IZNES',
    topbarLogoUrl: 'assets/images/logo-iznes-only.png',
    internalMessageSender: 'IZNES'
};
