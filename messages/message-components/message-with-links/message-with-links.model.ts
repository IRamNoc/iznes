export interface LinkConfig {
    link: string;
    anchorCss: string;
    anchorText: string;
    permissionName: string;
    permissionType: string;
}

export interface MessageWithLinksConfig {
    data: {
        links: LinkConfig[];
    };
}
