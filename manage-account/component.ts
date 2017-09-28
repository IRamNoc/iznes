// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {select, NgRedux} from '@angular-redux/store';

// Internal
import {
    AccountsService,
    MemberService
} from '@setl/core-req-services';
import {
    setRequestedAccountList,
    SET_ACCOUNT_LIST,
    setRequestedManageMemberList,
    SET_MANAGE_MEMBER_LIST
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper} from '@setl/utils';
import _ from 'lodash';

export function getManageMember(state) {

    const myMemberId = state.user.myDetail.memberId;
    const isAdmin = state.user.myDetail.admin;
    let managedMemberListImu;

    if (isAdmin) {
        return state.member.manageMemberList.memberList;
    } else {
        managedMemberListImu = fromJS(state.member.manageMemberList.memberList);
        return managedMemberListImu.filter((thisMember) => {
            return thisMember.get('memberId') === myMemberId;
        }).toJS();
    }
}

@Component({
    selector: 'app-manage-account',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageAccountComponent implements OnInit {
    tabsControl: Array<any>;
    accountList: Array<any>;
    managedMemberList: Array<any>;
    managedMemberListObject: object;
    managedWalletList: Array<any>;
    isSymAdmin: boolean;

    // List of observable subscription
    subscriptionsArry: Array<Subscription> = [];

    // List of Redux observable.
    @select(['account', 'accountList', 'accountList']) accountListOb;
    @select(['account', 'requestedAccountList']) requestedAccountListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(getManageMember) managedMemberOb;
    @select(['user', 'myDetail', 'admin']) isSymAdminOb;
    @select(['wallet', 'managedWallets', 'walletList']) walletListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private accountService: AccountsService,
                private memberService: MemberService,
                private changeDetectorRef: ChangeDetectorRef) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                accountId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Account',
                accountId: -1,
                formControl: new FormGroup(
                    {
                        accountName: new FormControl('', Validators.required),
                        accountDescription: new FormControl('', Validators.required),
                        member: new FormControl([])
                    }
                ),
                active: false
            }
        ];

        this.subscriptionsArry.push(this.accountListOb.subscribe((accountList) => this.updateAccountList(accountList)));
        this.subscriptionsArry.push(this.requestedAccountListOb.subscribe((requestedState) => this.requestAccountList(requestedState)));
        this.subscriptionsArry.push(this.requestedManagedMemberListOb.subscribe((requestedState) => this.requestManagedMemberList(requestedState)));
        this.subscriptionsArry.push(this.managedMemberOb.subscribe((memberList) => this.updateManageMemberList(memberList)));
        this.subscriptionsArry.push(this.isSymAdminOb.subscribe(isSymAdmin => this.isSymAdmin = isSymAdmin));
        this.subscriptionsArry.push(this.walletListOb.subscribe(walletList => this.updateManagedWalletList(walletList)));

    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArry) {
            subscription.unsubscribe();
        }
    }

    updateAccountList(accountList) {
        this.accountList = accountList;

        const accountListImu = fromJS(accountList);
        this.accountList = accountListImu.reduce(function (result, thisAccount) {
            const index = result.length;
            const newThisAccount = thisAccount.set('index', index)
            result.push(newThisAccount.toJS());
            return result;
        }, []);
    }

    updateManageMemberList(memberList) {
        this.managedMemberListObject = memberList;

        const managedMemberListImu = fromJS(memberList);
        this.managedMemberList = managedMemberListImu.reduce(function (resultList, thisMember) {
            resultList.push({
                id: thisMember.get('memberId'),
                text: thisMember.get('memberName')
            });
            return resultList;
        }, []);

        // Add account form.
        const addAccountForm = this.tabsControl[1].formControl;

        // Set default value
        if (this.managedMemberList.length > 0 && addAccountForm.value.member.length === 0) {
            addAccountForm.controls.member.setValue([this.managedMemberList[0]]);
        }
    }

    updateManagedWalletList(walletList) {
        const walletListImu = fromJS(walletList);
        const walletListArr = walletListImu.reduce(
            (resultArr, thisWallet) => {
                resultArr.push({
                    id: thisWallet.get('walletId'),
                    text: thisWallet.get('walletName')
                });

                return resultArr;
            }, []
        );

        this.managedWalletList = walletListArr;
    }

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
                {}
            ));

        }
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

    /**
     * Handle Add new account click.
     *
     * @param {tabid} - The tab id that the form is in.
     *
     * @return {void}
     */
    handleAddAccount(tabId: number): void {

        if (this.tabsControl[tabId].formControl.valid) {
            console.log(this.tabsControl[tabId].formControl.value);

            const formValue = this.tabsControl[tabId].formControl.value;
            const accountName = formValue.accountName;
            const accountDescription = formValue.accountDescription;
            const memberId = formValue.member[0].id;


            // Create a saga pipe.
            const asyncTaskPipe = this.accountService.addAccount(
                {
                    accountName,
                    accountDescription,
                    memberId
                }
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.showSuccessResponse('Account is created');
                },
                (data) => {
                    this.showErrorResponse(data);
                }
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
            console.log(this.tabsControl[tabId].formControl.value);


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
                    walletId
                }
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.showSuccessResponse('Account is updated');
                    console.log(data);
                },
                (data) => {
                    this.showErrorResponse(data);
                    console.log(data);
                }
            ));
        }
    }

    /**
     * Handle edit button is clicked.
     * @param index
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].accountId === this.accountList[index].accountId) {
                this.setTabActive(i);

                return;
            }
        }

        /* Push the edit tab into the array. */
        const account = this.accountList[index];
        const accountMemberName = this.managedMemberListObject[account.parent].memberName;

        this.tabsControl.push({
            title: '<i class="fa fa-user"></i> ' + account.accountName,
            accountId: account.accountId,
            formControl: new FormGroup(
                {
                    accountName: new FormControl(account.accountName),
                    accountId: new FormControl(account.accountId),
                    accountDescription: new FormControl(account.description),
                    memberName: new FormControl(accountMemberName),
                    wallet: new FormControl()
                }
            ),
            active: false
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

        // Check if the tab is already open.
        // If yes, close the tab.
        let i;
        const accountId = this.accountList[index].accountId;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].accountId === accountId) {
                this.tabsControl.splice(i, 1);
            }
        }

        // Send request to delete member.
        const asyncTaskPipe = this.accountService.deleteAccount(
            {
                accountId
            }
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.showSuccessResponse('Account is deleted');
                console.log(data);
            },
            (data) => {
                this.showErrorResponse(data);
                console.log(data);
            }
        ));

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
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        // Reset Tabs.
        this.setTabActive(0);

        return;
    }

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

    showErrorResponse(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {

        this.alertsService.create('success', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-success">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

}
