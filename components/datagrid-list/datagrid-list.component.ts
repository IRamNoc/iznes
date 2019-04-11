import {
    Component,
    Injectable,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    AfterViewInit,
    ElementRef,
    QueryList,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import { ClrDatagrid, ClrDatagridSortOrder, ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { NgRedux } from '@angular-redux/store';
import { DatagridListFieldModel } from './models/datagrid-list-field.model';
import { DatagridListActionModel } from './models/datagrid-list-action.model';
import {
    DatagridFieldsInterface,
    DatagridListData,
    DatagridSearchForm,
    ExportOptionsInterface,
} from './models/datagrid-list-inputs.interface';
import { DataGridStringFilter } from './filters/string.filter';
import { PermissionsService } from '@setl/utils';
import { FormItemType } from '@setl/utils/components/dynamic-forms';
import { FileService, PdfService } from '@setl/core-req-services';
import * as SagaHelper from '@setl/utils/sagaHelper/index';
import { DynamicFormComponent } from '@setl/utils/components/dynamic-forms/component';
import { AlertsService } from '@setl/jaspero-ng2-alerts/src/alerts.service';
import { cloneDeep, get } from 'lodash';
import { Buffer } from 'buffer';
import * as json2csv from 'json2csv';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'datagrid-list',
    templateUrl: './datagrid-list.component.html',
    styleUrls: ['./datagrid-list.styles.scss'],
})

@Injectable()

export class DatagridListComponent implements OnInit, AfterViewInit {
    @ViewChild('searchDynamicForm') public searchDynamicForm: DynamicFormComponent;
    @ViewChild('dataGrid') public dataGrid: ClrDatagrid;
    @ViewChildren('dataGridFilter', { read: ElementRef }) public dataGridFilter: QueryList<ElementRef>;

    @Input() fieldsModel: DatagridFieldsInterface;
    @Input() listData: DatagridListData[] = [];
    @Input() listActions: DatagridListActionModel[];
    @Input() filters: any = {};
    @Input() searchEnabled: boolean = false;
    @Input() searchForm: DatagridSearchForm;
    @Input() currentPage: number;
    @Input() totalItems: number = 0;
    @Input() lazyLoaded: boolean = false;
    @Input() showHideColumns: boolean = false;
    @Input() set exportOptions(options: ExportOptionsInterface) { this.export = { ...options }; }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() currentPageChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() rowsUpdate: EventEmitter<any> = new EventEmitter<any>();

    public listFields: DatagridListFieldModel[] = [];
    public defaultSortOrder = ClrDatagridSortOrder.DESC;
    public exportFileHash: string = '';
    public exportModalDisplay: boolean = false;
    public export: ExportOptionsInterface = {
        csv: false,
        pdf: false,
    };
    public csvBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
    public pdfBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

    public constructor(
        public ngRedux: NgRedux<any>,
        public fileService: FileService,
        public changeDetectorRef: ChangeDetectorRef,
        public permissionsService: PermissionsService,
        public pdfService: PdfService,
        private alertsService: AlertsService,
        private multilingual: MultilingualService,
    ) {}

    public ngOnInit() {
        // Prepare list fields
        if (this.fieldsModel) {
            for (const propName in this.fieldsModel) {
                this.listFields.push(
                    new DatagridListFieldModel({
                        name: propName,
                        label: this.fieldsModel[propName].label,
                        type: this.fieldsModel[propName].type,
                        options: this.fieldsModel[propName].options || {},
                    }),
                );
            }
        }

        // Prepare search form
        if (typeof this.searchForm !== 'undefined') {
            Object.keys(this.searchForm).map((field) => {
                // setup date range fields
                if (this.searchForm[field].type === FormItemType.dateRange) {
                    this.searchForm[`${field}_from`] = cloneDeep(this.searchForm[field]);
                    this.searchForm[`${field}_from`].type = FormItemType.date;
                    this.searchForm[`${field}_from`].hidden = () => { return true; };
                    this.searchForm[`${field}_to`] = cloneDeep(this.searchForm[field]);
                    this.searchForm[`${field}_to`].type = FormItemType.date;
                    this.searchForm[`${field}_to`].hidden = () => { return true; };
                }
                this.searchForm[field].required = false;
                this.searchForm[field].disabled = false;
            });
        }
    }

    public ngAfterViewInit() {
        this.dataGridFilter.forEach((filter) => {
            filter.nativeElement.children[0].removeChild(filter.nativeElement.children[0].children[0]);
        });
    }

    /**
     * Handles clicks on action buttons
     *
     * @param action
     * @param data
     */
    handleOnClick(action, data) {
        // Emit directly if action type passed in as string
        if (typeof action === 'string') {
            return this.action.emit({
                type: action,
                data,
            });
        }

        // Or execute callback function
        if (typeof action === 'function') action(data);
    }

