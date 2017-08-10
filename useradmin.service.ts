import {Injectable} from '@angular/core';

@Injectable()
export class UserAdminService {

    /* Properties. */

    /* Account types. */
    public accountTypes:any = [
        {
            'id': '0',
            'text': 'Select One',
        },
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
            'id': '0',
            'text': 'Select One',
        },
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
            'id': '0',
            'text': 'Select One',
        },
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
            'id': '0',
            'text': 'Select Type',
        },
        {
            'id': '1',
            'text': 'Administrative',
        },
        {
            'id': '2',
            'text': 'Transactional',
        }
    ];

    /* Constructor. */
    constructor () {
        /* Stub. */
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
