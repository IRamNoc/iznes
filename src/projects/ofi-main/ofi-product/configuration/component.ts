import _ from 'lodash';
import {
    Component,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef, Optional,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    OfiProductConfigService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/configuration/service';
import {
    ProductConfiguration,
    setRequestedConfiguration,
    clearRequestedConfiguration,
} from '@ofi/ofi-main/ofi-store/ofi-product';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-ofi-product-configuration',
    templateUrl: './component.html',
    styles: ['.btn { margin-top: 20px; }'],
})

export class ProductConfigurationComponent implements OnInit, OnDestroy {
    dates: () => string[];

    @select([
        'ofi', 'ofiProduct', 'ofiProductConfiguration', 'requestedConfiguration',
    ]) configRequestedOb: Observable<any>;
    @select([
        'ofi', 'ofiProduct', 'ofiProductConfiguration', 'configuration',
    ]) configOb: Observable<any>;

    private subscriptionsArray: Subscription[] = [];
    config: ProductConfiguration;
    panelDef: any = {};
    panelColumns = {};
    rowOffset = 0;
    currentPage = 1;
    firstInit = false;
    itemPerPage = 0;
    lastPage = 0;
    total = 0;

    calendarDates: () => string[];

    /* Calendar modal settings */
    showCalendarModal: boolean = false;
    isEditMode: boolean = false;
    calendarFormGroup: FormGroup;
    selectedCalendarModel: any = {};

    constructor(
        private service: OfiProductConfigService,
        private redux: NgRedux<any>,
        private toaster: ToasterService,
        public translate: MultilingualService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.initPanelColumns();
        this.initForm();
        this.redux.dispatch(clearRequestedConfiguration());
        this.initSubscriptions();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.configRequestedOb
            .subscribe((requested: boolean) => {
                this.requestConfig(requested);
            }));
        this.subscriptionsArray.push(this.configOb
            .subscribe((config: ProductConfiguration) => {
                this.updateConfig(config);
            }));
    }

    refresh(state) {
       return;
    }

    /**
     * init calendar form
     * @return void
    */
    private initForm() {
        this.calendarFormGroup = this.fb.group({
            name: [{ value: '' }, Validators.required],
            data: [{ value: [null] }, Validators.required],
            isActive: [{ value: 0 }, Validators.required],
        });
    }

    /**
     * init panel columns of datagrid
     * @return void
     */
    initPanelColumns(): void {
        this.panelColumns = {
            calendarName: {
                label: 'Calendar name',
                dataSource: 'name',
                sortable: true,
            },
            createdAt: {
                label: 'Created at',
                dataSource: 'createdAt',
                sortable: true,
            },
            isActive: {
                label: 'Is active',
                dataSource: 'isActive',
                sortable: true,
            },
            action: {
                label: 'Action',
                dataSource: 'action',
                type: 'action',
            }
        };

        this.panelDef = {
            columns: [
                this.panelColumns['calendarName'],
                this.panelColumns['createdAt'],
                this.panelColumns['isActive'],
                this.panelColumns['action']
            ],
            open: true,
        };
    }

    /**
     * request the product config
     * @param requested boolean
     * @return void
     */
    private requestConfig(requested: boolean): void {
        if (requested) return;

        OfiProductConfigService.defaultRequestProductConfig(this.service, this.redux);
    }

    /**
     * get the product config
     * @param config ProductConfiguration
     * @return void
     */
    private updateConfig(config: ProductConfiguration): void {
        if (!config.calendarModels) return;
        this.config = config.calendarModels;

        this.redux.dispatch(setRequestedConfiguration());
        this.panelDef.data = this.convertToJS(this.config);

        this.total = this.panelDef.data.length;
        this.itemPerPage = this.total;
        this.detectChanges(true);
    }

    private convertToJS(config: ProductConfiguration): any {
        return _.map(config, (k) => {
            return {
                calendarID: k.calendarID,
                name: k.calendarName,
                data: JSON.parse(k.calendarData),
                isActive: k.calendarIsActive,
                createdAt: k.dateEntered,
            }
        });
    }

    setDates(dates: () => string[]): void {
        this.calendarDates = dates;
    }

    saveConfiguration(): void {
        const requestData = {
            type: this.isEditMode ? 'update' : 'create',
            calendarName: this.calendarFormGroup.controls['name'].value,
            calendarData: JSON.stringify(this.calendarDates()),
            calendarID: this.isEditMode ? this.selectedCalendarModel.calendarID : 0,
            calendarIsActive: this.calendarFormGroup.controls['isActive'].value,
        };

        OfiProductConfigService.defaultUpdateProductConfig(
            this.service,
            this.redux,
            requestData['type'],
            requestData,
            (data: any) => this.onCreateSuccess(),
            (e: any) => this.onCreateError(e[1].Data[0]));
    }

    private onCreateSuccess(): void {
        this.isEditMode = false;
        this.showCalendarModal = false;
        this.redux.dispatch(clearRequestedConfiguration());

        this.toaster.pop('success', this.translate.translate('Product configuration saved successfully'));
    }

    private onCreateError(e): void {
        this.toaster.pop('error', this.translate.translate('ERROR') + ': ' + e.Message);
    }

    /**
     * Diplay calendar modal for create / edit
     * @param type
     * @param calendarID
     * @return void
     */
    displayCalendarModal(type: string, calendarID?: number): void {
        this.isEditMode = type === 'edit' ? true : false;
        this.showCalendarModal = true;
        this.calendarFormGroup.reset();
        this.calendarFormGroup.controls['isActive'].setValue(1); // set true by default
        if (this.isEditMode) {
            this.selectedCalendarModel = _.find(this.panelDef.data, { calendarID });
            this.calendarFormGroup.controls['name'].setValue(this.selectedCalendarModel.name);
            this.calendarFormGroup.controls['data'].setValue(this.selectedCalendarModel.data);
            this.calendarFormGroup.controls['isActive'].setValue(this.selectedCalendarModel.isActive);
        }
    }

    handleActiveToggleClick() {
        const currentValue = this.calendarFormGroup.controls['isActive'].value;
        return this.calendarFormGroup.controls['isActive'].setValue(!currentValue);
    }

    detectChanges(detect = false) {
        this.cdr.markForCheck();
        if (detect) {
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
        this.cdr.detach();
    }
}
