/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
/* Import actions. */
import {
    SET_USER_TOURS,
    setUserToursRequested,
    clearUserToursRequested,
} from '@setl/core-store/usertour/usertour/actions';

/* Import interfaces for message bodies. */
import {
    MemberNodeBody,
    UsertoursRequestBody,
} from './model';

interface usertourDatas {
    type: string,
    walletid: number,
}

@Injectable()
export class UserTourService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedUserTours(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (boolValue) {
            ngRedux.dispatch(setUserToursRequested());
        } else {
            ngRedux.dispatch(clearUserToursRequested());
        }
    }

    static defaultRequestUserTours(UserTourService, ngRedux: NgRedux<any>, datas) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setUserToursRequested());

        // Request the list.
        const asyncTaskPipe = UserTourService.getUserTours(datas);

        ngRedux.dispatch({
            type: 'RUN_ASYNC_TASK',
            successTypes: [SET_USER_TOURS],
            failureTypes: [],
            descriptor: asyncTaskPipe,
            args: {},
            successCallback : (response)=>true,
            failureCallback : (response)=>true,
        });
    }

    getUserTours(data: usertourDatas): any {

        const messageBody: MemberNodeBody = {
            RequestName: 'getuserpreference',
            token: this.memberSocketService.token,
            type: data.type,
            walletid: data.walletid,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveUserTour(data): any {

        const messageBody: UsertoursRequestBody = {
            RequestName: 'newuserpreference',
            token: this.memberSocketService.token,
            type: data.type,
            value: data.value,
            walletid: data.walletid,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
