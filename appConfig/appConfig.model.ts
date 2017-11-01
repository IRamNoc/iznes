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

interface MemberNodeConntion {
    host: string;
    port: number;
    path: string;
}

export interface AppConfig {
    production: boolean;
    MEMBER_NODE_CONNECTION: MemberNodeConntion;
    numberDivider: 1;
    menuSpec: MenuSpec;
}
