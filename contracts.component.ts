import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {ContractService} from '@setl/core-contracts/services/contract.service';


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
    public contracts;
    public contract;
    public contractFields;

    public tabsControl: any;

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    /**
     * Constructor
     */
    public constructor(
        private contractService: ContractService,
        private alertsService: AlertsService,
        private memberSocketService: MemberSocketService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngRedux: NgRedux<any>,
        @Inject(APP_CONFIG) private appConfig: AppConfig
    ) {
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
                }
            );
        }

        this.tabsControl = this.defaultTabControl();

        let contract = this.loadContract();
        console.log(contract);
        this.exportContract(contract);
        this.contracts = [
            contract
        ];

        this.contractFields = [];
        for (let prop in contract) {
            this.contractFields.push(prop);
        }
    }

    /**
     * Default Tab Control Array
     *
     * @returns {array} [{title: string; asset: number; active: boolean}]
     */
    defaultTabControl() {
        return [
            {
                title: '<i class="fa fa-th-list"></i> Contracts',
                hash: null,
                active: true
            },
        ];
    }

    public loadContract() {
        console.log('Loading Contract');
        const contractJSON = require('../../contract.json');
        return this.contractService.fromJSON(contractJSON);
    }

    public exportContract(contract) {
        console.log('Contract JSON:', this.contractService.toJSON(contract));
    }

    /**
     * Handle View
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    public handleView(index: number): void {
        /* Check if the tab is already open. */
        for (let i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].hash === this.contracts[index].hash) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array. */
        const contract = this.contracts[index];

        /* And also pre-fill the form... let's sort some of the data out. */
        this.tabsControl.push({
            title: '<i class="fa fa-th-list"></i> ' + contract.name,
            template: 'contractDetails',
            contract: contract,
            hash: this.contracts.hash,
            active: false
        });

        console.log('TAB CONTROL: ', this.tabsControl.length);

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);
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
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        /* Reset tabs. */
        this.setTabActive(0);
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {number} index - the tab index to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
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

    public ngOnInit() {

    }

    public ngOnChanges() {
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
