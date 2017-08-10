/* Core imports. */
import {Component} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';


/* Users table. */
import {AdminWalletsTableComponent} from './subcomponents/wallets-table.component';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

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
     * Handles the selection of an option in ng2-select, this is bound to the component.
     *
     * @param {propertyName} - string - The propertyName that is on the class of this component.
     * @param {value} - object - An object representing the selection.
     *
     * @return {void}
     */
    public selected(propertyName:string, value:any):void {
        this[propertyName] = value;
    }

    /* Handles a ng2-select deletion. */
    public removed(propertyName:string, value:any):void {
        this[propertyName] = undefined;
    }

}
