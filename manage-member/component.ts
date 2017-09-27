// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from 'immutable';

// Internal
import {MemberService} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {
    setRequestedManageMemberList,
    SET_REQUESTED_MANAGE_MEMBER_LIST,
    SET_MANAGE_MEMBER_LIST
} from '@setl/core-store';
import {SagaHelper} from '@setl/utils';

@Component({
    selector: 'app-manage-member',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageMemberComponent implements OnInit {
    tabsControl: Array<any>;
    manageMembersList: Array<any>;
    isSymAdmin: boolean;

    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(['user', 'myDetail', 'admin']) isSymAdminOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService,
                private changeDetectorRef: ChangeDetectorRef) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                memberId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Member',
                memberId: -1,
                formControl: new FormGroup(
                    {
                        memberName: new FormControl('', Validators.required),
                        email: new FormControl('', Validators.required)
                    }
                ),
                active: false
            }
        ];

        this.manageMemberListOb.subscribe((memberList) => this.updateMemberList(memberList));
        this.requestedManagedMemberListOb.subscribe((requestedState) => this.requestManagedMemberList(requestedState));
        this.isSymAdminOb.subscribe(isSymAdmin => this.isSymAdmin = isSymAdmin);
    }

    ngOnInit() {
    }

    updateMemberList(memberList: object): void {
        const memberListImu = fromJS(memberList);
        this.manageMembersList = memberListImu.reduce(function (result, thisMember) {
            result.push(thisMember.toJS());
            return result;
        }, []);
        console.log(this.manageMembersList);
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

    /**
     * Handle Add new member click.
     *
     * @param {tabid} - The tab id that the form is in.
     *
     * @return {void}
     */
    handleAddMember(tabId: number): void {

        if (this.tabsControl[tabId].formControl.valid) {
            console.log(this.tabsControl[tabId].formControl.value);

            // Create a saga pipe.
            const asyncTaskPipe = this.memberService.addMember(
                this.tabsControl[tabId].formControl.value
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.showSuccessResponse('Member is created');
                },
                (data) => {
                    this.showErrorResponse(data);
                }
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
            console.log(this.tabsControl[tabId].formControl.value);
            const memberName = this.tabsControl[tabId].formControl.value.memberName;
            const memberId = this.tabsControl[tabId].memberId;

            // Create a saga pipe.
            const asyncTaskPipe = this.memberService.editMember(
                {
                    memberName,
                    memberId
                }
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.showSuccessResponse('Member is updated');
                },
                (data) => {
                    this.showErrorResponse(data);
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
                    memberName: new FormControl(member.memberName)
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
     * @param {index} number - Contain the target member's index(not memberId).
     *
     * @return {void}
     */
    handleDelete(index: number): void {

        // Check if the tab is already open.
        // If yes, close the tab.
        let i;
        const memberId = this.manageMembersList[index].memberId;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].memberId === memberId) {
                this.tabsControl.splice(i, 1);
            }
        }

        // Send request to delete member.
        const asyncTaskPipe = this.memberService.deleteMember(
            {
                memberId
            }
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.showSuccessResponse('Member is deleted');
            },
            (data) => {
                this.showErrorResponse(data);
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
