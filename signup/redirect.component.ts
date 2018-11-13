import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-ofi-kyc-signup-redirect',
    template: '',
})
export class AccountSignUpRedirectComponent implements OnInit, OnDestroy {
    private routeSubscription: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.routeSubscription = this.activatedRoute.url.subscribe((urlSegments: UrlSegment[]) => {
            this.router.navigate(
                ['account-signup'],
                { queryParams: { invitationToken: urlSegments[1].path },
                });
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
