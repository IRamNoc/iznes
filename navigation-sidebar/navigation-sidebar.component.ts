import { AfterViewInit, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { APP_CONFIG, AppConfig, immutableHelper } from '@setl/utils';
import { getMyDetail, setMenuCollapsed } from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual/multilingual.service';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
    public unreadMessages;
    public menuJson: any;
    public menuParent = [];
    public collapsed: boolean = false;
    private disabledMenus: string[] = [];
    private subscription: Subscription[] = [];

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'authentication', 'defaultHomePage']) defaultHomePage;
    @select(['user', 'siteSettings', 'menuCollapsed']) menuCollapsed;

    constructor(@Inject(APP_CONFIG) public appConfig: AppConfig,
                private menuSpecService: MenuSpecService,
                private ngRedux: NgRedux<any>,
                public translate: MultilingualService) {}

    ngOnInit() {
        /* Subscribe for language change. */
        this.subscription.push(this.translate.getLanguage.subscribe((data) => {
            /* Retrieve and declare data... */
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;

            /* Figure out what user we are, in a cool way. */
            let userTypeStr = {
                15: 'system_admin',
                25: 'chain_admin',
                27: 'bank',
                35: 'member_user',
                36: 'am',
                45: 'standard_user',
                46: 'investor',
                47: 'valuer',
                48: 'custodian',
                49: 'cac',
                50: 'registrar',
                60: 't2s',
                65: 'rooster_operator',
                66: 'rooster_ipa',
                67: 'rooster_final_custodian',
            }[userType];
            if (!userTypeStr) {
                console.warn('Navigation Render: Missing user type!');
                userTypeStr = 'ui'; // falls back to UI as default
            }

            const menuSpec = this.appConfig.menuSpec;
            /* Translate the menu. */
            this.menuJson = this.translateMenu(menuSpec.side[userTypeStr]);

            this.disabledMenus = menuSpec.disabled;
            if (!this.menuJson) {
                console.warn('Navigation Render: No menu structure found!');
            }
            this.menuJson && this.menuJson.forEach((row) => {
                if (row['children'] != null) this.menuParent.push(row['element_id']);
            });

            this.menuSpecService.getMenuSpec().subscribe((menuSpec) => {
                /* Translate the menu. */
                this.menuJson = this.translateMenu(menuSpec.side[userTypeStr]);

                this.disabledMenus = menuSpec.disabled;
                if (!this.menuJson) {
                    console.warn('Navigation Render: No menu structure found!');
                }

                this.menuJson && this.menuJson.forEach((row) => {
                    if (row['children'] != null) this.menuParent.push(row['element_id']);
                });
            });
        }));

        // Subscribe to the menuCollapsed boolean and update the property passed to the menu
        this.subscription.push(this.menuCollapsed.subscribe((collapsed) => {
            this.collapsed = collapsed;
        }));
    }

    /**
     * Dispatch a redux action to update the state of the menuCollapsed boolean
     * @param collapsed
     */
    updateCollapsed(collapsed) {
        this.ngRedux.dispatch(setMenuCollapsed(collapsed));
    }

    /**
     * Expand the Clarity vertical nav when viewport is below 768px to fix mobile nav bug
     * @param event
     */
    @HostListener('window:resize', ['$event']) expandSideNav(event) {
        if (event.srcElement.innerWidth <= 768) {
            this.ngRedux.dispatch(setMenuCollapsed(false));
        }
    }

    /**
     * Check if menu is disabled.
     * @param {string} url
     *
     * @return {boolean}
     */
    isMenuDisabled(url: string): boolean {
        return (!!this.disabledMenus) && this.disabledMenus.indexOf(url) !== -1;
    }

    ngAfterViewInit() {
        this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.unreadMessages = unreadMessages;
            },
        );
    }

    translateMenu(rawMenuData) {
        if (!rawMenuData) return;

        return immutableHelper.reduce(
            rawMenuData, (result, item) => {
                const mltag = item.get('label_txt', '');
                const label = this.translate.getTranslation(mltag) || item.get('label', '');
                const childrenOld = item.get('children', []);
                const children = immutableHelper.reduce(
                    childrenOld, (childrenResult, childrenItem) => {
                        const cmltag = childrenItem.get('label_txt', '');
                        const clabel = this.translate.getTranslation(cmltag) || childrenItem.get('label', '');
                        childrenResult.push(childrenItem.set('label', clabel).toJS());
                        return childrenResult;
                    },
                    [],
                );
                if (children.length > 0) {
                    result.push(item.set('label', label).set('children', children).toJS());
                } else {
                    result.push(item.set('label', label).toJS());
                }

                return result;
            },
            [],
        );
    }

    ngOnDestroy() {
        for (const subscription of this.subscription) {
            subscription.unsubscribe();
        }
    }
}
