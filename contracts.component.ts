import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, OnChanges} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {ContractService} from '@setl/core-contracts/services';
import {MyWalletsService} from '@setl/core-req-services/my-wallets/my-wallets.service';
import {WalletNodeRequestService} from '@setl/core-req-services/walletnode-request/walletnode-request.service';
import {Subscription} from 'rxjs/Subscription';
import {TabControl, Tab} from '@setl/core-balances/tabs';
import * as _ from 'lodash';
import {ContractModel} from '@setl/core-contracts/models';
import {SET_CONTRACT_LIST} from '@setl/core-store/wallet/my-wallet-contract/actions';


@Component({
    selector: 'setl-contracts',
    templateUrl: 'contracts.component.html',
    styleUrls: ['contracts.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContractsComponent implements OnInit, OnChanges {
    public token: string = null;
    public userId: string = null;
    public walletId: string = null;
    public addresses: Array<any> = [];
    public contracts: Array<ContractModel> = [];
    public contract;
    public contractFields;

    public tabControl: TabControl;
    public tabs: Tab[];

    private subscriptions: Array<Subscription> = [];

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    @select(['wallet', 'myWalletContract', 'contractList']) getContractList;

    /**
     * Constructor
     */
    public constructor(private contractService: ContractService,
                       private alertsService: AlertsService,
                       private memberSocketService: MemberSocketService,
                       private walletService: MyWalletsService,
                       private walletNodeRequestService: WalletNodeRequestService,
                       private changeDetectorRef: ChangeDetectorRef,
                       private ngRedux: NgRedux<any>,
                       @Inject(APP_CONFIG) private appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.token = this.memberSocketService.token;
        if (this.getUser) {
            this.getUser.subscribe(
                (data) => {
                    this.userId = data;
                }
            );
        }
        if (this.getConnectedWallet) {
            this.getConnectedWallet.subscribe(
                (data) => {
                    this.walletId = data;
                    const asyncTaskPipe = this.walletService.requestWalletLabel({walletId: this.walletId});
                    return new Promise((resolve, reject) => {
                        this.ngRedux.dispatch(
                            SagaHelper.runAsyncCallback(
                                asyncTaskPipe,
                                (data) => {
                                    _.each(data[1].Data, (address) => {
                                        this.addresses[address.option] = address;
                                    });

                                    const asyncTaskPipe = this.walletNodeRequestService.requestContractsByWallet({
                                        walletId: this.walletId
                                    });
                                    this.ngRedux.dispatch(SagaHelper.runAsync(
                                        [SET_CONTRACT_LIST],
                                        [],
                                        asyncTaskPipe,
                                        {},
                                        () => {
                                        },
                                        () => {
                                        }
                                    ));
                                },
                                (error) => {
                                    reject(error);
                                }
                            )
                        );
                    });
                }
            );
        }

        this.subscriptions.push(this.getContractList.subscribe((data) => {
            if (typeof data === 'undefined' || data.length <= 0) {
                return;
            }

            data = _.groupBy(data[0].contractData, (contract) => contract.__address);
            this.contracts = [];
            _.each(data, (contract) => {
                this.contract = this.contractService.fromJSON(contract[0], this.addresses);
                this.contracts.push(this.contract);
            });
            this.contractFields = [];
            for (const prop in this.contract) {
                this.contractFields.push(prop);
            }
            this.changeDetectorRef.markForCheck();
        }));
    }

    public commitAuthorisation(index: number, contract: ContractModel): void {
        index++;
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

        const asyncTaskPipe = this.walletNodeRequestService.walletCommitToContract({
            walletid: this.walletId,
            address: contract.parties[index - 1].sigAddress,
            function: contract.function + '_commit',
            contractdata: {
                contractfunction: contract.function + '_commit',
                issuingaddress: contract.issuingaddress,
                contractaddress: contract.address,
                party: [
                    contract.parties[index - 1].partyIdentifier,
                    '',
                    ''
                ],
                parties: contractJson.parties,
                commitment: commitment,
                receive: receive,
                authorise: contractJson.authorisations
            },
            contractaddress: contract.address
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            () => {
            },
            () => {
            }
        ));
    }

    public commitParty(index: number, contract: ContractModel): void {
        index++;
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

        const asyncTaskPipe = this.walletNodeRequestService.walletCommitToContract({
            walletid: this.walletId,
            address: contract.parties[index - 1].sigAddress,
            function: contract.function + '_commit',
            contractdata: {
                contractfunction: contract.function + '_commit',
                issuingaddress: contract.issuingaddress,
                contractaddress: contract.address,
                party: [
                    contract.parties[index - 1].partyIdentifier,
                    '',
                    ''
                ],
                parties: contractJson.parties,
                commitment: commitment,
                receive: receive,
                authorise: contractJson.authorisations
            },
            contractaddress: contract.address
        });
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            () => {
            },
            () => {
            }
        ));
    }

    /**
     * Handle View
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    public handleView(index: number): void {
        if (this.tabControl.activate(this.findTab(this.contracts[index].__address, 'contractDetails'))) {
            return;
        }

        /* Push the edit tab into the array. */
        const contract = this.contracts[index];

        /* And also pre-fill the form... let's sort some of the data out. */
        this.tabControl.new({
            title: '<i class="fa fa-th-list"></i> ' + contract.name,
            icon: 'th-list',
            active: false,
            data: {
                contract: contract,
                address: contract.__address,
                template: 'contractDetails'
            }
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
        return (tab) => tab.data.address === address && tab.data.template === template;
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

    public ngOnInit() {
        this.tabControl = new TabControl({
            title: 'Contracts',
            icon: 'th-list',
            active: false,
            data: {
                template: 'contractsListTab'
            }
        });
        this.subscriptions.push(
            this.tabControl.getTabs().subscribe((tabs) => {
                this.tabs = tabs;
                this.changeDetectorRef.markForCheck();
            })
        );
        this.changeDetectorRef.markForCheck();
    }

    public ngOnChanges() {
    }

    public ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
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
