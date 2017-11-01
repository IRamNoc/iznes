import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {getMyDetail} from '@setl/core-store';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.css']
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {

    public unreadMessages;
    menuJson: any;

    appConfig: AppConfig;

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;

    constructor(private router: Router,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private ngRedux: NgRedux<any>) {
        /* Stub. */
        this.appConfig = appConfig;
    }

    ngOnInit() {
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
        }[userType];
        this.menuJson = this.appConfig.menuSpec[userTypeStr];

    }

    ngAfterViewInit() {

        this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.unreadMessages = unreadMessages;
            }
        );
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
