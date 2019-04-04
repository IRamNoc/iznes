export interface MenuItem {
    label: string;
    label_txt: string;
    icon_class: string;
    element_id: string;
    router_link?: string;
    dynamic_link?: string;
    children?: MenuItem[];
}

export interface MenuSpec {
    top: {
        profile: {
            [userType: string]: MenuItem[];
        },
    };
    side: {
        [userType: string]: MenuItem[];
    };
    disabled?: string[];
    hidden?: {
        [userType: string]: String[];
    };
}

interface MemberNodeConnection {
    host: string;
    port: number;
    path: string;
}

type RegStr = string;

export interface AppConfig {
    production: boolean;
    MEMBER_NODE_CONNECTION: MemberNodeConnection;
    numberDivider: 1;
    menuSpec: MenuSpec;
    nonMenuLink?: RegStr[];
    reportingNodeUrl: string;
    messagesMenu: MessagesMenuItem[];
    logoUrl: string;
    logoLightUrl: string;
    logoID: string;
    platform: string;
    platformLegal?: string;
    platformLabel?: string;
    applyRestrictUrl?: boolean;
    internalMessageSender?: string;
    backgroundImage: string;
    loginOverlay?: boolean;
    loginOverlayColour?: string;
    loginContent?: {
        title?: string,
        description?: string,
        btn?: {
            text: string,
            urlEN: string,
            urlFR: string,
        },
    };
    topNavBarColour?: string;
}

export interface MessagesMenuItem {
    name: string;
    desc: string;
    level: number;
    icon: string;
    type: string;
    active: boolean;
}
