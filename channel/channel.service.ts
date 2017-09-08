import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';

import {
    SET_ADMIN_USERLIST,
    SET_USER_DETAILS
} from '@setl/core-store';

@Injectable()
export class ChannelService {

    @select(['user', 'authentication', 'changedPassword']) checkChangedPassword;

    changedPassword = false;

    constructor (
        private ngRedux: NgRedux<any>
    ) {
        this.checkChangedPassword.subscribe(
            (data) => {
                this.changedPassword = data;
            }
        );
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

            case 'setpassword':
                console.log(' | UPDATE USER PASSWORD: ', data);
                console.log(this.changedPassword);
                if (this.changedPassword !== true){
                    document.location.reload(true);
                }
                break;

            default:
                break;
        }

        // import every update action from core redux
    }

}
