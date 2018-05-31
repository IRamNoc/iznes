import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
    OnDestroy,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { SagaHelper } from '@setl/utils';
import { AlertsService, AlertType } from '@setl/jaspero-ng2-alerts';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { APP_CONFIG, AppConfig } from '@setl/utils';
import { ContractService } from '@setl/core-contracts/services';
import { MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { Subscription } from 'rxjs/Subscription';
import { TabControl, Tab } from '@setl/core-balances/tabs';
import * as _ from 'lodash';
import { ContractModel } from '@setl/core-contracts/models';
import {
    SET_CONTRACT_LIST,
    UPDATE_CONTRACT,
} from '@setl/core-store/wallet/my-wallet-contract/actions';

@Component({
    selector: 'setl-contracts',
    templateUrl: 'contracts.component.html',
    styleUrls: ['contracts.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsComponent implements OnInit, OnDestroy {
    public token: string = null;
    public userId: string = null;
    public walletId: string = null;
    public addresses: string[] = [];
    public contracts: ContractModel[] = [];
    public contract;
    public contractFields;

    // Rows Per Page datagrid size
    public pageSize: number;

    public tabControl: TabControl;
    public tabs: Tab[];

    private subscriptions: Subscription[] = [];

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;
    @select(['wallet', 'myWalletContract', 'contractList']) getContractList;
    @select(['wallet', 'myWalletContract', 'updatedContractList']) updateContractList;

    constructor(
        private contractService: ContractService,
        private alertsService: AlertsService,
        private memberSocketService: MemberSocketService,
        private walletService: MyWalletsService,
        private walletNodeRequest: WalletNodeRequestService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngRedux: NgRedux<any>,
        @Inject(APP_CONFIG) private appConfig: AppConfig,
    ) { }

    public ngOnInit() {
        this.tabControl = new TabControl({
            title: 'Search',
            icon: 'search',
            active: false,
            data: {
                template: 'contractsListTab',
            },
        });
        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetectorRef.markForCheck();
            }),
        );

        this.token = this.memberSocketService.token;
        if (this.updateContractList) {
            this.updateContractList.subscribe(
                (data) => {
                    if (this.walletId === '0' || this.walletId === null) {
                        this.walletId = '5';
                    }
                    const asyncTaskPipe = this.walletNodeRequest.requestContractsByWallet({
                        walletId: this.walletId,
                    });
                    this.ngRedux.dispatch(SagaHelper.runAsync(
                        [SET_CONTRACT_LIST],
                        [],
                        asyncTaskPipe,
                        {},
                        () => {
                            this.changeDetectorRef.markForCheck();
                        },
                    ));
                },
            );
        }
        if (this.getUser) {
            this.getUser.subscribe(data => this.userId = data);
        }

        this.getConnectedWallet.subscribe((data) => {
            this.walletId = data;
            const asyncTaskPipe = this.walletService.requestWalletLabel({ walletId: data });
            return new Promise((resolve, reject) => {
                this.ngRedux.dispatch(
                    SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        (data) => {
                            _.each(data[1].Data, (address) => {
                                this.addresses[address.option] = address;
                            });

                            const asyncTaskPipe = this.walletNodeRequest.requestContractsByWallet({
                                walletId: this.walletId,
                            });
                            this.ngRedux.dispatch(SagaHelper.runAsync(
                                [SET_CONTRACT_LIST],
                                [],
                                asyncTaskPipe,
                                {},
                                () => {
                                    this.changeDetectorRef.markForCheck();
                                },
                            ));
                            resolve();
                        },
                        (error) => {
                            reject(error);
                        },
                    ),
                );
            });
        });

        this.subscriptions.push(this.getContractList.subscribe((data) => {
            if (typeof data === 'undefined' || data.length <= 0) {
                return;
            }
            this.contracts = data[0].contractData.map((contract) => {
                return this.updateContract(this.contractService.fromJSON(contract, this.addresses));
            });
        }));
    }

    private updateContract(contract: ContractModel) {
        if (this.tabs) {
            const tab = this.tabs.find(
                this.findTab(contract.__address, 'contractDetails'),
            );

            if (tab) {
                tab.data.contract = contract;
            }
        }
        return contract;
    }

    public ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public commitAuthorisation(index: number, contract: ContractModel): void {
        index += 1;
        console.log('INDEX:', index);
        let contractJson = JSON.parse(this.contractService.toJSON(contract));
        contractJson = contractJson.contractdata;
        console.log('CONTRACT JSON:', contractJson);
        const commitment = [];
        _.each(contractJson.parties[index][2], (payListItem, i) => {
            commitment[i] = [i, payListItem[1], payListItem[2], payListItem[3], '', ''];
        });
        const receive = [];
        _.each(contractJson.parties[index][3], (recieveListItem, i) => {
            receive[i] = [i, contract.parties[index - 1].sigAddress];
        });

        const asyncTaskPipe = this.walletNodeRequest.walletCommitToContract({
            walletid: this.walletId,
            address: contract.parties[index - 1].sigAddress,
            function: contract.function + '_commit',
            contractdata: {
                commitment,
                receive,
                contractfunction: contract.function + '_commit',
                issuingaddress: contract.issuingaddress,
                contractaddress: contract.address,
                parties: contractJson.parties,
                authorise: contractJson.authorisations,
            },
            contractaddress: contract.address,
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            () => {
            },
            () => {
            },
        ));
    }

    public commitParty(index: number, contract: ContractModel): void {
        index += 1;
        console.log('INDEX:', index);
        let contractJson = JSON.parse(this.contractService.toJSON(contract));
        contractJson = contractJson.contractdata;
        console.log('CONTRACT JSON:', contractJson);
        const commitment = [];
        _.each(contractJson.parties[index][2], (payListItem, i) => {
            commitment[i] = [i, payListItem[1], payListItem[2], payListItem[3], '', ''];
        });
        const receive = [];
        _.each(contractJson.parties[index][3], (receiveListItem, i) => {
            receive[i] = [i, contract.parties[index - 1].sigAddress];
        });

        const asyncTaskPipe = this.walletNodeRequest.walletCommitToContract({
            walletid: this.walletId,
            address: contract.parties[index - 1].sigAddress,
            function: contract.function + '_commit',
            contractdata: {
                commitment,
                receive,
                contractfunction: contract.function + '_commit',
                issuingaddress: contract.issuingaddress,
                contractaddress: contract.address,
                party: [
                    contract.parties[index - 1].partyIdentifier,
                    '',
                    '',
                ],
                parties: contractJson.parties,
                authorise: contractJson.authorisations,
            },
            contractaddress: contract.address,
        });
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.showAlert('Committing to Contract', 'success');
            },
        ));
    }

    /**
     * Handle View
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    public handleView(contract): void {
        if (this.tabControl.activate(this.findTab(contract.__address, 'contractDetails'))) {
            return;
        }

        /* Push the edit tab into the array. */
        this.tabControl.new({
            title: contract.name,
            icon: 'search',
            active: false,
            data: {
                contract,
                address: contract.__address,
                template: 'contractDetails',
            },
        });
    }

    /**
     * Return a function to handle filtering tabControl by hash and template
     *
     * @param {string} address
     * @param {string} template
     *
     * @returns {(tab) => boolean}
     */
    private findTab(address: string, template: string) {
        return tab => tab.data.address === address && tab.data.template === template;
    }

    /**
     * Close Tab
     * ---------
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {number} index - the tab index to close.
     *
     * @return {void}
     */
    closeTab(index: number) {
        this.tabControl.close(index);
    }

    /**
     * Show Alert
     *
     * @param {string} message
     * @param {string} level
     *
     * @return {void}
     */
    public showAlert(message, level = 'error') {
        this.alertsService.create(level as AlertType, `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-${level}">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }
}
