import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper} from '@setl/utils';
import {CurrencyActions} from '../../ofi-store/';
import {OfiCurrenciesRequestBody} from './model';

@Injectable()
export class OfiCurrenciesService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    /**
     * Set or reset the flag which informs wheter currencies are already requested or not
     *
     * @param {boolean} boolValue
     * @param {NgRedux<any>} ngRedux
     */
    static setRequestedCurrencyList(boolValue: boolean, ngRedux: NgRedux<any>) {
        const action = (!boolValue) ? CurrencyActions.loadCurrencies() : CurrencyActions.resetCurrencies();

        ngRedux.dispatch(action);
    }

    /**
     * Fetch currencies list from the backend
     *
     * @param {OfiCurrenciesService} ofiCurrenciesService
     * @param {NgRedux<any>} ngRedux
     */
    static defaultRequestCurrencyList(ofiCurrenciesService: OfiCurrenciesService, ngRedux: NgRedux<any>) {
        ngRedux.dispatch(CurrencyActions.loadCurrencies());

        const asyncTaskPipe = ofiCurrenciesService.requestCurrenciesList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [CurrencyActions.GET_CURRENCIES],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Request the list of currencies
     *
     * @return {any}
     */
    requestCurrenciesList() {
        const messageBody: OfiCurrenciesRequestBody = {
            RequestName: 'getcurrencylist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
