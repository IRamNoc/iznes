import { Component, Injectable, Input, Output, EventEmitter, ViewChild, ViewChildren, AfterViewInit, ElementRef,
    QueryList, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClrDatagrid, ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { NgRedux } from '@angular-redux/store';
import { DatagridListFieldModel } from './models/datagrid-list-field.model';
import { DatagridListActionModel } from './models/datagrid-list-action.model';
import { DatagridFieldsModel, DatagridListData, DatagridSearchForm } from './models/datagrid-list-inputs.model';
import { DataGridStringFilter } from './filters/string.filter';
import { PermissionsService } from '@setl/utils';
import { FormItemType } from '@setl/utils/components/dynamic-forms';
import { FileService, PdfService } from '@setl/core-req-services';
import * as SagaHelper from '@setl/utils/sagaHelper/index';
import { DynamicFormComponent } from '@setl/utils/components/dynamic-forms/component';
import { AlertsService } from '@setl/jaspero-ng2-alerts/src/alerts.service';
import { filter, each, cloneDeep, pick, get } from 'lodash';
import { Buffer } from 'buffer';
import * as json2csv from 'json2csv';

@Component({
    selector: 'datagrid-list',
    templateUrl: './datagrid-list.component.html',
})

@Injectable()

export class DatagridListComponent implements OnInit, AfterViewInit {
    @ViewChild('searchDynamicForm') public searchDynamicForm: DynamicFormComponent;
    @ViewChild('dataGrid') public dataGrid: ClrDatagrid;
    @ViewChildren('dataGridFilter', { read: ElementRef }) public dataGridFilter: QueryList<ElementRef>;

    @Input() fieldsModel: DatagridFieldsModel;
    @Input() listData: DatagridListData[] = [];
    @Input() listActions: DatagridListActionModel[];
    @Input() filters: any = {};
    @Input() searchEnabled: boolean = false;
    @Input() searchForm: DatagridSearchForm;
    @Input() currentPage: number;
    @Input() totalItems: number = 0;
    @Input() lazyLoaded: boolean = false;
    @Input() showHideColumns: boolean = false;
    @Input() set exportOptions(options) { this.setExport(options); }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() currentPageChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() rowsUpdate: EventEmitter<any> = new EventEmitter<any>();

    public listFields: DatagridListFieldModel[] = [];
    public defaultSortOrder = ClrDatagridSortOrder.DESC;
    public alertsService: AlertsService;
    public exportFileHash: string = '';
    public exportModalDisplay: boolean = false;
    public export: any = {
        csv: false,
        csvFileName: 'export.csv',
        pdf: false,
        pdfFileName: 'export.pdf',
        pdfOptions: {
            title: '',
            subtitle: '',
            text: '',
            rightAlign: [],
            walletName: '',
            date: '',
        },
    };

    public constructor(
        public ngRedux: NgRedux<any>,
        public fileService: FileService,
        public changeDetectorRef: ChangeDetectorRef,
        public permissionsService: PermissionsService,
        public pdfService: PdfService,
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

        this.alertsService = new AlertsService();

        if (typeof this.searchForm !== 'undefined') {
            Object.keys(this.searchForm).map((field) => {
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
     * Export List
     *
     * Exports current dataGrid List to CSV format
     * @return {void}
     */
    public exportList(type) {
        const options = {};
        const exportData = this.dataGrid.items['_filtered'];
        if (exportData.length === 0) {
            return;
        }
        if (type === 'csv') {
            const encodedCsv = Buffer.from(json2csv.parse(exportData, options)).toString('base64');
            const fileData = {
                name: this.export['csvFileName'],
                data: encodedCsv,
                status: '',
                filePermission: 1,
            };

            const asyncTaskPipe = this.fileService.addFile({
                files: filter([fileData], (file) => {
                    return file.status !== 'uploaded-file';
                }),
            });

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    if (data[1] && data[1].Data) {
                        let errorMessage;
                        each(data[1].Data, (file) => {
                            if (file.error) {
                                errorMessage = file.error;
                            } else {
                                this.exportFileHash = file[0].fileHash;
                                this.showExportModal();
                            }
                        });
                    }
                },
                (data) => {
                    let errorMessage;
                    each(data[1].Data, (file) => {
                        if (file.error) {
                            errorMessage += `${file.error}<br/>`;
                        }
                    });
                    if (errorMessage) {
                        if (errorMessage) {
                        }
                    }
                }),
            );
        } else {
            // generate pdf
            const titles = {};
            const titleKeys = [];
            this.listFields.forEach((title) => {
                titles[title.name] = title.label;
                titleKeys.push(title.name);
            });

            const reportData = exportData.map((data) => {
                return pick(data, titleKeys);
            });
            reportData.unshift(titles);
            console.log('++ reportData', reportData);

            const metadata = {
                title: this.export.pdfOptions.title,
                subtitle: this.export.pdfOptions.subtitle,
                text: this.export.pdfOptions.text,
                reportData,
                rightAlign: this.export.pdfOptions.rightAlign,
                walletName: this.export.pdfOptions.walletName,
                date: this.export.pdfOptions.date,
            };

            const asyncTaskPipe = this.pdfService.createPdfMetadata({ type: null, metadata });

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (successResponse) => {
                    const pdfID = get(successResponse, '[1].Data[0].pdfID', 0);

                    if (!pdfID) {
                        return this.alertsService.generate(
                            'error', 'Something has gone wrong. Please try again later');
                    }

                    const pdfOptions = {
                        orientation: 'portrait',
                        border: { top: '15mm', right: '15mm', bottom: '0', left: '15mm' },
                        footer: {
                            height: '20mm',
                            contents: `
                            <div class="footer">
                                <p class="left">${metadata.title} | {{page}} of {{pages}}</p>
                                <p class="right">${metadata.date}</p>
                            </div>`,
                        },
                    };

                    this.pdfService.getPdf(pdfID, this.export.pdfOptions.file, pdfOptions).then((response) => {
                        this.exportFileHash = response;
                        this.showExportModal();
                        this.alertsService.create('clear');
                    }).catch((e) => {
                        console.error(e);
                        this.alertsService.generate(
                            'error', 'Something has gone wrong. Please try again later');
                    });
                },
                (e) => {
                    console.error(e);
                    this.alertsService.generate(
                        'error', 'Something has gone wrong. Please try again later');
                }),
            );
        }
    }

    /**
     * Show Export Modal
     *
     * @return {void}
     */
    public showExportModal() {
        this.exportModalDisplay = true;
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Hide Export Modal
     *
     * @return {void}
     */
    public hideExportModal() {
        this.exportModalDisplay = false;
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Sets export properties
     *
     * @param options
     */
    public setExport(options) {
        this.export = Object.assign(this.export, options);
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
