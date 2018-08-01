/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper} from '@setl/utils';
/* Import actions. */
import {
    OFI_SET_USER_TOURS,
    ofiSetUserToursRequested,
    ofiClearUserToursRequested,
} from '../../ofi-store/ofi-usertour';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiUsertoursRequestBody,
} from './model';

interface usertourDatas {
    walletID: string,
}

@Injectable()
export class OfiUserTourService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedUserTours(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiSetUserToursRequested());
        } else {
            ngRedux.dispatch(ofiClearUserToursRequested());
        }
    }

    static defaultRequestUserTours(OfiUserTourService: OfiUserTourService, ngRedux: NgRedux<any>, walletID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetUserToursRequested());

        // Request the list.
        const asyncTaskPipe = OfiUserTourService.getUserTours(walletID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_USER_TOURS],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    getUserTours(data: usertourDatas): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getuserpreference',
            token: this.memberSocketService.token,
            walletID: data.walletID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveUserTour(): any {

        const messageBody: OfiUsertoursRequestBody = {
            RequestName: 'iznsaveutmysubportfolios',
            token: this.memberSocketService.token,
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
