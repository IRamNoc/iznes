/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

/* Member socket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper, Common} from '@setl/utils';

/* Import actions. */
// import {
//
// } from '../../ofi-store';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiRequestNavList,
} from './model';

@Injectable()
export class OfiAmDashboardService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,) {
        /* Stub. */
    }

    /**
     * Build Request
     * -------------
     * Builds a request and sends it, responding when it completes.
     *
     * @param {object} options - an object of options.
     *
     * @return {Promise<any>}
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
        })
    }

}
