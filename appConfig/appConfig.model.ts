export interface MenuItem {
    label: string;
    label_txt: string;
    icon_class: string;
    element_id: string;
    router_link?: string;
    dynamic_link?: string;
    children?: Array<MenuItem>;
}

export interface MenuSpec {
    top: {
        profile: {
            [userType: string]: Array<MenuItem>;
        }
    };
    side: {
        [userType: string]: Array<MenuItem>;
    };
    disabled?: Array<string>;
    hidden?: {
        [userType: string]: Array<String>;
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
    messagesMenu: Array<MessagesMenuItem>;
    logoUrl: string;
    logoID: string;
    platform: string;
    platformLegal?: string;
    topbarLogoUrl: string;
    applyRestrictUrl?: boolean;
    internalMessageSender?: string;
}

export interface MessagesMenuItem {
    name: string;
    desc: string;
    level: number;
    icon: string;
    type: string;
    active: boolean;
}
