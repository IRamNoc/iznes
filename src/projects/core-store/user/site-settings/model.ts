export interface SiteSettingsState {
    version: string;
    language: string;
    decimalSeparator: string;
    dataSeperator: string;
    menuShown: boolean;
    production: boolean;
    siteMenu: object;
    forceTwoFactor: boolean;
    menuCollapsed: boolean;
}
