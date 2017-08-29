import {Injectable, Output, EventEmitter} from '@angular/core';

import {SagaHelper} from '@setl/utils';

import {NgRedux} from '@angular-redux/store';

import {
    AdminUsersService
} from '@setl/core-req-services';

import {
    SET_ADMIN_USERLIST,
    getUsersList
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
        {
            'id': '8',
            'text': 'HKEX_Admin_Account',
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

    @Output()
    public usersListEvent:EventEmitter<{}> = new EventEmitter();

    /* Constructor. */
    constructor (
        private adminUsersService:AdminUsersService,
        private ngRedux: NgRedux<any>,
    ) {
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
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    /**
     * Update State
     * ------------
     * Handles the updating of objects on this service when redux updates.
     *
     * @return {void}
     */
    private updateState () {
        /* Retrieve the user list from the redux store. */
        const newState = this.ngRedux.getState();
        this.usersList = getUsersList(newState);
        this.usersListEvent.emit(this.usersList);
    }

    public createNewUser (formState):void {
        // Create a saga pipe.
        const asyncTaskPipe = this.adminUsersService.createNewUser(
            formState
        );

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            function (data) {
                console.log(data); // success
            },
            function (data) {
                console.log(data); // error
            })
        );

        return;
    }

    public editUser (newData):void {
        // Create a saga pipe.
        const asyncTaskPipe = this.adminUsersService.editUser(
            newData
        );

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            function (data) {
                console.log(data); // success
            },
            function (data) {
                console.log(data); // error
            })
        );

        return;
    }

    /**
     * Get Account Types
     * -----------------
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
     * ----------------
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
     * --------------
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
     * ---------------
     * Returns the group types array.
     *
     * @return {groupTypes} - array.
     */
    public getGroupTypes():any {
        /* Return the array. */
        return this.groupTypes;
    }

    /**
     * Resolve Account Type
     * --------------------
     * Accepts an object that then is used to lookup the account type and return
     * a full object of it.
     *
     * @param {query} - the incomplete object of the account type.
     *
     * @return {accountType} - the complete object of the account type.
     */
    public resolveAccountType ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.id ) identifier = "id";
        if ( query.text ) identifier = "text";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for ( i = 0; i < this.accountTypes.length; i++ ) {
            /* Loop over each and check if they have the same id. */
            if ( query[identifier] === this.accountTypes[i][identifier] ) {
                return [this.accountTypes[i]];
            }
        }

        /* If nothing, just return nothing again. */
        return [];
    }

    /**
     * Resolve User Type
     * -----------------
     * Accepts an object that then is used to lookup the user type and return
     * a full object of it.
     *
     * @param {query} - the incomplete object of the user type.
     *
     * @return {userType} - the complete object of the user type.
     */
    public resolveUserType ( query ):any {
        /* Let's first check which we have. */
        let identifier = "";
        if ( query.id ) identifier = "id";
        if ( query.text ) identifier = "text";

        /* If there was nothing, return. */
        if ( identifier === "" ) {
            return [];
        }

        /* Ok, lets check if we have the account type. */
        let i;
        for ( i = 0; i < this.userTypes.length; i++ ) {
            /* Loop over each and check if they have the same id. */
            if ( query[identifier].toString() === this.userTypes[i][identifier] ) {
                return [this.userTypes[i]];
            }
        }

        /* If nothing, just return nothing again. */
        return [];
    }

}
