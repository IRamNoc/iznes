export interface SiteSettingsState {
    version: string;
    language: string;
    menuShown: boolean;
    production: boolean;
    siteMenu: object;
    forceTwoFactor: boolean;
    menuCollapsed: boolean;
}
