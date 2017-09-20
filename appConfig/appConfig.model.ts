interface MemberNodeConntion {
    host: string;
    port: number;
    path: string;
}

export interface AppConfig {
    production: boolean;
    MEMBER_NODE_CONNECTION: MemberNodeConntion;
}
