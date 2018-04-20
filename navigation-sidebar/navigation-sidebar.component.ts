import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import {APP_CONFIG, AppConfig, immutableHelper} from '@setl/utils';
import {getMyDetail} from '@setl/core-store';
import {MultilingualService} from '@setl/multilingual/multilingual.service';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.scss']
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {

    public unreadMessages;
    menuJson: any;
    menuParent = [];
    menuParentOpen: string;
    disableMenu: boolean;

    private subscription: any;

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'authentication', 'defaultHomePage']) defaultHomePage;

    constructor(private router: Router,
                @Inject(APP_CONFIG) public appConfig: AppConfig,
                private _changeDetectorRef: ChangeDetectorRef,
                private multilingualService: MultilingualService,
                private ngRedux: NgRedux<any>) {
    }

    ngOnInit() {
        /* Subscribe for language change. */
        this.subscription = this.multilingualService.getLanguage.subscribe((data) => {
            /* Retrieve and declare data... */
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;

            /* Figure out what user we are, in a cool way. */
            const userTypeStr = {
                '15': 'system_admin',
                '25': 'chain_admin',
                '27': 'bank',
                '35': 'member_user',
                '36': 'am',
                '45': 'standard_user',
                '46': 'investor',
                '47': 'valuer',
                '48': 'custodian',
                '49': 'cac',
                '50': 'registrar',
                '60': 't2s',
                '65': 'rooster_operator',
            }[userType];
            if (!userTypeStr) {
                console.warn('Navigation Render: Missing user type!');
            }

            console.log('menuSpec', this.appConfig.menuSpec, userTypeStr);
            /* Translate the menu. */
            this.menuJson = this.translateMenu(this.appConfig.menuSpec.side[userTypeStr]);
            if (!this.menuJson) {
                console.warn('Navigation Render: No menu structure found!');
            }

            this.menuJson && this.menuJson.forEach((row) => {
                if (row['children'] != null) this.menuParent.push(row['element_id']);
            });
        });

    }

    ngAfterViewInit() {

        this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.unreadMessages = unreadMessages;
            }
        );
        this.defaultHomePage.subscribe(
            (homePage) => {
                this.disableMenu = (homePage != null && homePage != '/home');
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    translateMenu(rawMenuData) {
        if (!rawMenuData) return;

        return immutableHelper.reduce(rawMenuData, (result, item) => {
            const mltag = item.get('label_txt', '');
            const label = this.multilingualService.getTranslation(mltag) || item.get('label', '');
            const children_old = item.get('children', []);
            const children = immutableHelper.reduce(children_old, (childrenResult, childrenItem) => {
                const cmltag = childrenItem.get('label_txt', '');
                const clabel = this.multilingualService.getTranslation(cmltag) || childrenItem.get('label', '');
                childrenResult.push(childrenItem.set('label', clabel).toJS());
                return childrenResult;
            }, []);
            if (children.length > 0) {
                result.push(item.set('label', label).set('children', children).toJS());
            } else {
                result.push(item.set('label', label).toJS());
            }

            return result;
        }, []);
    }


    /**
     * Active Route
     * Returns true if the route tested is matching the url
     * Takes account of route params
     * @param  {string}  route - the route being tested
     * @return {boolean} active - true if the route tested is matching the url
     */
    public activeRoute(route: string, isChild: boolean = false): boolean {
        if(isChild) {
            return route === this.router.url;
        } else {
            const routeRegex = new RegExp(`^${route}(\/\S+)?`);
            return routeRegex.test(this.router.url);
        }
    }

    public menuSelected(id) {
        if (this.menuParentOpen == id) {
            this.menuParentOpen = '';
        } else if (this.menuParent.indexOf(id) !== -1) {
            this.menuParentOpen = id;
        }
    }
}
