import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-account-admin-crud-base',
    templateUrl: 'component.html',
})
export class AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    entityId: number;
    mode: 0 | 1; // 0 - create, 1 - update
    noun: string;

    private subscriptions: Subscription[];

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     *
     * @param noun string
     * @param route ActivatedRoute
     */
    constructor(private route: ActivatedRoute,
                private redux: NgRedux<any>) {}

    ngOnInit() {
        this.processParams();
        this.initSubscriptions();
    }

    private processParams(): void {
        this.route.paramMap.subscribe((params) => {
            this.entityId = parseInt(params.get('id'), undefined);

            if (this.entityId) {
                this.mode = 1;
                return;
            }

            this.mode = 0;
        });
    }

    private initSubscriptions(): void {
        //
    }

    isCreateMode(): boolean {
        return this.mode === 0;
    }

    isUpdateMode(): boolean {
        return this.mode === 1;
    }

    getBackUrl(): string {
        return `/account-admin/${this.noun.toLowerCase()}s`;
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }
}
