import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {FormItem, FormItemType, FormItemStyle} from './DynamicForm';

@Injectable()
export class DynamicFormService {

    constructor() {}

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
        
        if(item.preset) {
            if(item.type === FormItemType.boolean && (item.preset === "1" || item.preset === "0")) {
                preset = item.preset === "1" ? true : false;
            } else {
                preset = item.preset;
            }
        } else {
            if(item.type === FormItemType.boolean) preset = false;
            if(item.type === FormItemType.text) preset = '';
            if(item.type === FormItemType.date) preset = '';
            if(item.type === FormItemType.number) preset = null;
            if(item.type === FormItemType.list) preset = null;
        }

        const validator = (item.required && !item.validator) ? [Validators.required] : item.validator;

        const formControl = new FormControl(preset, validator);

        if(item.disabled) formControl.disable();

        return formControl;
    }

    updateModel(model: { [key: string]: FormItem }, form: FormGroup): { [key: string]: FormItem } {
        _.forEach(model, (item: FormItem, index: string) => {
            model[index].control = form.controls[index] as FormControl;

            (model[index].value as any) = function(val?: any) {
                if(!val) return this.control.value;
                
                form.controls[index].patchValue(val);
            };

            (model[index].isValid as any) = function(val?: any) {
                return ((model[index].hidden) && model[index].hidden()) ? true : form.controls[index].valid;
            };
            
            (model[index].cssClass as any) = this.getFormItemStyles(item);

            if(item.type === FormItemType.date && !item.dateOptions) {
                item.dateOptions = {
                    firstDayOfWeek: 'mo',
                    format: 'YYYY-MM-DD',
                    closeOnSelect: true,
                    disableKeypress: true,
                    locale: null
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

        if((item.style) && item.style.length > 0) {
            item.style.forEach((style: FormItemStyle) => {
                switch (style) {
                    case FormItemStyle.SingleRow:
                        cssClass = cssClass.replace('col-sm-6', 'col-sm-12');
                        break;
                    case FormItemStyle.BreakOnBefore:
                        cssClass += 'break-on-before ';
                        break;
                    case FormItemStyle.BreakOnAfter:
                        cssClass += 'break-on-after ';
                        break;
                }
            });
        }

        return cssClass;
    }
}