import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { fromJS } from 'immutable';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ChainService } from '@setl/core-req-services/chain/service';
import { chainsFieldsModel, chainsListActions } from './chains.model';

@Component({
    selector: 'app-manage-chains',
    styleUrls: ['./chains.component.scss'],
    templateUrl: './chains.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageChainsComponent implements OnInit, AfterViewInit, OnDestroy {
    tabsControl: {}[];
    language = 'en';
    chainsList = [];

    public chainsFieldsModel = chainsFieldsModel;
    public chainsListActions = chainsListActions;

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    // List of redux observable
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['chain', 'chainList', 'requested']) requestedChainOb;
    @select(['chain', 'chainList', 'chainList']) chainListOb;

    constructor(private fb: FormBuilder,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private chainService: ChainService,
                private confirmationService: ConfirmationService,
                public translate: MultilingualService,
    ) {

        this.tabsControl = [
            {
                title: `<i class="fa fa-search"></i> ${this.translate.translate('Search')}`,
                chainId: -1,
                active: true,
            },
            {
                title: `<i class="fa fa-plus"></i> ${this.translate.translate('Add New Chain')}`,
                chainId: -1,
                formControl: new FormGroup(
                    {
                        chainId: new FormControl('', Validators.compose([Validators.required, this.isInteger])),
                        chainName: new FormControl('', Validators.required),
                    },
                ),
                active: false,
            },
        ];

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(locale => this.getLanguage(locale)));
        this.subscriptionsArray.push(this.requestedChainOb.subscribe(requested =>
            this.getChainsListRequested(requested)));
        this.subscriptionsArray.push(this.chainListOb.subscribe(chainsList => this.getChainsListFromRedux(chainsList)));
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
            ChainService.defaultRequestChainsList(this.chainService, this.ngRedux);
        }
    }

    getChainsListFromRedux(chainsList) {
        const listImu = fromJS(chainsList);

        let index = 0;
        this.chainsList = listImu.reduce(
            (result, item) => {
                result.push({
                    chainId: item.get('chainId', 0),
                    chainName: item.get('chainName', ''),
                    index,
                });
                index += 1;
                return result;
            },
            [],
        );

        this.markForCheck();
    }

    isInteger(control: FormControl) {
        const chainid = control.value;
        if (Number.isInteger(chainid)) {
            return null;
        }
        return { invalid: true };
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
            // Show loading modal
            this.alertsService.create('loading');

            const chainId = this.tabsControl[tabId]['formControl'].value.chainId;
            const chainName = this.tabsControl[tabId]['formControl'].value.chainName;

            // Create a saga pipe
            const asyncTaskPipe = this.chainService.saveChain(
                {
                    chainId,
                    chainName,
                },
                this.ngRedux,
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('Chain created successfully.'),
                    );
                },
                (data) => {
                    const reason = !_.isEmpty(data[1].Data[0].Message) ?
                        `${this.translate.translate('Reason')}:<br> ${data[1].Data[0].Message}` : '';
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to create chain. @reason@', { reason }),
                    );
                },
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
            // Show loading modal
            this.alertsService.create('loading');

            const chainId = this.tabsControl[tabId]['formControl'].value.chainId;
            const chainName = this.tabsControl[tabId]['formControl'].value.chainName;

            // Create a saga pipe
            const asyncTaskPipe = this.chainService.updateChain(
                {
                    chainId,
                    chainName,
                },
                this.ngRedux,
            );

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    ChainService.setRequested(false, this.ngRedux);
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('Chain updated successfully.'),
                    );

                    this.tabsControl[tabId]['title'] = `<i class="fa fa-chain"></i> ${chainName}`;
                },
                (data) => {
                    const reason = !_.isEmpty(data[1].Data[0].Message) ?
                        `${this.translate.translate('Reason')}:<br> ${data[1].Data[0].Message}` : '';
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to update chain. @reason@', { reason }),
                    );
                },
            ));
        }
    }

    /**
     * Handles clicks on datagrid action buttons
     * @param action
     */
    onAction(action) {
        if (action.type === 'editChain') this.handleEdit(action.data.index);
        if (action.type === 'deleteChain') this.handleDelete(action.data);
    }

    /**
     * Handle edit click
     *
     * @param index
     */
    handleEdit(index: number): void {
        /* Check if the tab is already open */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i]['chainId'] === this.chainsList[index].chainId) {
                this.setTabActive(i);
                return;
            }
        }

        /* Push the edit tab into the array */
        const chain = this.chainsList[index];

        this.tabsControl.push({
            title: `<i class="fa fa-chain"></i> ${chain.chainName}`,
            chainId: chain.chainId,
            formControl: new FormGroup(
                {
                    chainId: new FormControl(chain.chainId),
                    chainName: new FormControl(chain.chainName, Validators.required),
                },
            ),
            active: false,
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
        /* Ask the user if they're sure... */
        this.confirmationService.create(
            `<span>${this.translate.translate('Deleting a Chain')}</span>`,
            `<span class="text-warning">${this.translate.translate(
                'Are you sure you want to delete @chainName@?',
                { chainName: chain.chainName })}</span>`,
        ).subscribe((ans) => {
            /* ...if they are, send the delete request... */
            if (ans.resolved) {
                // Show loading modal
                this.alertsService.create('loading');

                const asyncTaskPipe = this.chainService.deleteChain(
                    {
                        chainId: chain.chainId,
                    },
                    this.ngRedux,
                );

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    () => {
                        ChainService.setRequested(false, this.ngRedux);
                        this.alertsService.generate(
                            'success',
                            this.translate.translate('Chain deleted successfully.'),
                        );
                    },
                    (data) => {
                        const reason = !_.isEmpty(data[1].Data[0].Message) ?
                            `${this.translate.translate('Reason')}:<br> ${data[1].Data[0].Message}` : '';
                        this.alertsService.generate(
                            'error',
                            this.translate.translate('Failed to delete chain. @reason@', { reason }),
                        );
                    },
                ));
            }
        });
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
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
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

    markForCheck() {
        this.changeDetectorRef.markForCheck();
    }
}
