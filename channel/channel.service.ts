import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';

import {
    /* Useradmin */
    SET_ADMIN_USERLIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_MANAGED_WALLETS,

    /* My details */
    SET_USER_DETAILS,

    /* Manage members. */
    SET_MANAGE_MEMBER_LIST,
    SET_ACCOUNT_LIST,
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
        console.log(" |--- Resolving Core channel broadcast.");
        console.log(" | name: ", data.Request);
        console.log(" | data: ", data);
        switch (data.Request) {
            case 'nu': // new user
            case 'udu': // update user
            case 'du': // delete user
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

            case 'ud': // update details
                console.log(' | UPDATE USERDETAILS: ', data);

                /* Let's now dispatch the append acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_USER_DETAILS,
                        payload: [ null, data, null ]
                    }
                );
                break;

            case 'setpassword': // guess...
                console.log(' | UPDATE USER PASSWORD: ', data);
                console.log(this.changedPassword);
                if (this.changedPassword !== true){
                    document.location.reload(true);
                }
                break;


            case 'ng': // new group
            case 'upg': // update permissions group
            case 'dpg': // delete permissions group
                console.log(' | UPDATE PERMISSION GROUPS: ', data);

                /* Let's now dispatch the admin acion. */
                this.ngRedux.dispatch(
                    {
                        type: SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
                        payload: [ null, data, null ]
                    }
                );

                /* and the tx action. */
                this.ngRedux.dispatch(
                    {
                        type: SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
                        payload: [ null, data, null ]
                    }
                );
                break;

            case 'nw': // new wallet
            case 'udw': // update wallet
            case 'dw': // delete wallet
                console.log(' | UPDATE MANAGE WALLET LIST: ', data);

                /* ...and dispatch the update action. */
                this.ngRedux.dispatch(
                    {
                        type: SET_MANAGED_WALLETS,
                        payload: [ null, data, null ]
                    }
                );
                break;


            case 'nm': // new member
            case 'udm': // update member
            case 'dm': // delete member
                console.log(' | Update Manage Member list: ', data);

                /* ...and dispatch the update action. */
                this.ngRedux.dispatch(
                    {
                        type: SET_MANAGE_MEMBER_LIST,
                        payload: [ null, data, null ]
                    }
                );
                break;

            case 'na': // new account (group)
            case 'uda': // update account (group)
            case 'da': // delete account (group)
                console.log(' | Update Account (Group) list: ', data);

                /* ...and dispatch the update action. */
                this.ngRedux.dispatch(
                    {
                        type: SET_ACCOUNT_LIST,
                        payload: [ null, data, null ]
                    }
                );
                break;

            default:
                break;
        }
    }

}
