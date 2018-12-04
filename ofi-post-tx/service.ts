// Vender
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

// Internal
import { MemberSocketService } from '@setl/websocket-service';
import { OfiFundInvestService } from '../ofi-req-services/ofi-fund-invest/service';
import { OfiNavService } from '../ofi-req-services/ofi-product/nav/service';
import { AdminUsersService } from '@setl/core-req-services/useradmin/useradmin.service';
import { WalletnodeTxService } from '@setl/core-req-services/walletnode-tx/walletnode-tx.service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, commonHelper, LogService } from '@setl/utils';
import { clearContractNeedHandle, clearRegisterIssuerNeedHandle } from '@setl/core-store';
import { setLastCreatedRegisterIssuerDetail } from '@setl/core-store/assets/my-issuers/actions';
import * as moment from 'moment';
import { MultilingualService } from '@setl/multilingual';

@Injectable()
export class OfiPostTxService implements OnDestroy {
    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    @select(['wallet', 'myWalletContract', 'lastCreated']) lastCreatedContractOb;
    @select(['asset', 'myIssuers', 'lastCreated']) lastCreatedIssuer;

    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
                private ofiFundInvestService: OfiFundInvestService,
                private walletnodeTxService: WalletnodeTxService,
                private adminUsersService: AdminUsersService,
                private ofiNavService: OfiNavService,
                private logService: LogService,
                private alertsService: AlertsService,
                public translate: MultilingualService,
    ) {
        this.subscriptionsArray.push(
            this.lastCreatedContractOb.subscribe(lastCreated => this.handleLastCreatedContract(lastCreated)),
            this.lastCreatedIssuer.subscribe(lastCreated => this.handleLastCreatedIssuer(lastCreated)),
        );
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    handleLastCreatedIssuer(lastCreated) {
        this.logService.log('blockchain output lastCreated: ', lastCreated);

        const needHandle = lastCreated.needHandle;
        const inBlockchain = lastCreated.inBlockchain;
        // this.logService.log('needHandle', needHandle);
        // this.logService.log('inBlockchain', inBlockchain);

        const actionType = _.get(lastCreated, 'metaData.actionType');
        // this.logService.log('actionType', actionType);

        if (actionType === 'ofi-create-new-share') {
            // this.logService.log('handleLastCreatedIssuer', lastCreated);
            const currentStep = _.get(lastCreated, 'metaData.arrangementData.currentStep');
            if (needHandle && inBlockchain) {
                if (currentStep === 'saveRegisterAsset') {
                    this.saveRegisterAsset(lastCreated);
                }
            } else if (needHandle && !inBlockchain) {
                if (currentStep === 'saveNewWallet') {
                    this.saveNewWallet(lastCreated);
                } else if (currentStep === 'saveFinished') {
                    // set need handle to false;
                    this.ngRedux.dispatch(clearRegisterIssuerNeedHandle());
                }
            }
        }
    }

    handleLastCreatedContract(lastCreated) {
        this.logService.log('ok:', lastCreated);
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
        this.logService.log('creating arrangement');
        const arrangementData = _.get(requestData, 'metaData.arrangementData', {});

        // save arrangement
        const asyncTaskPipe = this.ofiFundInvestService.addArrangementRequest(arrangementData);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (response) => {
                // save arrangement and contract map
                const arrangementId = _.get(response, '[1].Data[0].arrangementID', 0);

                // set need handle to false;
                this.ngRedux.dispatch(clearContractNeedHandle());

                // Update success alert message
                this.updateArrangeCreateStatus({ arrangementId });

                if (arrangementId === 0) {
                    throw new Error('Create new order fail');
                }

                const walletId = _.get(arrangementData, 'creatorId', 0);
                const contractAddress = _.get(requestData, 'contractAddress', '');
                const expiry = _.get(requestData, 'contractExpiry', 0);

                const addMapAsyncPipe = this.ofiFundInvestService.addArrangementContractMapRequest({
                    walletId,
                    arrangementId,
                    contractAddress,
                    expiry,
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    addMapAsyncPipe,
                    (addMapResponse) => {
                        this.logService.log('success----------------');
                    },
                    (addMapResponse) => {
                        this.showErrorResponse(addMapResponse);
                    },
                ));

            },
            (response) => {
                this.showErrorResponse(response);
            },
        ));
    }

    updateArrangeCreateStatus(data) {
        const arrangementId = commonHelper.pad(data.arrangementId, 10, '0');

        this.alertsService.updateView(
            'success',
            `<table class="table grid">
                <tbody>
                    <tr class="fadeIn">
                        <td class="text-left text-success" width="500px">
                        <i class="fa fa-check text-primary" aria-hidden="true"></i>
                        &nbsp;${this.translate.translate('Order in blockchain ledger')}</td>
                    </tr>
                    <tr class="fadeIn">
                        <td class="text-left text-success" width="500px">
                        <i class="fa fa-check text-primary" aria-hidden="true"></i>
                        &nbsp;${this.translate.translate('Order ID: @arrangementId@', { arrangementId })}</td>
                    </tr>
                </tbody>
            </table>`);
    }

    saveNewWallet(requestData) {
        // set need handle to false;
        this.ngRedux.dispatch(clearRegisterIssuerNeedHandle());

        const shareName = requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].shareName;

        const asyncTaskPipe = this.adminUsersService.createNewWallet(
            {
                walletName: shareName,
                walletAccount: requestData.metaData.arrangementData.accountId,
                walletType: 3,
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('1) saveNewWallet : success', data); // success
                const walletID = data[1].Data[0].walletID;
                requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID = walletID;
                this.saveNewWalletPermission(requestData);
            },
            (data) => {
                this.logService.log('saveNewWallet Error: ', data);
            }),
        );
    }

    saveNewWalletPermission(requestData) {
        const shareName = requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].shareName;

        const asyncTaskPipe = this.adminUsersService.newUserWalletPermissions(
            {
                walletName: shareName,
                userId: requestData.metaData.arrangementData.userId,
                walletAccess: { [requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID]: 3 },
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('2) saveNewWalletPermission : success', data); // success
                setTimeout(
                    () => {
                        this.saveNewAddress(requestData);
                    },
                    2000,
                );
            },
            (data) => {
                this.logService.log('saveNewWalletPermission Error: ', data);
            }),
        );
    }

    saveNewAddress(requestData) {
        const asyncTaskPipe = this.walletnodeTxService.newAddress(
            {
                walletId: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID,
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('3) saveNewAddress : success', data); // success
                const address = data[1].data.address;
                requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].address = address;
                this.saveRegisterIssuer(requestData);
            },
            (data) => {
                this.logService.log('saveNewAddress Error: ', data);
            }),
        );
    }

    saveRegisterIssuer(requestData) {
        const asyncTaskPipe = this.walletnodeTxService.registerIssuer(
            {
                walletId: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID,
                issuerIdentifier: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].isin,
                issuerAddress: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].address,
                metaData: {},
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('4) saveRegisterIssuer : success', data); // success
                this.ngRedux.dispatch(setLastCreatedRegisterIssuerDetail(data, {
                    actionType: 'ofi-create-new-share',
                    arrangementData: {
                        currentShare: requestData.metaData.arrangementData.currentShare,
                        currentStep: 'saveRegisterAsset',
                        accountId: requestData.metaData.arrangementData.accountId,
                        userId: requestData.metaData.arrangementData.userId,
                        sharesList: requestData.metaData.arrangementData.sharesList,
                    },
                }));
            },
            (data) => {
                this.logService.log('saveRegisterIssuer Error: ', data);
            }),
        );
    }

    saveRegisterAsset(requestData) {
        // set need handle to false;
        this.ngRedux.dispatch(clearRegisterIssuerNeedHandle());

        const asyncTaskPipe = this.walletnodeTxService.registerAsset(
            {
                walletId: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID,
                address: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].address,
                namespace: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].isin,
                instrument: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].shareName,
                metaData: {},
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('5) saveRegisterAsset : success', data); // success
                this.saveCoupon(requestData);
            },
            (data) => {
                this.logService.log('saveRegisterAsset Error: ', data);
            }),
        );
    }

    saveCoupon(requestData) {
        const coupon = 'Coupon';

        const asyncTaskPipe = this.walletnodeTxService.registerAsset(
            {
                walletId: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].walletID,
                address: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].address,
                namespace: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].isin,
                instrument: coupon,
                metaData: {},
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // this.logService.log('6) saveCoupon : success', data); // success
                this.saveIssueAssetMap(requestData);
            },
            (data) => {
                this.logService.log('saveCoupon Error: ', data);
            }),
        );
    }

    saveIssueAssetMap(requestData) {
        const asset = requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].isin +
            '|' + requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].shareName;
        const asyncTaskPipe = this.ofiFundInvestService.insertIssueAssetMap(
            {
                address: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].address,
                asset,
                isin: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].isin,
                companyId: requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].companyID,
            },
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // Save estimated nav for the fundshare.
                const estimatedNav = requestData.metaData.arrangementData.sharesList[requestData.metaData.arrangementData.currentShare].initialEstimatedNav;
                this.saveFundShareEstimatedNav(asset, estimatedNav);

                // this.logService.log('7) saveIssueAssetMap : success', data); // success
                const nbShares = requestData.metaData.arrangementData.sharesList.length;
                if (requestData.metaData.arrangementData.currentShare < (nbShares - 1)) {
                    requestData.metaData.arrangementData.currentShare++;
                    requestData.metaData.arrangementData.currentStep = 'saveNewWallet';
                    this.ngRedux.dispatch(setLastCreatedRegisterIssuerDetail(data, {
                        actionType: 'ofi-create-new-share',
                        arrangementData: {
                            currentShare: requestData.metaData.arrangementData.currentShare,
                            currentStep: 'saveNewWallet',
                            accountId: requestData.metaData.arrangementData.accountId,
                            userId: requestData.metaData.arrangementData.userId,
                            sharesList: requestData.metaData.arrangementData.sharesList,
                            isFinished: requestData.metaData.arrangementData.isFinished,
                        },
                    }));
                } else {
                    this.updateSuccessResponse();
                    this.ngRedux.dispatch(setLastCreatedRegisterIssuerDetail(data, {
                        actionType: 'ofi-create-new-share',
                        arrangementData: {
                            currentShare: requestData.metaData.arrangementData.currentShare,
                            currentStep: 'saveFinished',
                            accountId: requestData.metaData.arrangementData.accountId,
                            userId: requestData.metaData.arrangementData.userId,
                            sharesList: requestData.metaData.arrangementData.sharesList,
                            isFinished: true,
                        },
                    }));
                }
            },
            (data) => {
                this.logService.log('saveIssueAssetMap Error: ', data);
            }),
        );
    }

    saveFundShareEstimatedNav(fundShare: string, estimatedNav: number) {
        this.logService.log('saving nav', fundShare, estimatedNav);
        const asyncTaskPipe = this.ofiNavService.updateNav({
            fundName: fundShare,
            fundDate: moment().format('YYYY-MM-DD'),
            price: estimatedNav,
            priceStatus: 1,
        });
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
            },
            (data) => {
            },
        ));
    }

    showErrorResponse(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create(
            'error',
            `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">${message}</td>
                    </tr>
                </tbody>
            </table>`,
        );
    }

    showSuccessResponse() {
        this.alertsService.create(
            'waiting',
            `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning" width="500px">
                            <h3><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>&nbsp;${this.translate.translate('Do not close your browser window')}</h3>
                            <p>${this.translate.translate('We are saving your progress. This may take a few moments.')}</p>
                        </td>
                    </tr>
                </tbody>
            </table>`,
        );
    }

    updateSuccessResponse() {
        this.alertsService.updateView(
            'success',
            `<table class="table grid">
                <tbody>
                    <tr class="fadeIn">
                        <td class="text-center text-success" width="500px">
                            <h3>${this.translate.translate('Your form has been saved successfully')}</h3>
                            <p>${this.translate.translate('You can now close this pop-up.')}</p>
                        </td>
                    </tr>
                </tbody>
            </table>`,
        );
    }

}
