// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { fromJS } from 'immutable';
// Internal
import { MemberService } from '@setl/core-req-services';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { clearRequestedManageMemberList, SET_MANAGE_MEMBER_LIST, setRequestedManageMemberList } from '@setl/core-store';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { PersistService } from '@setl/core-persist';

interface NewMemberUserDetail {
    memberName: string;
    emailAddress: string;
    userName: string;
    password: string;
}

@Component({
    selector: 'app-manage-member',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageMemberComponent implements OnInit, OnDestroy {
    tabsControl: any[];
    manageMembersList: any[];
    isSymAdmin: boolean;
    allowedToSave: boolean[];

    // Rows Per Page datagrid size
    public pageSize: number;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    createdNewMemberUser: NewMemberUserDetail;

    // List of redux observable.
    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(['user', 'myDetail', 'admin']) isSymAdminOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService,
                private confirmationService: ConfirmationService,
                private changeDetectorRef: ChangeDetectorRef,
                private persistService: PersistService) {
        this.allowedToSave = [];
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                memberId: -1,
                active: true,
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Member',
                memberId: -1,
                formControl: this.persistService.watchForm('manageMember/manageMember', new FormGroup(
                    {
                        memberName: new FormControl('', Validators.required),
                        email: new FormControl('', Validators.required),
                    },
                )),
                active: false,
            },
        ];

        // Request Member List
        this.subscriptionsArray.push(this.manageMemberListOb.subscribe(memberList =>
            this.updateMemberList(memberList)));
        this.subscriptionsArray.push(this.requestedManagedMemberListOb.subscribe(requestedState =>
            this.requestManagedMemberList(requestedState)));

        // Subscribe to set System Admin flag
        this.subscriptionsArray.push(this.isSymAdminOb.subscribe(isSymAdmin => this.isSymAdmin = isSymAdmin));
    }

    ngOnInit() {
    }

    /** Checks if user is system admin
     *
     * @param {number} tabId
     * @returns {boolean}
     */
    canSave(tabId: number): boolean {
        if (typeof this.allowedToSave[tabId] === 'undefined') {
            this.allowedToSave[tabId] = false;
        }
        return this.allowedToSave[tabId];
    }

    /**
     * Update Member List
     *
     * @param {object} memberList
     */
    updateMemberList(memberList: object): void {
        const memberListImu = fromJS(memberList);
        this.manageMembersList = memberListImu.reduce(
            (result, thisMember) => {
                const index = result.length;
                const newThisMember = thisMember.set('index', index);
                result.push(newThisMember.toJS());
                return result;
            },
            [],
        );

        this.changeDetectorRef.markForCheck();
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
     * Handle Add new member click.
     *
     * @param {tabid} - The tab id that the form is in.
     *
     * @return {void}
     */
    handleAddMember(tabId: number): void {
        /* If the form is valid... */
        if (this.tabsControl[tabId].formControl.valid) {
            /* Show loading modal */
            this.alertsService.create('loading');

            if (!this.acceptedCharacters(this.tabsControl[tabId].formControl.value['memberName'])) {
                return;
            }

            /* ...prepare the task pipe... */
            const asyncTaskPipe = this.memberService.addMember(
                this.tabsControl[tabId].formControl.value,
            );

            /* ...and run the async callback, then dispatch. */
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    /* Handle success message. */
                    const newMemberUserDetail = _.get(data, '[1][Data][0]');
                    this.createdNewMemberUser = {
                        memberName: _.get(newMemberUserDetail, 'memberName', ''),
                        emailAddress: _.get(newMemberUserDetail, 'emailAddress', ''),
                        password: _.get(newMemberUserDetail, 'pass', ''),
                        userName: _.get(newMemberUserDetail, 'userName', ''),
                    };

                    this.showNewMemberUser();

                    /* Set the request flag to false. */
                    clearRequestedManageMemberList();
                },
                (data) => {
                    /* Handle error message. */
                    const message = _.get(data, '[1].Data[0].Message', '');
                    this.showAlert('error', message);
                },
            ));
        }
    }

    /**
     * Handle edit member click.
     *
     * @param {tabId}
     *
     * @return {void}
     */
    handleEditMember(tabId: number): void {
        if (this.tabsControl[tabId].formControl.valid) {
            /* Show loading modal */
            this.alertsService.create('loading');

            this.allowedToSave[tabId] = false;
            const memberName = this.tabsControl[tabId].formControl.value.memberName;
            const memberId = this.tabsControl[tabId].memberId;

            if (!this.acceptedCharacters(memberName)) {
                return;
            }

            // Create a saga pipe.
            const asyncTaskPipe = this.memberService.editMember(
                {
                    memberName,
                    memberId,
                },
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    this.showAlert('success', 'Member is updated');
                },
                (data) => {
                    const message = _.get(data, '[1].Data[0].Message', '');
                    this.showAlert('error', message);
                },
            ));
        }
    }

    /**
     * Handle edit button is clicked.
     *
     * @param index - index of member to edit
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].memberId === this.manageMembersList[index].memberId) {
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array. */
        const member = this.manageMembersList[index];

        this.tabsControl.push({
            title: '<i class="fa fa-user"></i> ' + member.memberName,
            memberId: member.memberId,
            formControl: new FormGroup(
                {
                    memberName: new FormControl(member.memberName),
                },
            ),
            active: false,
        });
        this.allowedToSave[this.tabsControl.length - 1] = false;
        this.tabsControl[this.tabsControl.length - 1].formControl.controls.memberName.valueChanges.subscribe(
            () => {
                this.allowedToSave[this.tabsControl.length - 1] = true;
            },
        );

        // Activate the new tab.
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle Delete click.
     *
     * @param {index} number - Contain the target member's index(not memberId).
     *
     * @return {void}
     */
    handleDelete(index: number): void {
        /* Let's now ask the user if they're sure... */
        this.confirmationService.create(
            '<span>Deleting a Member</span>',
            '<span class="text-warning">Are you sure you want to delete this member?</span>',
        ).subscribe((ans) => {
            /* ... they are so now send the delete request */
            if (ans.resolved) {
                /* Show loading modal */
                this.alertsService.create('loading');

                // Check if the tab is already open.
                // If yes, close the tab.
                let i;
                const memberId = this.manageMembersList[index].memberId;
                for (i = 0; i < this.tabsControl.length; i += 1) {
                    if (this.tabsControl[i].memberId === memberId) {
                        this.tabsControl.splice(i, 1);
                    }
                }

                // Send request to delete member.
                const asyncTaskPipe = this.memberService.deleteMember(
                    {
                        memberId,
                    },
                );

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    () => {
                        this.showAlert('success', 'Member is deleted');
                    },
                    (data) => {
                        const message = _.get(data, '[1].Data[0].Message', '');
                        this.showAlert('error', message);
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
     * Sets Active Tab
     *
     * @param {number} index - the tab index to set active
     */
    setTabActive(index: number): void {
        const tabControlImu = fromJS(this.tabsControl);

        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === index);
        });

        this.tabsControl = newTabControlImu.toJS();
    }

    /**
     * Accepted Characters, displays alert if regex check fails
     *
     * @param str - string to check
     * @returns {boolean}
     */
    acceptedCharacters(str) {
        const patt = new RegExp('^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżź' +
            'ñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]+$');
        if (!patt.test(str)) {
            this.showAlert('error', 'Invalid characters in Member name.');
            return false;
        }

        return true;
    }

    /**
     * Success alert after creating new Member User
     */
    showNewMemberUser() {
        this.showAlert('success', `
        <table class="table grid large">
            <tr>
                <td class="left">Member Name</td>
                <td class="left" id="newMemberName">${this.createdNewMemberUser.memberName}</td>
            </tr>
            <tr>
                <td class="left">Email Address</td>
                <td class="left" id="newMemberEmail">${this.createdNewMemberUser.emailAddress}</td>
            </tr>
            <tr>
                <td class="left">Username</td>
                <td class="left" id="newMemberUsername">${this.createdNewMemberUser.userName}</td>
            </tr>
            <tr>
                <td class="left">Password</td>
                <td class="left" id="newMemberPassword">${this.createdNewMemberUser.password}</td>
            </tr>
        </table>
       `);
    }

    /**
     * Show a success, warning or error alert message
     *
     * @param  {type} string - the type of alert to show.
     * @param  {message} string - the message to display in the alert.
     * @return {void}
     */
    showAlert(type: any, message: string) {
        const alertClass = (type === 'error') ? 'danger' : type;

        this.alertsService.create(type, `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-${alertClass}">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
