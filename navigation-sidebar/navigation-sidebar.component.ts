import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { APP_CONFIG, AppConfig, immutableHelper, LogService } from '@setl/utils';
import { getMyDetail } from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual/multilingual.service';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';
import { get } from 'lodash';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {
    public unreadMessages;
    menuJson: any;
    menuParent = [];
    menuParentOpen: string;
    // all the menu that need to disabled.
    private disabledMenus: string[] = [];

    private subscription: any;

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'authentication', 'defaultHomePage']) defaultHomePage;

    constructor(private router: Router,
                @Inject(APP_CONFIG) public appConfig: AppConfig,
                private changeDetectorRef: ChangeDetectorRef,
                private logService: LogService,
                private menuSpecService: MenuSpecService,
                private ngRedux: NgRedux<any>,
                public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        /* Subscribe for language change. */
        this.subscription = this.translate.getLanguage.subscribe((data) => {
            /* Retrieve and declare data... */
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;

            /* Figure out what user we are, in a cool way. */
            const userTypeStr = {
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
        });
    }

    /**
     * check if menu is disable.
     *
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

    /**
     * Active Route
     * Returns true if the route tested is matching the url
     * Takes account of route params / children routes
     * @param  {string}  route - the route being tested
     * @return {boolean} active - true if the route tested is matching the url
     */
    public activeRoute(route: string): boolean {
        const routeRegex = new RegExp(`^${route}(\/\S+)?`);
        return routeRegex.test(this.router.url);
    }

    public activeChildRoute(children) {
        const routerUrl = this.router.url;
        let active = false;

        children.forEach((child) => {
            const route = child.router_link;
            const routeRegex = new RegExp(`^${route}(\/\S+)?`);

            active = active || routeRegex.test(routerUrl);
        });

        return active;
    }

    public menuSelected(id) {
        if (this.menuParentOpen == id) {
            this.menuParentOpen = '';
        } else if (this.menuParent.indexOf(id) !== -1) {
            this.menuParentOpen = id;
        }
    }
}
