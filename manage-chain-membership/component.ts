// Vendor
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {fromJS} from 'immutable';
import _ from 'lodash';

// Internal
import {MemberService} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {
    setRequestedManageMemberList,
    SET_MANAGE_MEMBER_LIST
} from '@setl/core-store';
import {SagaHelper} from '@setl/utils';


@Component({
    selector: 'app-manage-chain-membership',
    templateUrl: 'component.html',
    styleUrls: ['./component.css']
})

export class ManageChainMembershipComponent implements OnInit {
    tabsControl: Array<object>;
    testArr = [{id: 1, text: 'phoenix'}];
    chainMemberShipTypeItems: Array<any> = [
        {id: 1, text: 'Custodian'},
        {id: 2, text: 'Registrar'},
        {id: 3, text: 'Clearer'},
        {id: 4, text: 'Payment Institution'},
        {id: 5, text: 'Regulator'},
        {id: 7, text: 'Exchange'},
        {id: 8, text: 'Central Bank'}
    ];
    memberList: Array<any>;
    memberListObject: object;

    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa search"></i> Chain Access',
                active: true
            }
        ];

        this.manageMemberListOb.subscribe((memberList) => this.updateMemberList(memberList));
        this.requestedManagedMemberListOb.subscribe((requestedState) => this.requestManagedMemberList(requestedState));
    }

    ngOnInit() {
    }

    updateMemberList(memberList: object): void {
        this.memberListObject = memberList;

        const memberListImu = fromJS(memberList);
        this.memberList = memberListImu.reduce(function (resultList, thisMember) {
            resultList.push({
                id: thisMember.get('memberId'),
                text: thisMember.get('memberName')
            });
            return resultList;
        }, []);
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
}
