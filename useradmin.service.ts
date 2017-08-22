import {Injectable} from '@angular/core';

import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';

import {
    AdminUsersService
} from '@setl/core-req-services';

import {
    SET_ADMIN_USERLIST,
    getAuthentication
} from '@setl/core-store';

@Injectable()
export class UserAdminService {

    /* Properties. */

    /* Account types. */
    public accountTypes:any = [
        {
            'id': '1',
            'text': 'SETL Private Admin',
        },
        {
            'id': '2',
            'text': 'Developement_Admin_Account',
        },
    ];

    /* Wallet Types. */
    public walletTypes:any = [
        {
            'id': '1',
            'text': 'Legal Entity',
        },
        {
            'id': '2',
            'text': 'Individual',
        },
        {
            'id': '3',
            'text': 'Other',
        },
    ];

    /* User Types. */
    public userTypes:any = [
        {
            'id': '15',
            'text': 'System Admin',
        },
        {
            'id': '25',
            'text': 'Chain Admin',
        },
        {
            'id': '26',
            'text': 'SGP Admin',
        },
        {
            'id': '27',
            'text': 'Bank',
        },
        {
            'id': '36',
            'text': 'Investor Admin',
        },
        {
            'id': '46',
            'text': 'Investor with KYC',
        },
        {
            'id': '47',
            'text': 'Investor without KYC',
        },
    ];

    /* Group Types. */
    public groupTypes:any = [
        {
            'id': '1',
            'text': 'Administrative',
        },
        {
            'id': '2',
            'text': 'Transactional',
        }
    ];

    public usersList:{};

    /* Constructor. */
    constructor (
        private adminUsersService:AdminUsersService,
        private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */

        /* This gets the data... */
        const asyncTaskPipe = this.adminUsersService.requestMyUsersList();

        // Send a saga action to save data.
        // Actions to dispatch, when request success:  SET_ADMIN_USERLIST.
        // Actions to dispatch, when request fail:  None.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_ADMIN_USERLIST],
                [],
                asyncTaskPipe,
                {}
            )
        );

        /* Assign a update handler to watch changes in redux, then trigger once
           manually. */
        // setTimeout(() => {
            ngRedux.subscribe(() => this.updateState());
            this.updateState();
        // })


        // return false;
    }

    /**
     * Update State
     * Handles the updating of objects on this service when redux updates.
     *
     * @return {void}
     */
    private updateState () {
        console.log('Updated something in redux.');
        /* Retrieve the user list from the redux store. */
        const newState = this.ngRedux.getState();
        console.log(getAuthentication(newState));
        console.log(newState)
    }

    /**
     * Get Account Types
     * Returns the account types array.
     *
     * @return {accountTypes} - array.
     */
    public getAccountTypes():any {
        /* Return the array. */
        return this.accountTypes;
    }

    /**
     * Get Wallet Types
     * Returns the wallet types array.
     *
     * @return {walletTypes} - array.
     */
    public getWalletTypes():any {
        /* Return the array. */
        return this.walletTypes;
    }

    /**
     * Get User Types
     * Returns the user types array.
     *
     * @return {userTypes} - array.
     */
    public getUserTypes():any {
        /* Return the array. */
        return this.userTypes;
    }

    /**
     * Get Group Types
     * Returns the group types array.
     *
     * @return {groupTypes} - array.
     */
    public getGroupTypes():any {
        /* Return the array. */
        return this.groupTypes;
    }

}
