/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
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
    type: string,
    walletid: number,
}

@Injectable()
export class OfiUserTourService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedUserTours(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (boolValue) {
            ngRedux.dispatch(ofiSetUserToursRequested());
        } else {
            ngRedux.dispatch(ofiClearUserToursRequested());
        }
    }

    static defaultRequestUserTours(OfiUserTourService, ngRedux: NgRedux<any>, datas) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetUserToursRequested());

        // Request the list.
        const asyncTaskPipe = OfiUserTourService.getUserTours(datas);

        ngRedux.dispatch({
            type: 'RUN_ASYNC_TASK',
            successTypes: [OFI_SET_USER_TOURS],
            failureTypes: [],
            descriptor: asyncTaskPipe,
            args: {},
            successCallback : (response)=>true,
            failureCallback : (response)=>true,
        });
    }

    getUserTours(data: usertourDatas): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'getuserpreference',
            token: this.memberSocketService.token,
            type: data.type,
            walletid: data.walletid,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveUserTour(data): any {

        const messageBody: OfiUsertoursRequestBody = {
            RequestName: 'newuserpreference',
            token: this.memberSocketService.token,
            type: data.type,
            value: data.value,
            walletid: data.walletid,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
