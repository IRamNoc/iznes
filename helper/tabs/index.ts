import {ClrTabs} from '@clr/angular';

export class ClrTabsHelper {
    static getActiveTab(tabsRef: ClrTabs): number {
        return tabsRef.tabLinkDirectives.toArray().findIndex(x => x.active);
    }

    static setActiveTab(tabsRef: ClrTabs, newTabIndex: number): void {
        tabsRef.tabLinkDirectives.forEach((tab, index) => {
            if(index === newTabIndex) tab.activate();
        });
    }
}