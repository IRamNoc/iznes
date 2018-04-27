import * as _ from 'lodash';
import {Injectable, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';
import {FileService} from '@setl/core-req-services/file/file.service';
import * as SagaHelper from '@setl/utils/sagaHelper';
import {ToasterService} from 'angular2-toaster';

import {FormItem, FormItemType, FormItemStyle} from './DynamicForm';

@Injectable()
export class DynamicFormService {

    constructor(private fileService: FileService,
                private toaster: ToasterService,
                private redux: NgRedux<any>) {
    }

    generateForm(model: { [key: string]: FormItem }): FormGroup {
        const form = new FormGroup({});

        _.forEach(model, (item: FormItem, index: string) => {
            const formControl: FormControl = this.generateControl(model, index, item);

            form.addControl(index, formControl);
        });

        return form;
    }

    private generateControl(model: { [key: string]: FormItem }, index: string, item: FormItem): FormControl {
        let preset;

        if (item.preset) {
            if (item.type === FormItemType.boolean && (item.preset === "1" || item.preset === "0")) {
                preset = item.preset === "1" ? true : false;
            } else {
                preset = item.preset;
            }
        } else {
            if (item.type === FormItemType.boolean) preset = false;
            if (item.type === FormItemType.text) preset = '';
            if (item.type === FormItemType.textarea) preset = '';
            if (item.type === FormItemType.date) preset = '';
            if (item.type === FormItemType.time) preset = '';
            if (item.type === FormItemType.number) preset = null;
            if (item.type === FormItemType.list) preset = null;
            if (item.type === FormItemType.file) preset = null;
        }

        const validator = (item.required && !item.validator) ? [Validators.required] : item.validator;

        const formControl = new FormControl(preset, validator);

        if (item.disabled) formControl.disable();

        return formControl;
    }

    updateModel(model: { [key: string]: FormItem }, form: FormGroup): { [key: string]: FormItem } {
        _.forEach(model, (item: FormItem, index: string) => {
            model[index].control = form.controls[index] as FormControl;

            model[index].value = function (val?: any) {
                if (!val) return this.control.value;

                form.controls[index].patchValue(val);
            };

            model[index].isValid = function (val?: any) {
                return (((model[index].hidden) && model[index].hidden()) || form.controls[index].disabled) ? true : form.controls[index].valid;
            };

            model[index].cssClass = this.getFormItemStyles(item);

            if (item.type === FormItemType.date && !item.dateOptions) {
                item.dateOptions = {
                    firstDayOfWeek: 'mo',
                    format: 'YYYY-MM-DD',
                    closeOnSelect: true,
                    disableKeypress: true,
                    locale: null
                }
            }

            if (item.type === FormItemType.time && !item.timeOptions) {
                item.timeOptions = {
                    showSeconds: false
                }
            }
        });

        return model;
    }

    getFormKeys(model: { [key: string]: FormItem }): string[] {
        const formKeys: string[] = [];

        _.forEach(model, (item: FormItem, index: string) => {
            formKeys.push(index);
        });

        return formKeys;
    }

    private getFormItemStyles(item: FormItem): string {
        let cssClass = 'col-sm-6 ';

        if ((item.style) && item.style.length > 0) {
            item.style.forEach((style: FormItemStyle) => {
                switch (style) {
                    case FormItemStyle.SingleRow:
                        cssClass = cssClass.replace('col-sm-6 ', '');
                        cssClass += 'col-sm-12 ';
                        break;
                    case FormItemStyle.BreakOnBefore:
                        cssClass += 'break-on-before ';
                        break;
                    case FormItemStyle.BreakOnAfter:
                        cssClass += 'break-on-after ';
                        break;
                    case FormItemStyle.WidthThird:
                        cssClass = cssClass.replace('col-sm-6 ', '');
                        cssClass += 'col-sm-4 ';
                        break;
                    case FormItemStyle.WidthFourth:
                        cssClass = cssClass.replace('col-sm-6 ', '');
                        cssClass += 'col-sm-3 ';
                        break;
                }
            });
        }

        return cssClass;
    }

    uploadFile(event, modelItem, changeDetectorRef: ChangeDetectorRef): void {
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, function (file) {
                return file.status !== 'uploaded-file';
            }),
        });

        this.redux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data[1] && data[1].Data) {
                    let errorMessage;

                    _.each(data[1].Data, (file) => {
                        if (file.error) {
                            errorMessage = file.error;
                            event.target.updateFileStatus(file.id, 'file-error');
                        } else {
                            event.target.updateFileStatus(file[0].id, 'uploaded-file');
                            modelItem.control.patchValue(file[0].fileID);
                            modelItem.fileData = {
                                fileID: file[0].fileID,
                                hash: file[0].fileHash,
                                name: file[0].fileTitle
                            }
                        }
                    });

                    if (errorMessage) {
                        this.toaster.pop('error', errorMessage);
                    }

                    if (data[1].Data.length === 0) {
                        modelItem.control.patchValue(null);
                        modelItem.fileData = null;
                    }

                    changeDetectorRef.markForCheck();
                    changeDetectorRef.detectChanges();
                }
            },
            (data) => {
                let errorMessage;

                _.each(data[1].Data, (file) => {
                    if (file.error) {
                        errorMessage += file.error + '<br/>';
                        event.target.updateFileStatus(file.id, 'file-error');
                    }
                });

                if (errorMessage) {
                    if (errorMessage) {
                        this.toaster.pop('error', errorMessage);
                    }
                }
            })
        );
    }
}
