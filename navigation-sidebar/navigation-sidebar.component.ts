import {Component, OnInit, AfterViewInit, Inject, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {getMyDetail} from '@setl/core-store';
import {MultilingualService} from '@setl/multilingual/multilingual.service';
import {immutableHelper} from '@setl/utils';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.css']
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {

    public unreadMessages;
    menuJson: any;

    private subscription: any;

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;

    constructor(private router: Router,
        @Inject(APP_CONFIG) public appConfig: AppConfig,
        private _changeDetectorRef: ChangeDetectorRef,
        private multilingualService: MultilingualService,
        private ngRedux: NgRedux<any>) { }

    ngOnInit() {
        /* Subscribe for language change. */
        this.subscription = this.multilingualService.getLanguage.subscribe((data) => {
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;
            const userTypeStr = {
                '15': 'system_admin',
                '25': 'chain_admin',
                '35': 'member_user',
                '36': 'am',
                '45': 'standard_user',
                '46': 'investor',
                '47': 'valuer',
                '48': 'custodian',
                '49': 'cac',
                '50': 'registrar',
                '60': 't2s',
            }[userType];
            this.menuJson = this.translateMenu(this.appConfig.menuSpec[userTypeStr]);

            this._changeDetectorRef.detectChanges();
        });

    }

    ngAfterViewInit() {

        this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.unreadMessages = unreadMessages;
            }
        );
    }

    translateMenu(rawMenuData) {
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
     * Returns whether a string in in the ac
     * @param  {route}  - string
     * @return {active} - boolean
     */
    public activeRoute(route): boolean {
        return !!(this.router.url.indexOf(route) !== -1);
    }

}
