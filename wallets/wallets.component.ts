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
    account:string
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
    public accountType:string;
    public accountTypes:any;

    /* Wallet types select. */
    public walletType:string;
    public walletTypes:any;

    /* Wallet creation form. */
    public createWalletForm = new FormGroup({
        'walletName': new FormControl(
            null,
            Validators.required
        ),
        'walletAccount': new FormControl(
            this.accountType,
            Validators.required
        ),
        'walletType': new FormControl(
            this.walletType,
            Validators.required
        ),
        'walletEnabled': new FormControl(
            true,
            Validators.required
        )
    })

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
     * @param {propertyName} - string - The propertyName that is on the class of
     * this component.
     * @param {value} - object - An object representing the selection.
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
     * Handle Delete
     * Handles the deletion of a wallet.
     *
     * @param {deleteWalletIndex} number - Contains the target wallet's index.
     *
     * @return {void}
     */
    public handleDelete ( deleteWalletIndex:number ):void {
        /* Check we have the wallet's index... */
        if ( ! deleteWalletIndex || isNaN(deleteWalletIndex) ) {
            return;
        }

        /*
            ...so we do, lets remove it from the data by setting the data to an
            array with everything before and everything after.
        */
        this.walletsData = [
            ...this.walletsData.slice(0, deleteWalletIndex - 1),
            ...this.walletsData.slice(deleteWalletIndex, this.walletsData.length)
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

}
