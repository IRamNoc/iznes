/* Core imports. */
import {Component} from '@angular/core';
import {
    FormsModule,
    FormControl,
    FormGroup,
    Validators,
    NgModel
} from '@angular/forms';

/* Users table. */
import {AdminWalletsTableComponent} from './subcomponents/wallets-table.component';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

class Wallet {
    name:string
    account:number
    type:number
    enabled:boolean
}

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: [ 'wallets.component.css' ],
    providers: [ UserAdminService ]
})

/* Class. */
export class AdminWalletsComponent {

    /* Properties. */
    public walletsData:any = [
        {
            'name': 'name of wallet....',
            'account': 'melons',
            'type': 'Type',
            'enabled': 'true'
        },
    ];

    /* Account types select. */
    public accountType:{
        id:string,
        text:string
    };
    public accountTypes:any;

    /* Wallet types select. */
    public walletType:{
        id:string,
        text:string
    };
    public walletTypes:any;

    /* Wallet form properties. */
    public walletName:string;

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService
    ) {
        /* Get Account Types. */
        this.accountTypes = userAdminService.getAccountTypes();

        /* Get Wallet Types. */
        this.walletTypes = userAdminService.getWalletTypes();
    }

    /**
     * Selected
     * Handles the selection of an option in ng2-select, this is bound to the
     * component.
     *
     * @param {propertyName} string - The propertyName that is on the class of
     * this component.
     *
     * @param {value} object - An object representing the selection.
     *
     * @return {void}
     */
    public selected(propertyName:string, value:any):void {
        this[propertyName] = value;
    }

    /**
     * Removed
     * Handles ng2-select being cleared.
     *
     * @param {propertyName} string - A string of the corrisponding property
     * that the select's value is bound to.
     *
     * @param {value} object - An object containing the wallet information.
     *
     * @return {void}
     */
    public removed(propertyName:string, value:object):void {
        this[propertyName] = undefined;
    }

    /**
     * Save Wallet
     * Forms a wallet object and pushes it to the wallets array.
     *
     * @param {formSubmitEvent} object - The wallet creations form's submit
     * event.
     *
     * @return {void}
     */
    public saveWallet ( formSubmitEvent ):boolean {
        formSubmitEvent.preventDefault();

        /* Check all information. */
        if ( ! this.walletName ) {
            console.warn('Missing a wallet name.');
            return;
        }
        if ( ! this.accountType || Number( this.accountType.id ) < 1 ) {
            console.warn('Missing a wallet account.');
            return;
        }
        if ( ! this.walletType || Number( this.walletType.id ) < 1 ) {
            console.warn('Missing a wallet type.');
            return;
        }

        /* Build the wallet object. */
        let wallet:Wallet = {
            'name': this.walletName,
            'type': Number( this.walletType.id ),
            'account': Number( this.accountType.id ),
            'enabled': true,
        };

        /* Push the wallet data. */
        this.walletsData.push( wallet );

        /* Clear Form. */
        this.clearForm();

        /* Return. */
        return false;
    }

    /**
     * Handle Delete
     * Handles the deletion of a wallet.
     *
     * @param {deleteWalletIndex} object - Contains the target wallet's index.
     *
     * @return {void}
     */
    public handleDelete ( deleteWalletIndex ):void {
        /* Check we have the wallet's index... */
        if ( (! deleteWalletIndex && deleteWalletIndex !== 0) || this.walletsData.length === 0 ) {
            return;
        }

        /*
            ...so we do, lets remove it from the data by setting the data to an
            array with everything before and everything after.
        */
        this.walletsData = [
            ...this.walletsData.slice(0, deleteWalletIndex),
            ...this.walletsData.slice((deleteWalletIndex + 1), this.walletsData.length)
        ];

        /* Return. */
        return;
    }

    /**
     * Handle Edit
     * Handles the editting of a wallet.
     *
     * @param {editWalletIndex} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleEdit ( editWalletIndex ):void {

        /* Return. */
        return;
    }

    /**
     * Clear Form
     * Clears the form in this component.
     *
     * @return {void}
     */
    public clearForm ():void {
        /* Set all properties to nothing. */
	this.accountType = {
	    id: undefined,
	    text: undefined
	};
	this.walletType = {
	    id: undefined,
	    text: undefined
	};
        this.walletName = "";
    }

}
