// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromJS } from 'immutable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
// Internal
import { AccountsService, MemberService } from '@setl/core-req-services';
import { SET_ACCOUNT_LIST, SET_MANAGE_MEMBER_LIST, setRequestedAccountList, setRequestedManageMemberList }
    from '@setl/core-store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, LogService, ConfirmationService } from '@setl/utils';
import * as _ from 'lodash';

export function getManageMember(state) {
    const myMemberId = state.user.myDetail.memberId;
    const isAdmin = state.user.myDetail.admin;
    let managedMemberListImu;

    if (isAdmin) {
        return state.member.manageMemberList.memberList;
    }
    managedMemberListImu = fromJS(state.member.manageMemberList.memberList);
    return managedMemberListImu.filter((thisMember) => {
        return thisMember.get('memberId') === myMemberId;
    }).toJS();
}

@Component({
    selector: 'app-manage-account',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageAccountComponent implements OnInit, OnDestroy {
    tabsControl: any[];
    accountList: any[];
    managedMemberList: any[];
    managedMemberListObject: object;
    managedWalletList: any[];
    isSymAdmin: boolean;

    /* Rows Per Page datagrid size */
    public pageSize: number;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    // List of Redux observable.
    @select(['account', 'accountList', 'accountList']) accountListOb;
    @select(['account', 'requestedAccountList']) requestedAccountListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(getManageMember) managedMemberOb;
    @select(['user', 'myDetail', 'admin']) isSymAdminOb;
    @select(['wallet', 'managedWallets', 'walletList']) walletListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private confirmationService: ConfirmationService,
                private accountService: AccountsService,
                private memberService: MemberService,
                private changeDetectorRef: ChangeDetectorRef,
                private logService: LogService) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                accountId: -1,
                active: true,
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Account',
                accountId: -1,
                formControl: new FormGroup(
                    {
                        accountName: new FormControl('', Validators.required),
                        accountDescription: new FormControl('', Validators.required),
                        member: new FormControl([], Validators.required),
                    },
                ),
                active: false,
            },
        ];

        /* Get Account and Managed Member Lists */
        this.subscriptionsArray.push(this.accountListOb.subscribe(accountList =>
            this.updateAccountList(accountList)));
        this.subscriptionsArray.push(this.requestedAccountListOb.subscribe(requestedState =>
            this.requestAccountList(requestedState)));
        this.subscriptionsArray.push(this.requestedManagedMemberListOb.subscribe(requestedState =>
            this.requestManagedMemberList(requestedState)));
        this.subscriptionsArray.push(this.managedMemberOb.subscribe(memberList =>
            this.updateManageMemberList(memberList)));
        this.subscriptionsArray.push(this.isSymAdminOb.subscribe(isSymAdmin => this.isSymAdmin = isSymAdmin));
        this.subscriptionsArray.push(this.walletListOb.subscribe(walletList =>
            this.updateManagedWalletList(walletList)));
    }

    /**
     * Update Account List
     *
     * @param accountList
     */
    updateAccountList(accountList) {
        this.accountList = accountList;

        const accountListImu = fromJS(accountList);
        this.accountList = accountListImu.reduce(
            (result, thisAccount) => {
                const index = result.length;
                const newThisAccount = thisAccount.set('index', index);
                result.push(newThisAccount.toJS());
                return result;
            },
            [],
        );
    }

    /**
     * Update Manage Member List
     *
     * @param memberList
     */
    updateManageMemberList(memberList) {
        this.managedMemberListObject = memberList;

        const managedMemberListImu = fromJS(memberList);
        this.managedMemberList = managedMemberListImu.reduce(
            (resultList, thisMember) => {
                resultList.push({
                    id: thisMember.get('memberId'),
                    text: thisMember.get('memberName'),
                });
                return resultList;
            },
            [],
        );

        // Add account form.
        const addAccountForm = this.tabsControl[1].formControl;

        // Set default value
        if (this.managedMemberList.length > 0 && _.isEmpty(addAccountForm.value.member)) {
            addAccountForm.controls.member.setValue([this.managedMemberList[0]]);
        }
    }

    /**
     * Update Managed Wallet List
     *
     * @param walletList
     */
    updateManagedWalletList(walletList) {
        const walletListImu = fromJS(walletList);
        const walletListArr = walletListImu.reduce(
            (resultArr, thisWallet) => {
                resultArr.push({
                    id: thisWallet.get('walletId'),
                    text: thisWallet.get('walletName'),
                });

                return resultArr;
            },
            [],
        );

        this.managedWalletList = walletListArr;
    }

    /**
     * Request Managed Member List
     *
     * @param {boolean} requestedState - Redux requested flag
     */
    requestManagedMemberList(requestedState: boolean): void {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedManageMemberList());

            // Request the list.
            const asyncTaskPipe = this.memberService.requestMemberList();

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_MANAGE_MEMBER_LIST],
                [],
                asyncTaskPipe,
                {},
            ));
        }
    }

    /**
     * Request Account List
     *
     * @param requestedState - Redux requested flag
     */
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
                {},
            ));
        }
    }

    ngOnInit() {
    }

    /**
     * Handle Add new account click.
     *
     * @param {tabid} - The tab id that the form is in.
     *
     * @return {void}
     */
    handleAddAccount(tabId: number): void {
        if (this.tabsControl[tabId].formControl.valid) {
            /* Show loading modal */
            this.alertsService.create('loading');

            this.logService.log(this.tabsControl[tabId].formControl.value);

            const formValue = this.tabsControl[tabId].formControl.value;
            const accountName = formValue.accountName;
            const accountDescription = formValue.accountDescription;
            const memberId = formValue.member[0].id;

            // Create a saga pipe.
            const asyncTaskPipe = this.accountService.addAccount(
                {
                    accountName,
                    accountDescription,
                    memberId,
                },
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    this.alertsService.generate('success', 'Account has been created successfully.');
                },
                (data) => {
                    console.error('fail', data);
                    this.alertsService.generate('error', 'Failed to create account.');
                },
            ));
        }
    }

    /**
     * Handle edit account click.
     *
     * @param {tabId}
     *
     * @return {void}
     */
    handleEditAccount(tabId: number): void {
        if (this.tabsControl[tabId].formControl.valid) {
            // Show loading modal
            this.alertsService.create('loading');

            this.logService.log(this.tabsControl[tabId].formControl.value);

            const formValue = this.tabsControl[tabId].formControl.value;
            const accountId = formValue.accountId;
            const accountName = formValue.accountName;
            const description = formValue.accountDescription;
            const walletId = _.get(formValue, 'wallet[0].id', 0);

            // Create a saga pipe.
            const asyncTaskPipe = this.accountService.editAccount(
                {
                    accountId,
                    accountName,
                    description,
                    walletId,
                },
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.alertsService.generate('success', 'Account has been updated successfully.');
                    this.logService.log(data);
                },
                (data) => {
                    this.alertsService.generate('error', 'Failed to update account.');
                    this.logService.log(data);
                },
            ));
        }
    }

    /**
     * Handle edit button is clicked.
     *
     * @param index
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].accountId === this.accountList[index].accountId) {
                this.setTabActive(i);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const account = this.accountList[index];
        const accountMemberName = this.managedMemberListObject[account.parent].memberName;

        this.tabsControl.push({
            title: `<i class="fa fa-user"></i> ${account.accountName}`,
            accountId: account.accountId,
            formControl: new FormGroup(
                {
                    accountName: new FormControl(account.accountName),
                    accountId: new FormControl(account.accountId),
                    accountDescription: new FormControl(account.description),
                    memberName: new FormControl(accountMemberName),
                    wallet: new FormControl(),
                },
            ),
            active: false,
        });

        // Activate the new tab.
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle Delete click.
     *
     * @param {index} number - Contain the target account's index(not memberId).
     *
     * @return {void}
     */
    handleDelete(index: number): void {
        /* Let's now ask the user if they're sure... */
        this.confirmationService.create(
            '<span>Deleting an Account</span>',
            '<span class="text-warning">Are you sure you want to delete this account?</span>')
        .subscribe((ans) => {
            if (ans.resolved) {
                // ... they are so send the delete request
                // Show loading modal
                this.alertsService.create('loading');

                // Check if the tab is already open. If yes, close the tab.
                let i;
                const accountId = this.accountList[index].accountId;
                for (i = 0; i < this.tabsControl.length; i += 1) {
                    if (this.tabsControl[i].accountId === accountId) {
                        this.tabsControl.splice(i, 1);
                    }
                }

                // Send request to delete member.
                const asyncTaskPipe = this.accountService.deleteAccount(
                    {
                        accountId,
                    },
                );

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        this.alertsService.generate('success', 'Account has been deleted successfully.');
                        this.logService.log(data);
                    },
                    (data) => {
                        this.alertsService.generate('error', 'Failed to delete to account.');
                        this.logService.log(data);
                    },
                ));
            }
        });
    }

    /**
     * Handle close tab click.
     *
     * @param {index} number - the tab index to close.
     *
     * @return {void}
     */
    closeTab(index: number): void {
        if (!index && index !== 0) {
            return;
        }

        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
        ];

        // Reset Tabs.
        this.setTabActive(0);

        return;
    }

    /**
     * Sets a Tab to Active
     *
     * @param {number} index
     */
    setTabActive(index: number): void {
        /* Lets loop over all current tabs and switch them to not active. */
        this.tabsControl.map((i) => {
            i.active = false;
        });

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Set the list active. */
        this.tabsControl[index].active = true;

        /* Yes, we have to call this again to get it to work, trust me... */
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
