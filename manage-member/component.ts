// Vendor
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import _ from 'lodash';
import {fromJS} from 'immutable';

// Internal
import {MemberService} from '@setl/core-req-services';
import {
    setRequestedManageMemberList,
    SET_REQUESTED_MANAGE_MEMBER_LIST,
    SET_MANAGE_MEMBER_LIST
} from '@setl/core-store';

@Component({
    selector: 'app-manage-member',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})

export class ManageMemberComponent implements OnInit {
    tabsControl: Array<object>;
    manageMembersList: Array<object>;

    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa fa-search"></i> Search',
                userId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Member',
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

        this.manageMemberListOb.subscribe((memberList) => this.updateMemberList(memberList));
        this.requestedManagedMemberListOb.subscribe((requestedState) => this.requestManagedMemberList(requestedState));
    }

    ngOnInit() {
    }

    updateMemberList(memberList) {
        const memberListImu = fromJS(memberList);
        this.manageMembersList = memberListImu.reduce(function (result, thisMember) {
            result.push(thisMember.toJS());
            return result;
        }, []);
        console.log(this.manageMembersList);
    }

    requestManagedMemberList(requestedState) {

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
}
