import {
    Component,
    Injectable,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    ElementRef,
    QueryList,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ClrDatagrid, ClrDatagridSortOrder, ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { DatagridListFieldModel } from './models/datagrid-list-field.model';
import { DatagridListActionModel } from './models/datagrid-list-action.model';
import { DatagridFieldsInterface, DatagridListData, DatagridSearchForm, ExportOptionsInterface }
from './models/datagrid-list-inputs.interface';
import { FormItemType } from '@setl/utils/components/dynamic-forms';
import * as SagaHelper from '@setl/utils/sagaHelper/index';
import { DynamicFormComponent } from '@setl/utils/components/dynamic-forms/component';
import { AlertsService } from '@setl/jaspero-ng2-alerts/src/alerts.service';
import { MultilingualService } from '@setl/multilingual';
import { FileService, PdfService } from '@setl/core-req-services';
import { cloneDeep, get } from 'lodash';
import * as json2csv from 'json2csv';
import { Buffer } from 'buffer';

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
    @ViewChildren('dataGridSpacer', { read: ElementRef }) public dataGridSpacer: QueryList<ElementRef>;

    @Input() fieldsModel: DatagridFieldsInterface;
    @Input() listData: DatagridListData[] = [];
    @Input() listActions: DatagridListActionModel[];
    @Input() filters: any = {};
    @Input() searchForm: DatagridSearchForm;
    @Input() currentPage: number = 1;
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
    public listRecordsPerPage: number = 5;
    public exportFileHash: string = '';
    public exportModalDisplay: boolean = false;
    public export: ExportOptionsInterface = {
        csv: false,
        pdf: false,
    };
    public csvBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
    public pdfBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
    public showColumnSpacer: boolean = true;

    public constructor(
        public ngRedux: NgRedux<any>,
        public fileService: FileService,
        public changeDetectorRef: ChangeDetectorRef,
        public pdfService: PdfService,
        private alertsService: AlertsService,
        private multilingual: MultilingualService) {}

    public ngOnInit() {
        this.prepareListFields();
        this.prepareSearchForm();
    }

    ngAfterViewInit() {
        this.resizeDatagrid();
    }

    /**
     * Resizes the datagrid and removes the spacer elements
     * The column space elements are a bit of a hack to get the Datagrid to correctly set the cell size
     * hopefully this will be fixed in a Clarity update soon...
     */
    public resizeDatagrid() {
        setTimeout(
            () => {
                this.dataGrid.resize();
                this.showColumnSpacer = false;
            },
            200,
        );
    }

    /**
     * Prepares list fields for use
     * @returns {void}
     */
    prepareListFields() {
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
    }

    /**
     * Sets up the search form
     * @returns {void}
     */
    prepareSearchForm() {
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

    /**
     * Handles clicks on action buttons
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
     * Gets the passed in field's filter value from the search form
     * @param field
     * @returns {any}
     */
    public filterValue(field) {
        // Date range filter
        if (typeof (this.filters[field]) !== 'undefined' &&
            typeof (this.searchDynamicForm) !== 'undefined' &&
            typeof (this.searchDynamicForm.form) !== 'undefined' &&
            this.filters[field].filterType === 'DataGridDateRangeFilter'
        ) {
            const dateRangeFilter = this.filters[field];
            let dateRange = `${this.searchDynamicForm.form.value[dateRangeFilter.fromField]}
            <>${this.searchDynamicForm.form.value[dateRangeFilter.toField]}`;
            if (dateRange === '<>') dateRange = '';
            const newValue = {};
            newValue[field] = dateRange;
            this.searchDynamicForm.form.patchValue(newValue);
        }

        // Return if searchForm empty or undefined
        if (typeof this.searchDynamicForm === 'undefined' || this.searchDynamicForm.form.value[field] === null ||
            typeof this.searchDynamicForm.form.value[field] === 'undefined') {
            return '';
        }

        // Get ngSelect values
        if (Array.isArray(this.searchDynamicForm.form.value[field])) {
            return this.searchDynamicForm.form.value[field].map((selectedOption) => {
                return selectedOption.id.toString();
            }).join('||');
        }

        // Text inputs
        return this.searchDynamicForm.form.value[field].toString();
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
