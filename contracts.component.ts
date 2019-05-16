import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { SagaHelper } from '@setl/utils';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MemberSocketService } from '@setl/websocket-service';
import { APP_CONFIG, AppConfig } from '@setl/utils';
import { ContractService } from '@setl/core-contracts/services';
import { MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { TabControl, Tab } from '@setl/core-balances/tabs';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ContractModel, PartyModel } from '@setl/core-contracts/models';
import { SET_CONTRACT_LIST } from '@setl/core-store/wallet/my-wallet-contract/actions';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'setl-contracts',
    templateUrl: 'contracts.component.html',
    styleUrls: ['contracts.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractsComponent implements OnInit, OnDestroy {
    public token: string = null;
    public userId: string = null;
    public walletId: number = null;
    public addresses: string[] = [];
    public contracts: ContractModel[] = [];
    public contract;
    public committing: string[] = [];
    public parameterValues = {};
    private unsubscribe = new Subject();
    public pageSize: number;
    public tabControl: TabControl;
    public tabs: Tab[];

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet: Observable<number>;
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
        public translate: MultilingualService,
        @Inject(APP_CONFIG) private appConfig: AppConfig,
    ) {
    }

    public ngOnInit() {
        this.tabControl = new TabControl({
            title: this.translate.translate('Search'),
            icon: 'search',
            active: false,
            data: {
                template: 'contractsListTab',
            },
        });
        this.tabControl.getTabs().pipe(takeUntil(this.unsubscribe)).subscribe((tabs) => {
            this.tabs = tabs;
            this.changeDetectorRef.markForCheck();
        });

        this.token = this.memberSocketService.token;
        if (this.updateContractList) {
            this.updateContractList.pipe(takeUntil(this.unsubscribe)).subscribe(
                (data) => {
                    if (this.walletId === 0 || this.walletId === null) {
                        this.walletId = 5;
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
            this.getUser.pipe(takeUntil(this.unsubscribe)).subscribe(data => this.userId = data);
        }

        this.getConnectedWallet.pipe(takeUntil(this.unsubscribe)).subscribe((data) => {
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

        this.getContractList.pipe(takeUntil(this.unsubscribe)).subscribe(
            (data) => {
                if (typeof data === 'undefined' || data.length <= 0) {
                    return;
                }
                this.contracts = data[0].contractData.map((contract) => {
                    return this.updateContract(this.contractService.fromJSON(contract, this.addresses));
                });
            },
            err => console.error(err),
            done => console.log('Unsubscribed contract list'),
        );
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

    public commitParty(party: PartyModel, contract: ContractModel): void {
        this.contractService.commitParty(party, contract)
        .then((data) => {
            this.committing = [...this.committing, party.partyIdentifier];
            this.changeDetectorRef.markForCheck();
            this.alertsService.generate(
                'success',
                this.translate.translate('Committing to Contract.'),
            );
        })
        .catch(data => console.log('Bad commit', data));
    }

    public commitAuthorisation(index: number, contract: ContractModel): void {
        this.contractService.commitAuthorisation(index, contract)
        .then(() => {
            this.committing = [...this.committing, contract.authorisations[index].publicKey];
            this.changeDetectorRef.markForCheck();
            this.alertsService.generate(
                'success',
                this.translate.translate('Committing to Contract.'),
            );
        })
        .catch(data => console.log('Bad commit', data));
    }

    public updateParameter(key, value) {
        this.parameterValues[key] = value;
        console.log(key, value);
    }

    public commitParameter(key) {
        const value = this.parameterValues[key];

        console.log(`Commit ${key} -> ${value}`);
    }

    /**
     * Takes a commit button type and handles logic of whether to show the button
     *
     * @param type
     * @param contract
     * @param party
     * @return {boolean}
     */
    showCommitButton(type, contract, party): boolean {
        switch (type) {
            case 'committed':
                return party.signature || (contract.issuingaddress === party.sigAddress && !party.mustSign);
            case 'notCommitted':
                return !party.signature && party.sigAddress_label === party.sigAddress && party.payList.length > 0;
            case 'commit':
                return (!party.signature && party.sigAddress_label !== party.sigAddress &&
                    !this.committing.includes(party.partyIdentifier)) &&
                    ((contract.issuingaddress !== party.sigAddress && !party.mustSign) || party.mustSign);
            case 'committing':
                return !party.signature && this.committing.includes(party.partyIdentifier);
            default:
                return false;
        }
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
        this.committing = [];
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
