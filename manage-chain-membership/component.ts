// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { fromJS, Set } from 'immutable';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
// Internal
import { AdminUsersService, MemberService } from '@setl/core-req-services';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import {
    getCurrentChainMembershipList, SET_CHAIN_MEMBERSHIP_LIST, SET_MANAGE_MEMBER_LIST,
    setRequestedManageMemberList,
} from '@setl/core-store';
import { SagaHelper, LogService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-manage-chain-membership',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageChainMembershipComponent implements OnInit, OnDestroy {
    tabsControl: {}[];

    chainMemberShipTypeItems: any[] = [];

    memberList: any[];
    memberListObject: object;

    walletNodeListObject: object;
    currentChainWalletNodeList: any[];

    chainList: any[];
    chainListObject: object;

    membershipForm: FormGroup;

    subscriptions: Subscription[] = [];

    @select(['member', 'manageMemberList', 'memberList']) manageMemberListOb;
    @select(['member', 'manageMemberList', 'requestedManagedMemberList']) requestedManagedMemberListOb;
    @select(['userAdmin', 'walletNode', 'walletNodeList']) walletNodeListOb;
    @select(['userAdmin', 'walletNode', 'requestedWalletNodeList']) requestedWalletNodeListOb;
    @select(['userAdmin', 'chains', 'chainList']) chainListOb;
    @select(['userAdmin', 'chain', 'requestedChainList']) requestedChainListOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private memberService: MemberService,
                private adminUsersService: AdminUsersService,
                private logService: LogService,
                private changeDetectorRef: ChangeDetectorRef,
                public translate: MultilingualService,
    ) {
        /* Default tabs. */
        this.tabsControl = [
            {
                title: `<i class="fa fa-search"></i> ${this.translate.translate('Search')}`,
                active: true,
            },
        ];

        this.subscriptions.push(this.manageMemberListOb.subscribe(
            memberList => this.updateMemberList(memberList)));
        this.subscriptions.push(this.requestedManagedMemberListOb.subscribe(
            requestedState => this.requestManagedMemberList(requestedState)));
        this.subscriptions.push(this.walletNodeListOb.subscribe(
            walletNodeList => this.updateWalletNodeList(walletNodeList)));
        this.subscriptions.push(this.requestedWalletNodeListOb.subscribe(
            requestedState => this.requestWalletNodeList(requestedState)));
        this.subscriptions.push(this.chainListOb.subscribe(chainList => this.updateChainList(chainList)));
        this.subscriptions.push(this.requestedChainListOb.subscribe(
            requestedState => this.requestChainList(requestedState)));

        // Chain membership items
        this.setChainMemberShipTypeItems();

        // Chain membership form
        this.membershipForm = new FormGroup({
            chain: new FormControl([], Validators.required),
            membershipArr: new FormArray([]),
        });
    }

    ngOnInit() {
    }

    addMembershipItem(memberValue = [], memberTypeValue = [], nodeValue = []) {
        if (this.membershipForm.value.chain.length === 0) {
            this.alertsService.generate(
                'error',
                this.translate.translate('Please choose a chain first.'),
            );
            return false;
        }
        // Add membership item to form array.
        this.membershipForm.controls['membershipArr']['push'](
            new FormGroup({
                member: new FormControl(memberValue, Validators.required),
                memberType: new FormControl(memberTypeValue, Validators.required),
                node: new FormControl(nodeValue, Validators.required),
            }),
        );
    }

    removeMembershipItem(index) {
        this.membershipForm.controls['membershipArr']['removeAt'](index);
    }

    clearMembershipItem() {
        let i;
        const numItem = this.membershipForm.controls['membershipArr']['length'];
        for (i = 0; i < numItem; i += 1) {
            this.membershipForm.controls['membershipArr']['removeAt'](0);
        }
    }

    updateMemberList(memberList: object): void {
        this.memberListObject = memberList;

        const memberListImu = fromJS(memberList);
        this.memberList = memberListImu.reduce(
            (resultList, thisMember) => {
                resultList.push({
                    id: thisMember.get('memberId'),
                    text: thisMember.get('memberName'),
                });
                return resultList;
            },
            [],
        );
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
                {},
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
        this.chainList = chainListImu.reduce(
            (resultList, thisChain) => {
                resultList.push({
                    id: thisChain.get('chainId'),
                    text: thisChain.get('chainName'),
                });
                return resultList;
            },
            [],
        );
        this.changeDetectorRef.markForCheck();
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
            chainId,
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
            () => {
            },
        ));

        this.updateCurrentChainWalletNodeList(chainId);
    }

    selectMember($event, index) {
        const selectedId = $event.id;
        const currentSelectedMemberIds = this.getSelectedMember(index);

        if (currentSelectedMemberIds.includes(selectedId)) {
            this.membershipForm.controls['membershipArr']['at'](index)['patchValue']({ member: [] });
            this.alertsService.generate(
                'warning',
                this.translate.translate('Member is selected from other entry.'),
            );
        }

    }

    getSelectedMember(excludeIndex) {
        const membershipValue = this.membershipForm.value.membershipArr;
        const membershipValueImu = fromJS(membershipValue);

        const selectedMember = membershipValueImu.reduce(
            (result, item, index) => {
                // Excluding specific index.
                if (excludeIndex === index) {
                    return result;
                }
                /**
                 * The extra check in here is for a weird issue caused by ng2-select.
                 *
                 * The value get the pre-paint select(those fill with) of "new FormControl(memberValue,
                 * Validators.required)" Those one value is different with the one that initialise with
                 * "new FormControl([], Validators.required)".
                 *
                 * For the first instance, item.getIn(['member', '0']) is an object. the second instance
                 * item.getIn(['member', '0']) is an ng2-select "selectItem" object.
                 */
                let memberId;
                memberId = item.getIn(['member', '0']).id;

                if (typeof memberId === 'undefined') {
                    memberId = item.getIn(['member', '0', 'id']);
                }

                result.push(memberId);

                return result;
            },
            [],
        );

        return selectedMember;
    }

    updateCurrentChainWalletNodeList(chainId) {
        const walletNodeListImu = fromJS(this.walletNodeListObject);

        this.currentChainWalletNodeList = walletNodeListImu.reduce(
            (result, item) => {
                if (item.get('chainId') === chainId) {
                    result.push({
                        id: item.get('walletNodeId'),
                        text: item.get('walletNodeName'),
                    });
                }
                return result;
            },
            [],
        );
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

            memberId = parseInt(memberId, 10);
            memberTypeId = _.get(currentChainMembershipList, [memberId, 'memberType'], 0);
            nodeId = _.get(currentChainMembershipList, [memberId, 'nodeId'], 0);

            memberValue = [{ id: memberId, text: this.memberListObject[memberId]['memberName'] }];
            memberTypeValue = [{ id: memberTypeId, text: this.getChainMembershipTypeName(memberTypeId) }];
            nodeValue = [{ id: nodeId, text: this.walletNodeListObject[nodeId]['walletNodeName'] }];

            this.addMembershipItem(
                memberValue,
                memberTypeValue,
                nodeValue,
            );
        }
        this.changeDetectorRef.markForCheck();
    }

    handleUpdateChainMembership() {
        if (this.membershipForm.valid) {
            /* Show loading modal */
            this.alertsService.create('loading');

            const newState = this.ngRedux.getState();
            const currentChainMembershipListObject = getCurrentChainMembershipList(newState);

            const chainId = this.membershipForm.value.chain[0]['id'];
            const toAdd = this.getChainMembershipToAdd(currentChainMembershipListObject);
            const toDelete = this.getChainMembershipToDelete(currentChainMembershipListObject);
            const toUpdate = this.getChainMembershipToUpdate(currentChainMembershipListObject);

            const asyncTaskPipe = this.adminUsersService.updateMemberChainAccess(
                {
                    chainId,
                    toUpdate,
                    toAdd,
                    toDelete,
                },
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                () => {
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('Chain Membership is updated.'),
                    );
                },
                (data) => {
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to update Chain Membership.'),
                    );
                    this.logService.log(data);
                },
            ));
        }
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

    getChainMembershipToAdd(currentMembershipListObject) {
        let thisMembership = {};
        let thisMemberId;
        let thisMemberType;
        let thisNode;
        const toAdd = {};
        for (thisMembership of this.membershipForm.value.membershipArr) {
            thisMemberId = _.get(thisMembership, ['member', 0, 'id'], 0);
            thisMemberType = _.get(thisMembership, ['memberType', 0, 'id'], 0);
            thisNode = _.get(thisMembership, ['node', 0, 'id'], 0);
            if (!currentMembershipListObject.hasOwnProperty(thisMemberId)) {
                toAdd[thisMemberId] = {
                    nodeID: thisNode,
                    memberType: thisMemberType,
                };
            }
        }

        return toAdd;
    }

    getChainMembershipToDelete(currentMembershipListObject) {
        let thisMemberId;
        const toDelete = [];
        // passing in -1, so we select all the items, not excluding any.
        const currentSelectMemberIds = this.getSelectedMember(-1);
        for (thisMemberId of Object.keys(currentMembershipListObject)) {
            thisMemberId = parseInt(thisMemberId, 10);
            if (!currentSelectMemberIds.includes(thisMemberId)) {
                toDelete.push(thisMemberId);
            }
        }

        return toDelete;
    }

    getChainMembershipToUpdate(currentMembershipListObject) {
        let thisMembership;
        let thisMembershipId;
        let thisOldMemberType;
        let thisNewMemberType;
        let thisOldNode;
        let thisNewNode;
        const toUpdate = {};
        const newMembershipList = this.membershipForm.value.membershipArr;
        for (thisMembership of newMembershipList) {
            thisMembershipId = thisMembership.member[0].id + '';
            if (currentMembershipListObject.hasOwnProperty(thisMembershipId)) {
                thisOldMemberType = currentMembershipListObject[thisMembershipId]['memberType'];
                thisOldNode = currentMembershipListObject[thisMembershipId]['nodeId'];
                thisNewMemberType = thisMembership.memberType[0].id;
                thisNewNode = thisMembership.node[0].id;

                if (thisOldMemberType !== thisNewMemberType || thisOldNode !== thisNewNode) {
                    toUpdate[thisMembershipId] = {
                        nodeID: thisNewNode,
                        memberType: thisNewMemberType,
                    };
                }
            }
        }

        return toUpdate;
    }

    setChainMemberShipTypeItems() {
        this.chainMemberShipTypeItems = this.translate.translate([
            { id: 1, text: 'Custodian' },
            { id: 2, text: 'Registrar' },
            { id: 3, text: 'Clearer' },
            { id: 4, text: 'Payment Institution' },
            { id: 5, text: 'Regulator' },
            { id: 7, text: 'Exchange' },
            { id: 8, text: 'Central Bank' },
        ]);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
