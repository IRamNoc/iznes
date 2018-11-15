import { Component, OnInit, OnDestroy } from '@angular/core';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    template: '<router-outlet></router-outlet>'
})
export class MyRequestsContainerComponent implements OnInit, OnDestroy {
    @select(['ofi', 'ofiKyc', 'myKycList', 'requested']) myKycListRequested$;

    private unsubscribe: Subject<any> = new Subject();

    constructor(
        private ofiKycService: OfiKycService
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.myKycListRequested$
            .pipe(
                filter(requested => !requested),
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => {
                this.getRequests();
            });
    }

    getRequests() {
        this.ofiKycService.getMyKycList();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
