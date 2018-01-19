import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Inject, OnChanges} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {Contract} from '@setl/core-contracts/contract';


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
    public contracts = [];

    @select(['user', 'connected', 'connectedWallet']) getConnectedWallet;
    @select(['user', 'myDetail', 'userId']) getUser;

    /**
     * Constructor
     */
    public constructor(
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
        let contract = this.loadContract();
        this.exportContract(contract);
    }

    public loadContract() {
        console.log('Loading Contract');
        const contractJSON = {} //require('../../contract.json');
        let contract = Contract.fromJSON(contractJSON);
        return contract;
    }

    public exportContract(contract) {
        console.log('Contract JSON:', contract.toJSON());
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
