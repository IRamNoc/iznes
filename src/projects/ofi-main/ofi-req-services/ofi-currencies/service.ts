import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
import { CurrencyActions } from '../../ofi-store/';
import { OfiCurrenciesRequestBody } from './model';

@Injectable()
export class OfiCurrenciesService {
    loaded: boolean;
    unSubscribe: Subject<any> = new Subject();

    // Observable
    @select(['ofi', 'ofiCurrencies', 'loaded']) loadedObs$;

    constructor(private memberSocketService: MemberSocketService, private ngRedux: NgRedux<any>) {
        this.loadedObs$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(d => this.loaded = d);
    }

    /**
     * Get the list of currencies from the backend
     */
    getCurrencyList() {
        if (this.loaded) {
            return;
        }

        const messageBody: OfiCurrenciesRequestBody = {
            RequestName: 'getcurrencylist',
            token: this.memberSocketService.token,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [CurrencyActions.LOAD_CURRENCIES],
            [],
            asyncTaskPipe,
            {},
        ));
    }
}
