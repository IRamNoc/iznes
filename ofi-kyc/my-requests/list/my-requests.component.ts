import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgRedux, select } from '@angular-redux/store';
import { findIndex } from 'lodash';
import { ClearMyKycRequestedIds } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request/actions';
import { ClearMyKycListRequested, SetMyKycOpenTab, ClearMyKycOpenTab, SetMyKycOpenTabActive } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-list/actions';

@Component({
    styleUrls: ['./my-requests.component.scss'],
    templateUrl: './my-requests.component.html'
})
export class MyRequestsComponent implements OnInit, OnDestroy {
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'myKycList', 'tabs']) openTabs$;

    isListDisplayed;
    kycList: any[];
    subscriptions: Subscription[] = [];
    tabs: any[] = [];

    private unsubscribe: Subject<any> = new Subject();

    constructor(private ngRedux: NgRedux<any>) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.ngRedux.dispatch(ClearMyKycRequestedIds());
        this.ngRedux.dispatch(ClearMyKycListRequested());
    }

    initSubscriptions() {
        this.myKycList$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(kycList => {
                this.kycList = kycList;
            });

        this.openTabs$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(openTabs => {
                this.tabs = openTabs;
            });
    }

    selectedKyc(kyc) {
        let kycID = kyc.kycID;
        let index = findIndex(this.tabs, ['kycID', kycID]);
        let action;

        if (index !== -1) {
            action = SetMyKycOpenTabActive(index);
            this.ngRedux.dispatch(action);
        } else {
            action = SetMyKycOpenTab(
                {
                    kycID: kycID,
                    companyName: kyc.companyName,
                    displayed: true,
                }
            );
            this.ngRedux.dispatch(action);
        }
    }

    closeTab(index) {
        let action = ClearMyKycOpenTab(index);
        this.ngRedux.dispatch(action);

        this.isListDisplayed = true;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