    /**
     * Filter Value
     *
     * @param field
     * @returns {any}
     */
    public filterValue(field) {
        if (typeof (this.filters[field]) !== 'undefined' &&
            typeof (this.searchDynamicForm) !== 'undefined' &&
            typeof (this.searchDynamicForm.form) !== 'undefined' &&
            this.filters[field].filterType === 'DataGridDateRangeFilter'
        ) {
            const dateRangeFilter = this.filters[field];
            let dateRange = `${this.searchDynamicForm.form.value[dateRangeFilter.fromField]}
            <>${this.searchDynamicForm.form.value[dateRangeFilter.toField]}`;
            if (dateRange === '<>') {
                dateRange = '';
            }
            const newValue = {};
            newValue[field] = dateRange;
            this.searchDynamicForm.form.patchValue(newValue);
        }
        if (typeof this.searchDynamicForm === 'undefined' ||
            this.searchDynamicForm.form.value[field] === null ||
            typeof this.searchDynamicForm.form.value[field] === 'undefined'
        ) {
            return '';
        }
        if (Array.isArray(this.searchDynamicForm.form.value[field])) {
            return this.searchDynamicForm.form.value[field].map((selectedOption) => {
                return selectedOption.id.toString();
            }).join('||');
        }

        return this.searchDynamicForm.form.value[field].toString();
    }

    /**
     * Get Filter
     *
     * @param field
     * @returns {any}
     */
    public getFilter(field) {
        if (!this.filters[field]) {
            this.filters[field] = new DataGridStringFilter(field);
        }
        return this.filters[field];
    }

    /**
     * Exports current dataGrid List to CSV format
     *
     * @return {void}
     */
    public exportCSV() {
        this.csvBtnState = ClrLoadingState.LOADING;

        const exportData = this.dataGrid.items['_filtered'];

        if (exportData.length === 0) {
            this.alertsService.generate('error', this.multilingual.translate('There is no data to export'));
            return;
        }

        const fileData = {
            name: this.export['csvFileName'],
            data: Buffer.from(json2csv.parse(exportData, {})).toString('base64'),
            status: '',
            filePermission: 1,
        };

        const asyncTaskPipe = this.fileService.addFile({
            files: [fileData],
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                const file = get(data, '[1].Data[0][0]', false);

                if (file && file.fileHash) {
                    this.exportFileHash = file.fileHash;
                    this.csvBtnState = ClrLoadingState.SUCCESS;
                    this.exportModalDisplay = true;
                    this.changeDetectorRef.detectChanges();
                } else {
                    this.csvBtnState = ClrLoadingState.DEFAULT;
                    this.alertsService.generate(
                        'error',
                        this.multilingual.translate('Something went wrong. Please try again later.'),
                    );
                }
            },
            (data) => {
                const error = get(data, '[1].Data[0][0].error', '');
                if (error) console.error('error');
                this.csvBtnState = ClrLoadingState.DEFAULT;
                this.alertsService.generate(
                    'error',
                    this.multilingual.translate('Something went wrong. Please try again later.'),
                );
            }),
        );
    }

    /**
     * Exports current dataGrid List to PDF
     *
     * @return {void}
     */
    exportPDF() {
        this.pdfBtnState = ClrLoadingState.LOADING;
        const exportData = this.dataGrid.items['_filtered'];

        const titles = {};
        this.listFields.forEach(title => titles[title.name] = title.label);

        const reportData = exportData.map((data) => {
            return Object.keys(data).reduce((acc, key) => (titles[key] ? acc[titles[key]] = data[key] : '', acc), {});
        });

        const metadata = {
            title: this.export.pdfOptions.title,
            subtitle: this.export.pdfOptions.subtitle,
            text: this.export.pdfOptions.text,
            data: reportData,
            rightAlign: (this.export.pdfOptions.rightAlign || []).map(prop => titles[prop]),
            walletName: this.export.pdfOptions.walletName,
            date: this.export.pdfOptions.date,
        };

        const asyncTaskPipe = this.pdfService.createPdfMetadata({ type: null, metadata });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (successResponse) => {
                const pdfID = get(successResponse, '[1].Data[0].pdfID', 0);

                if (!pdfID) {
                    this.pdfBtnState = ClrLoadingState.DEFAULT;
                    return this.alertsService.generate(
                        'error', 'Something has gone wrong. Please try again later');
                }

                const pdfOptions = {
                    orientation: this.export.pdfOptions.orientation,
                    border: this.export.pdfOptions.border,
                    footer: this.export.pdfOptions.footer,
                };

                this.pdfService.getPdf(pdfID, this.export.pdfOptions.file, pdfOptions).then((response) => {
                    this.exportFileHash = response;
                    this.pdfBtnState = ClrLoadingState.SUCCESS;
                    this.exportModalDisplay = true;
                    this.changeDetectorRef.detectChanges();
                }).catch((e) => {
                    console.error(e);
                    this.pdfBtnState = ClrLoadingState.DEFAULT;
                    this.alertsService.generate(
                        'error', 'Something has gone wrong. Please try again later');
                });
            },
            (e) => {
                console.error(e);
                this.pdfBtnState = ClrLoadingState.DEFAULT;
                this.alertsService.generate(
                    'error', 'Something has gone wrong. Please try again later');
            }),
        );
    }

    /**
     * Refresh
     * Called every time the Datagrid state requires some form of reloading/refresh
     *
     * @param {ClrDatagridStateInterface} dataGridState
     * @return {void}
     */
    public handleRefresh(dataGridState: ClrDatagridStateInterface) {
        this.refresh.emit(dataGridState);
    }
}
