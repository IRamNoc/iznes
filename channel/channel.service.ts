import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';

import {
    SET_ADMIN_USERLIST,
    SET_USER_DETAILS,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST
} from '@setl/core-store';

@Injectable()
export class ChannelService {

    constructor (
        private ngRedux: NgRedux<any>
    ) {

    }

    /**
     * Resolve Channel Message
     * Works out what data has been emitted on the channel and dispatches
     * the correct saga event.
     *
     * @param {data} object - an object detailing an update that needs to happen
     * to the store.
     *
     * @return {void}
     */
    public resolveChannelMessage(data: any): void {
        /* Parse the data. */
        data = JSON.parse( data );

        // The Hench Switch Statement of Channels.
        console.log(" | Resolving request name: ", data.Request);
        switch (data.Request) {
            case 'nu':
            case 'udu':
                /* Let's get the new user object. */
                console.log(' | NEW USERS LIST: ', data);

                /* Let's now dispatch the append acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_ADMIN_USERLIST,
                        payload: [ null, data, null ]
                    }
                );

                break;

            case 'ud':
                console.log(' | UPDATE USERDETAILS: ', data);

                /* Let's now dispatch the append acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_USER_DETAILS,
                        payload: [ null, data, null ]
                    }
                );
                break;

            case 'ng':
            case 'upg':
            case 'dpg':
                console.log(' | UPDATE PERMISSION GROUPS: ', data);

                /* Let's now dispatch the admin acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
                        payload: [ null, data, null ]
                    }
                );

                /* and the tx action. */
                /* Let's now dispatch the append acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
                        payload: [ null, data, null ]
                    }
                );
                break;
            default:
                break;
        }

        // import every update action from core redux
    }

}
