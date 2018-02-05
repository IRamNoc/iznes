export interface MenuItem {
    label: string;
    label_txt: string;
    icon_class: string;
    element_id: string;
    router_link?: string;
    children?: Array<MenuItem>;
}

export interface MenuSpec {
    [userType: string]: Array<MenuItem>;
}

interface MemberNodeConnection {
    host: string;
    port: number;
    path: string;
}

export interface AppConfig {
    production: boolean;
    MEMBER_NODE_CONNECTION: MemberNodeConnection;
    numberDivider: 1;
    menuSpec: MenuSpec;
    reportingNodeUrl: string;
    messagesMenu: Array<MessagesMenuItem>;
    logoUrl: 'assets/images/logo-iznes.png';
    logoID: 'logo-iznes';
    topbarLogoUrl: 'assets/images/logo-iznes.png';
}

export interface MessagesMenuItem {
    name: string;
    desc: string;
    icon: string;
    type: string;
    active: boolean;
}
