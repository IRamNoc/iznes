// Vendor
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {fromJS} from 'immutable';
import {select, NgRedux} from '@angular-redux/store';

// Internal
import {
    AccountsService
} from '@setl/core-req-services';
import {
    setRequestedAccountList,
    SET_ACCOUNT_LIST
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper} from '@setl/utils';

@Component({
    selector: 'app-manage-account',
    templateUrl: './component.html'
})

export class ManageAccountComponent implements OnInit {
    tabsControl: Array<object>;
    accountList: Array<object>;

    @select(['account', 'accountList', 'accountList']) accountListOb;
    @select(['account', 'requestedAccountList']) requestedAccountListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private accountService: AccountsService) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                userId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Account',
                userId: -1,
                formControl: new FormGroup(
                    {
                        username: new FormControl(''),
                        email: new FormControl(''),
                        accountType: new FormControl([]),
                        userType: new FormControl([]),
                        password: new FormControl('')
                    }
                ),
                active: false
            }
        ];

        this.accountListOb.subscribe((accountList) => this.updateAccountList(accountList));
        this.requestedAccountListOb.subscribe((requestedState) => this.requestAccountList(requestedState));
    }

    updateAccountList(accountList) {
        this.accountList = accountList;

        const accountListImu = fromJS(accountList);
        this.accountList = accountListImu.reduce(function (result, thisAccount) {
            result.push(thisAccount.toJS());
            return result;
        }, []);
    }

    requestAccountList(requestedState) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedAccountList());

            // Request the list.
            const asyncTaskPipe = this.accountService.requestAccountList();

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_ACCOUNT_LIST],
                [],
                asyncTaskPipe,
                {}
            ));
        }
    }

    ngOnInit() {
    }
}
