import * as _ from 'lodash';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux } from '@angular-redux/store';
import { FileService } from '@setl/core-req-services/file/file.service';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { ToasterService } from 'angular2-toaster';

import { FormItem, FormItemType, FormItemStyle, FormElement, isFormHeader, isFormItem } from './DynamicForm';

@Injectable()
export class DynamicFormService {

    constructor(private fileService: FileService,
                private toaster: ToasterService,
                private redux: NgRedux<any>) {
    }

    generateForm(model: { [key: string]: FormElement }): FormGroup {
        const form = new FormGroup({});

        _.forEach(model, (item: FormElement, index: string) => {
            if (isFormItem(item)) {
                const formControl: FormControl =
                    this.generateControl(model as { [key: string]: FormItem }, index, item as FormItem);

                form.addControl(index, formControl);
            }
        });

        return form;
    }

    private generateControl(model: { [key: string]: FormItem }, index: string, item: FormItem): FormControl {
        let preset;

        if (item.preset !== undefined) {
            if (item.type === FormItemType.boolean && (item.preset === '1' || item.preset === '0')) {
                preset = item.preset === '1' ? true : false;
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

    updateModel(model: { [key: string]: FormElement }, form: FormGroup): { [key: string]: FormElement } {
        _.forEach(model, (element: FormElement, index: string) => {
            if (isFormItem(element)) {
                const item: FormItem = element as FormItem;
                const modelItem: FormItem = model[index] as FormItem;

                modelItem.control = form.controls[index] as FormControl;

                modelItem.value = function (val?: any) {
                    if (!val) return this.control.value;

                    form.controls[index].patchValue(val);
                };

                modelItem.isValid = function (val?: any) {
                    return (((modelItem.hidden) && modelItem.hidden()) ||
                        form.controls[index].disabled) ? true : form.controls[index].valid;
                };

                if (item.type === FormItemType.date && !item.dateOptions) {
                    item.dateOptions = {
                        firstDayOfWeek: 'mo',
                        format: 'YYYY-MM-DD',
                        closeOnSelect: true,
                        disableKeypress: true,
                        locale: null,
                    };
                }

                if (item.type === FormItemType.time && !item.timeOptions) {
                    item.timeOptions = {
                        showSeconds: false,
                    };
                }
            }

            model[index].cssClass = this.getFormItemStyles(element);
        });

        return model;
    }

    getFormKeys(model: { [key: string]: FormElement }): string[] {
        const formKeys: string[] = [];

        _.forEach(model, (item: FormElement, index: string) => {
            formKeys.push(index);
        });

        return formKeys;
    }

    private getFormItemStyles(item: FormElement): string {
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
            files: _.filter(event.files, (file) => {
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
                                name: file[0].fileTitle,
                            };
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
            }),
        );
    }
}
