// Vender
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';

// Internal
import {MemberSocketService} from '@setl/websocket-service';
import {OfiFundInvestService} from '@ofi/ofi-main';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper, commonHelper} from '@setl/utils';
import {clearContractNeedHandle} from '@setl/core-store';


@Injectable()
export class OfiPostTxService implements OnDestroy {
    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    @select(['wallet', 'myWalletContract', 'lastCreated']) lastCreatedContractOb;

    // need something like this
    @select(['wallet', 'myWalletIssuer', 'lastCreated']) lastCreatedIssuer;

    constructor(private _memberSocketService: MemberSocketService,
                private _ngRedux: NgRedux<any>,
                private _ofiFundInvestService: OfiFundInvestService,
                private _alertsService: AlertsService) {
        this.subscriptionsArray.push(
            this.lastCreatedContractOb.subscribe(lastCreated => this.handleLastCreatedContract(lastCreated)),
            this.lastCreatedIssuer.subscribe(lastCreated => this.handleLastCreatedIssuer(lastCreated))
        );
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }


    handleLastCreatedIssuer(lastCreated) {

        console.log('blockchain output: ' + lastCreated);
        console.log('issuer complete');

        // register asset (ISIN|FundShareName)
        // in walletnode-tx/registerAsset


        // register another asset (ISIN|Coupon)
        // in walletnode-tx/registerAsset
    }

    handleLastCreatedContract(lastCreated) {
        console.log('ok:', lastCreated);
        const needHandle = lastCreated.needHandle;
        const inBlockchain = lastCreated.inBlockchain;

        if (needHandle && inBlockchain) {
            const actionType = _.get(lastCreated, 'metaData.actionType');

            if (actionType === 'ofi-arrangement') {
                this.createArrangement(lastCreated);
            }

        }
    }

    createArrangement(requestData): void {
        console.log('creating arrangement');
        const arrangementData = _.get(requestData, 'metaData.arrangementData', {});

        // save arrangement
        const asyncTaskPipe = this._ofiFundInvestService.addArrangementRequest(arrangementData);

        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (response) => {
                // save arrangement and contract map
                const arrangementId = _.get(response, '[1].Data[0].arrangementID', 0);

                // set need handle to false;
                this._ngRedux.dispatch(clearContractNeedHandle());

                // Update success alert message
                this.updateArrangeCreateStatus({arrangementId});

                if (arrangementId === 0) {
                    throw new Error('Create new order fail');
                }

                const walletId = _.get(arrangementData, 'creatorId', 0);
                const contractAddress = _.get(requestData, 'contractAddress', '');
                const expiry = _.get(requestData, 'contractExpiry', 0);

                const addMapAsyncPipe = this._ofiFundInvestService.addArrangementContractMapRequest({
                    walletId,
                    arrangementId,
                    contractAddress,
                    expiry
                });

                this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    addMapAsyncPipe,
                    (addMapResponse) => {
                        console.log('success----------------');
                    },
                    (addMapResponse) => {
                        this.showErrorResponse(addMapResponse);
                    }
                ));

            },
            (response) => {
                this.showErrorResponse(response);
            },
        ));
    }


    updateArrangeCreateStatus(data) {
        const arrangementId = commonHelper.pad(data.arrangementId, 10, '0');

        this._alertsService.updateView('success', `<table class="table grid">
                        <tbody>
                            <tr class="fadeIn">
                                <td class="text-left text-success" width="500px">
                                <i class="fa fa-check text-primary" aria-hidden="true"></i>
                                &nbsp;Order in blockchain ledger</td>
                            </tr>
                            <tr class="fadeIn">
                                <td class="text-left text-success" width="500px">
                                <i class="fa fa-check text-primary" aria-hidden="true"></i>
                                &nbsp;Order ID: ${arrangementId}</td>
                            </tr>
                        </tbody>
                    </table>
        `);

    }

    showErrorResponse(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this._alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

}
