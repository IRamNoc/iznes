import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

/**
 * A service to keep a history of the previous URL.
 *
 * Currently used to determine where we came from on the IZNES share authorisation component.
 */
@Injectable()
export class HistoryService {
    private _previousUrl = '';
    private currentUrl = '';
    constructor(router: Router) {
        router
            .events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                this._previousUrl = this.currentUrl;
                this.currentUrl = e.url;
            });
    }

    previousUrl() {
        return this._previousUrl;
    }
}
