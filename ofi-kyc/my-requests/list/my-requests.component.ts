import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {select} from '@angular-redux/store';

@Component({
    styleUrls: ['./my-requests.component.scss'],
    templateUrl: './my-requests.component.html'
})
export class MyRequestsComponent implements OnInit, OnDestroy {

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;

    kycList: Array<any>;
    subscriptions: Array<Subscription> = [];
    tabs: Array<any> = [];

    private unsubscribe: Subject<any> = new Subject();

    constructor() {}

    ngOnInit() {
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.myKycList$.pipe(
            takeUntil(this.unsubscribe))
            .subscribe(kycList => {
                this.kycList = kycList;
            })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
