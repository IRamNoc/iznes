import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {fromJS} from 'immutable';
import * as _ from 'lodash';

import {ChainInterface} from './chains.interface';
import {ChainModel} from './chains.model';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ChainService} from '@setl/core-req-services/chain/service';
import {PersistService} from '@setl/core-persist';

@Component({
    selector: 'app-manage-chains',
    styleUrls: ['./chains.component.scss'],
    templateUrl: './chains.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageChainsComponent implements OnInit, AfterViewInit, OnDestroy {
    tabsControl: Array<object>;
    language = 'en';
    chainsList = [];

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['chain', 'chainList', 'requested']) requestedChainOb;
    @select(['chain', 'chainList', 'chainList']) chainListOb;

    constructor(private _fb: FormBuilder,
                private ngRedux: NgRedux<any>,
                private _changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private _chainService: ChainService,
                private _confirmationService: ConfirmationService,
                private _persistService: PersistService) {

        this.tabsControl = [
            {
                title: '<i class="fa fa-chain"></i> Chains',
                chainId: -1,
                active: true
            },
            {
                title: '<i class="fa fa-plus"></i> Add New Chain',
                chainId: -1,
                formControl: this._persistService.watchForm('manageMember/manageChains', new FormGroup(
                    {
                        chainId: new FormControl('', Validators.compose([Validators.required, this.isInteger])),
                        chainName: new FormControl('', Validators.required)
                    }
                )),
                active: false
            }
        ];

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((locale) => this.getLanguage(locale)));
        this.subscriptionsArray.push(this.requestedChainOb.subscribe((requested) => this.getChainsListRequested(requested)));
        this.subscriptionsArray.push(this.chainListOb.subscribe((chainsList) => this.getChainsListFromRedux(chainsList)));
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    getChainsListRequested(requested): void {
        if (!requested) {
            ChainService.defaultRequestChainsList(this._chainService, this.ngRedux);
        }
    }

    getChainsListFromRedux(chainsList) {
        const listImu = fromJS(chainsList);

        this.chainsList = listImu.reduce((result, item) => {
            result.push({
                chainId: item.get('chainId', 0),
                chainName: item.get('chainName', ''),
            });

            return result;
        }, []);

        this.markForCheck();
    }

    isInteger(control: FormControl) {
        const chainid = control.value;
        if (Number.isInteger(chainid)) {
            return null;
        } else {
            return {invalid: true};
        }
    }

    getLanguage(locale): void {
        if (locale) {
            switch (locale) {
                case 'fra':
                    this.language = 'fr';
                    break;
                case 'eng':
                    this.language = 'en';
                    break;
                default:
                    this.language = 'en';
                    break;
            }
        }
    }

    /**
     * Handle add chain
     *
     * @param {tabid} - The tab id that the form is in
     *
     * @return {void}
     */

    handleAddChain(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            const chainId = this.tabsControl[tabId]['formControl'].value.chainId;
            const chainName = this.tabsControl[tabId]['formControl'].value.chainName;

            // Create a saga pipe
            const asyncTaskPipe = this._chainService.saveChain(
                {
                    chainId,
                    chainName
                },
                this.ngRedux
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    this.showSuccessResponse('Chain created');
                },
                (data) => {
                    this.showErrorResponse(data);
                }
            ));
        }
    }

    /**
     * Handle edit chain
     *
     * @param {tabId}
     *
     * @return {void}
     */
    handleEditChain(tabId: number): void {
        if (this.tabsControl[tabId]['formControl'].valid) {
            const chainId = this.tabsControl[tabId]['formControl'].value.chainId;
            const chainName = this.tabsControl[tabId]['formControl'].value.chainName;

            // Create a saga pipe
            const asyncTaskPipe = this._chainService.updateChain(
                {
                    chainId,
                    chainName
                },
                this.ngRedux
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    this.showSuccessResponse('Chain updated');
                },
                (data) => {
                    this.showErrorResponse(data);
                }
            ));
        }
    }

    /**
     * Handle edit click
     *
     * @param index
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i]['chainId'] === this.chainsList[index].chainId) {
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array */
        const chain = this.chainsList[index];

        this.tabsControl.push({
            title: '<i class="fa fa-chain"></i> ' + chain.chainName,
            chainId: chain.chainId,
            formControl: new FormGroup(
                {
                    chainId: new FormControl(chain.chainId),
                    chainName: new FormControl(chain.chainName)
                }
            ),
            active: false
        });

        // Activate the new tab
        this.setTabActive(this.tabsControl.length - 1);
    }

    /**
     * Handle delete chain
     *
     * @param chain
     */
    handleDelete(chain: any): void {
        const asyncTaskPipe = this._chainService.deleteChain(
            {
                chainId: chain.chainId
            },
            this.ngRedux
        );

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                ChainService.setRequested(false, this.ngRedux);
                this.showSuccessResponse('Chain deleted');
            },
            (data) => {
                this.showErrorResponse(data);
            }
        ));
    }

    /**
    * Handle close tab click
    *
    * @param {index} number - the tab index to close
    *
    * @return {void}
    */
    closeTab(index: number): void {
        if (!index && index !== 0) {
            return;
        }

        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        // Reset tabs
        this.setTabActive(0);

        return;
    }

    setTabActive(index: number): void {
        const tabControlImu = fromJS(this.tabsControl);
        const newTabControlImu = tabControlImu.map((item, thisIndex) => {
            return item.set('active', thisIndex === index);
        });

        this.tabsControl = newTabControlImu.toJS();
    }

    showErrorResponse(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {
        this.alertsService.create('success', `
                    <table class="table grid">
                        <tbody>
                            <tr>
                                <td class="text-center text-success">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
