import {menuSpec} from './menuSpec';

export const environment = {
    production: true,
    MEMBER_NODE_CONNECTION: {
        host: window.location.hostname,
        port: 443,
        path: 'db'
    },
    numberDivider: 100000,
    menuSpec
};
