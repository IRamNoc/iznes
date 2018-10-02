import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { SagaHelper, LogService } from '@setl/utils';
import { ToasterService, Toast } from 'angular2-toaster';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { take } from 'rxjs/operators';
import { debounce } from 'lodash';

import {
    /* Useradmin. */
    SET_ADMIN_USERLIST,
    UPDATE_ADMIN_USERLIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_MENU_PERMISSION_GROUP_LIST,
    SET_MANAGED_WALLETS,
    SET_WALLET_ADDED,
    SET_WALLET_UPDATED,
    SET_WALLET_DELETED,
    SET_OWN_WALLETS,
    SET_WALLET_LABEL_UPDATED,

    /* My details. */
    SET_USER_DETAILS,

    /* Manage members. */
    SET_MANAGE_MEMBER_LIST,
    SET_ACCOUNT_LIST,
    clearRequestedMailList,
    clearRequestedMailInitial,
    setRequestedMailList,
    setRequestedMailInitial,

    setRequestedMyChainAccess,
    SET_MY_CHAIN_ACCESS,
    SET_WALLET_DIRECTORY,
} from '@setl/core-store';
import { MyWalletsService } from '@setl/core-req-services/my-wallets/my-wallets.service';
import { ChainService } from '@setl/core-req-services/chain/service';

@Injectable()
export class ChannelService {

    @select(['user', 'authentication', 'changedPassword']) checkChangedPassword;

    constructor(
        private alertsService: AlertsService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private myWalletsService: MyWalletsService,
        private logService: LogService,
        private chainService: ChainService) {
    }

    checkIfPasswordChanged() {
        this.checkChangedPassword
            .pipe(
                take(1),
            )
            .subscribe(
                (changedPassword) => {
                    this.logService.log(changedPassword);

                    if (!changedPassword) {
                        this.alertsService.create('warning', `
                            The password for this account has been changed! Logging out in 5 seconds.`);
                        setTimeout(
                            () => {
                                document.location.reload(true);
                            },
                            5000,
                        );
                    }
                },
            );
    }

    /**
     * Resolve Channel Message
     * Works out what data has been emitted on the channel and dispatches the correct saga event.
     *
     * @param {data} object - an object detailing an update that needs to happen to the store.
     *
     * @return {void}
     */
    public resolveChannelMessage(data: any): void {
        /* Parse the data. */
        data = JSON.parse(data);

        /* The Hench Switch Statement of Channels. */
        this.logService.log(' |--- Resolving Core channel broadcast.');
        this.logService.log(' | name: ', data.Request);
        this.logService.log(' | data: ', data);

        switch (data.Request) {
        case 'nu': // new user
        case 'udu': // update user
            this.ngRedux.dispatch(
                {
                    type: UPDATE_ADMIN_USERLIST,
                    payload: [null, data, null],
                },
            );
            break;
        case 'du': // delete user
            /* Let's get the new user object. */
            this.logService.log(' | NEW USERS LIST: ', data);

            /* Let's now dispatch the append action. */
            this.ngRedux.dispatch(
                {
                    type: SET_ADMIN_USERLIST,
                    payload: [null, data, null],
                },
            );

            break;

        case 'ud': // update details
            this.logService.log(' | UPDATE USERDETAILS: ', data);

            /* Let's now dispatch the append acion. */
            this.ngRedux.dispatch(
                {
                    type: SET_USER_DETAILS,
                    payload: [null, data, null],
                },
            );
            break;

        case 'setpassword':
            this.logService.log(' | UPDATE USER PASSWORD: ', data);

            this.checkIfPasswordChanged();

            break;

        case 'ng': // new group
        case 'upg': // update permissions group
        case 'dpg': // delete permissions group
            this.logService.log(' | UPDATE PERMISSION GROUPS: ', data);

            /* Let's now dispatch the admin action. */
            this.ngRedux.dispatch(
                {
                    type: SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
                    payload: [null, data, null],
                },
            );

            /* and the tx action. */
            this.ngRedux.dispatch(
                {
                    type: SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
                    payload: [null, data, null],
                },
            );

            /* and the menu action. */
            this.ngRedux.dispatch(
                {
                    type: SET_MENU_PERMISSION_GROUP_LIST,
                    payload: [null, data, null],
                },
            );
            break;

        case 'nw': // new wallet
            this.logService.log(' | NEW WALLET ADDED: ', data);

            this.ngRedux.dispatch(
                {
                    type: SET_WALLET_ADDED,
                    payload: [null, data, null],
                },
            );
            break;
        case 'udw': // update wallet
            this.logService.log(' | UPDATED WALLET: ', data);

            this.ngRedux.dispatch(
                {
                    type: SET_WALLET_UPDATED,
                    payload: [null, data, null],
                },
            );
            break;

        case 'dw': // delete wallet
            this.logService.log(' | DELETED WALLET: ', data);

            this.ngRedux.dispatch(
                {
                    type: SET_WALLET_DELETED,
                    payload: [null, data, null],
                },
            );
            break;

        case 'nm': // new member
        case 'udm': // update member
        case 'dm': // delete member
            this.logService.log(' | Update Manage Member list: ', data);

            /* ...and dispatch the update action. */
            this.ngRedux.dispatch(
                {
                    type: SET_MANAGE_MEMBER_LIST,
                    payload: [null, data, null],
                },
            );
            break;

        case 'na': // new account (group)
        case 'uda': // update account (group)
        case 'da': // delete account (group)
            this.logService.log(' | Update Account (Group) list: ', data);

            /* ...and dispatch the update action. */
            this.ngRedux.dispatch(
                {
                    type: SET_ACCOUNT_LIST,
                    payload: [null, data, null],
                },
            );
            break;

        case 'uduwp': // update user wallet permissions
            this.logService.log(' | UPDATE USER WALLET PERMISSION: ');

            const asyncTaskPipesDirectory = this.myWalletsService.requestWalletDirectory();

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_WALLET_DIRECTORY],
                [],
                asyncTaskPipesDirectory,
                {},
            ));

            /* Retrieve wallets (as the admin does not know our wallet list). */
            const asyncTaskPipesWallets = this.myWalletsService.requestOwnWallets();

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_OWN_WALLETS],
                [],
                asyncTaskPipesWallets,
                {},
            ));

            /* Set the state flag to true. so we do not request it again. /*
            this.ngRedux.dispatch(setRequestedMyChainAccess());

            /* Request the list. */
            const asyncTaskPipeAccess = this.chainService.requestMyChainAccess();

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_MY_CHAIN_ACCESS],
                [],
                asyncTaskPipeAccess,
                {},
            ));

            break;

        case 'email_send': // send email
            /* Request new emails. */
            this.ngRedux.dispatch(clearRequestedMailInitial());
            this.ngRedux.dispatch(clearRequestedMailList());

            this.popNewMail();
            break;

        case 'email_mark_read': // email read
        case 'email_mark_isdelete': // email deleted
            this.ngRedux.dispatch(clearRequestedMailInitial());

            break;

        case 'uw': // update wallets
            this.ngRedux.dispatch(
                {
                    type: SET_OWN_WALLETS,
                    payload: [null, data, null],
                },
            );
            break;

        case 'updatewalletlabels':
            this.ngRedux.dispatch(
                {
                    type: SET_WALLET_LABEL_UPDATED,
                    payload: [null, data, null],
                },
            );
            break;
        default:
            break;
        }
    }

    popNewMail = debounce(
        () => {
            const toast: Toast = { type: 'info', title: 'New message received', toastId: 'new_mail' };
            this.toasterService.clear('new_mail');
            this.toasterService.pop(toast);
        },
        1000,
    );
}
