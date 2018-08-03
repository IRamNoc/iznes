import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgRedux, select} from '@angular-redux/store';
import {find} from 'lodash';
import {ClearMyKycRequestedIds} from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request/actions';
import {ClearMyKycListRequested} from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-list/actions';

@Component({
    styleUrls: ['./my-requests.component.scss'],
    templateUrl: './my-requests.component.html'
})
export class MyRequestsComponent implements OnInit, OnDestroy {

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;

    isListDisplayed;
    kycList: Array<any>;
    subscriptions: Array<Subscription> = [];
    tabs: Array<any> = [];

    private unsubscribe: Subject<any> = new Subject();

    constructor(private ngRedux : NgRedux<any>) {
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
            })
        ;
    }

    selectedKyc(kyc){
        // [routerLink]="['/my-requests/list', {id : kyc.kycID}]"
        let kycID = kyc.kycID;
        let foundTab = find(this.tabs, ['kycID', kycID]);

        if(foundTab){
            foundTab.displayed = true;
        } else{
            this.tabs.push({
                kycID : kycID,
                companyName : kyc.companyName,
                displayed : true
            });
        }
    }

    closeTab(index){
        this.tabs = this.tabs.filter((el, i) => {
            return index !== i;
        });

        this.isListDisplayed = true;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
