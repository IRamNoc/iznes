// Vendor
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {fromJS, Set} from 'immutable';
import _ from 'lodash';

// Internal
import {MemberService, AdminUsersService} from '@setl/core-req-services';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {
    setRequestedManageMemberList,
    SET_MANAGE_MEMBER_LIST,
    setRequestedWalletNodeList,
    SET_WALLET_NODE_LIST,
    SET_CHAIN_MEMBERSHIP_LIST,
    getCurrentChainMembershipList
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
    unSelectedMemberList: Array<any>;
    memberListObject: object;

    walletNodeListObject: object;
    currentChainWalletNodeList: Array<any>;

    chainList: Array<any>;
    chainListObject: object;

    membershipForm: FormGroup;


    multiple0 = false;
    multiple1 = true;
    options0: Array<any> = [];
    options1: Array<any> = [];
    selection: Array<string>;

    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(['userAdmin', 'walletNode', 'walletNodeList']) walletNodeListOb;
    @select(['userAdmin', 'walletNode', 'requestedWalletNodeList']) requestedWalletNodeListOb;
    @select(['userAdmin', 'chains', 'chainList']) chainListOb;
    @select(['userAdmin', 'chain', 'requestedChainList']) requestedChainListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService,
                private adminUsersService: AdminUsersService) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: '<i class="fa search"></i> Chain Access',
                active: true
            }
        ];

        this.manageMemberListOb.subscribe((memberList) => this.updateMemberList(memberList));
        this.requestedManagedMemberListOb.subscribe((requestedState) => this.requestManagedMemberList(requestedState));
        this.walletNodeListOb.subscribe((walletNodeList) => this.updateWalletNodeList(walletNodeList));
        this.requestedWalletNodeListOb.subscribe((requestedState) => this.requestWalletNodeList(requestedState));
        this.chainListOb.subscribe((chainList) => this.updateChainList(chainList));
        this.requestedChainListOb.subscribe((requestedState) => this.requestChainList(requestedState));

        // Chain membership items

        // Chain membership form
        this.membershipForm = new FormGroup({
            chain: new FormControl([], Validators.required),
            membershipArr: new FormArray([])
        });
    }

    ngOnInit() {
    }

    addMembershipItem(memberValue = [], memberTypeValue = [], nodeValue = []) {
        if (this.membershipForm.value.chain.length === 0) {
            this.alertsService.create('error', 'Please choose a chain first');
            return false;
        }
        // Add membership item to form array.
        this.membershipForm.controls['membershipArr']['push'](
            new FormGroup({
                member: new FormControl(memberValue, Validators.required),
                memberType: new FormControl(memberTypeValue, Validators.required),
                node: new FormControl(nodeValue, Validators.required),
            })
        );

    }

    removeMembershipItem(index) {
        this.membershipForm.controls['membershipArr']['removeAt'](index);
    }

    clearMembershipItem() {
        let i;
        const numItem = this.membershipForm.controls['membershipArr']['length'];
        for (i = 0; i < numItem; i++) {
            this.membershipForm.controls['membershipArr']['removeAt'](0);
        }
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

        this.unSelectedMemberList = this.memberList.slice();
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

    updateWalletNodeList(walletNodeList) {
        this.walletNodeListObject = walletNodeList;
    }

    requestWalletNodeList(requestedState) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            AdminUsersService.defaultRequestWalletNodeList(this.adminUsersService, this.ngRedux);
        }
    }

    updateChainList(chainList) {

        this.chainListObject = chainList;

        const chainListImu = fromJS(chainList);
        this.chainList = chainListImu.reduce(function (resultList, thisChain) {
            resultList.push({
                id: thisChain.get('chainId'),
                text: thisChain.get('chainName')
            });
            return resultList;
        }, []);
    }

    requestChainList(requestedState) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            AdminUsersService.defaultRequestChainList(this.adminUsersService, this.ngRedux);
        }
    }

    selectChain(selected) {
        const chainId = selected.id;

        // Async pipe
        const asyncTaskPipe = this.adminUsersService.requestMemberChainAccessList({
            chainId
        });

        // Dispatch saga async action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CHAIN_MEMBERSHIP_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                // Repaint member chain membership wrapper.
                this.repaintChainMembershipWrapper();
            },
            (data) => {
            }
        ));

        this.updateCurrentChainWalletNodeList(chainId);
    }

    selectMember() {
        console.log(this.getSelectedMember());

    }

    getSelectedMember() {
        const membershipValue = this.membershipForm.value.membershipArr;
        const membershipValueImu = fromJS(membershipValue);

        const selectedMember = membershipValue.reduce(function (result, item) {
            result.push(item.member[0].id);
            return result;
        }, []);

        return selectedMember;
    }

    updateCurrentChainWalletNodeList(chainId) {
        const walletNodeListImu = fromJS(this.walletNodeListObject);

        this.currentChainWalletNodeList = walletNodeListImu.reduce((result, item) => {
            if (item.get('chainId') === chainId) {
                result.push({
                    id: item.get('walletNodeId'),
                    text: item.get('walletNodeName')
                });
            }
            return result;
        }, []);
    }

    repaintChainMembershipWrapper() {
        const newState = this.ngRedux.getState();
        const currentChainMembershipList = getCurrentChainMembershipList(newState);

        // Reset formArray
        this.clearMembershipItem();

        let memberId;
        let memberTypeId;
        let nodeId;
        let memberValue;
        let memberTypeValue;
        let nodeValue;
        for (memberId of Object.keys(currentChainMembershipList)) {

            memberTypeId = _.get(currentChainMembershipList, [memberId, 'memberType'], 0);
            nodeId = _.get(currentChainMembershipList, [memberId, 'nodeId'], 0);

            memberValue = [{id: memberId, text: this.memberListObject[memberId]['memberName']}];
            memberTypeValue = [{id: memberTypeId, text: this.getChainMembershipTypeName(memberTypeId)}];
            nodeValue = [{id: nodeId, text: this.walletNodeListObject[nodeId]['walletNodeName']}];

            this.addMembershipItem(
                memberValue,
                memberTypeValue,
                nodeValue
            );
        }
    }

    handleUpdateChainMembership() {
        console.log(this.membershipForm.value)
        const newState = this.ngRedux.getState();
        const currentChainMembershipListObject = getCurrentChainMembershipList(newState);

        console.log(this.getChainMembershipToAdd(currentChainMembershipListObject, this.membershipForm.value.membershipArr));
    }

    /**
     * Get chain membership type text with id.
     * @param typeId
     * @return {string}
     */
    private getChainMembershipTypeName(typeId) {
        let item;
        for (item of this.chainMemberShipTypeItems) {
            if (item.id === typeId) {
                return item.text;
            }
        }

        return '';
    }

    getChainMembershipToAdd(currentMembershipListObject, newMembershipList) {
        let thisMembership;
        let thisMemberId;
        const toAdd = [];
        for (thisMembership of newMembershipList) {
            thisMemberId = _.get(thisMembership, ['member', 0, 'id'], 0);
            if (!currentMembershipListObject.hasOwnProperty(thisMemberId)) {
                toAdd.push(thisMembership);
            }
        }

        return toAdd;
    }
}
