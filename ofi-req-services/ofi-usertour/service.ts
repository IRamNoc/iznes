/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper} from '@setl/utils';
/* Import actions. */
import {
    OFI_SET_MY_SUBPORTFOLIOS,
    ofiSetMySubportfoliosRequested,
    ofiClearMySubportfoliosRequested,
} from '../../ofi-store/ofi-usertour';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiMySubportfoliosRequestBody,
} from './model';

interface MySubportfoliosData {
    isDone: string,
}

@Injectable()
export class OfiUserTourService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedMySubportfolios(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiSetMySubportfoliosRequested());
        } else {
            ngRedux.dispatch(ofiClearMySubportfoliosRequested());
        }
    }

    static defaultRequestMySubportfolios(OfiUserTourService: OfiUserTourService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetMySubportfoliosRequested());

        // Request the list.
        const asyncTaskPipe = OfiUserTourService.requestMySubportfolios();

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MY_SUBPORTFOLIOS],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* MY SUBPORTFOLIOS */

    requestMySubportfolios(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'iznutgetmysubportfolio',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveMySubPortfolios(data: MySubportfoliosData): any {

        const messageBody: OfiMySubportfoliosRequestBody = {
            RequestName: 'iznsaveutmysubportfolios',
            token: this.memberSocketService.token,
            isDone: data.isDone,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Build Request
     * -------------
     * Builds a request and sends it, responsing when it completes.
     *
     * @param {options} Object - and object of options.
     *
     * @return {Promise<any>} [description]
     */
    public buildRequest(options): Promise<any> {
        /* Check for taskPipe,  */
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }
}
