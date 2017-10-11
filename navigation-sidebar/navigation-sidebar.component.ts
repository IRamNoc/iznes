import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgRedux, select} from '@angular-redux/store';

@Component({
    selector: 'app-navigation-sidebar',
    templateUrl: './navigation-sidebar.component.html',
    styleUrls: ['./navigation-sidebar.component.css']
})
export class NavigationSidebarComponent implements OnInit, AfterViewInit {

    public unreadMessages;

    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;

    constructor(private router: Router) {
        /* Stub. */
    }

    ngOnInit() {
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
