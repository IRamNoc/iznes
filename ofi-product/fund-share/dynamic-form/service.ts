import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {FormItem, FormItemType} from './DynamicForm';

@Injectable()
export class DynamicFormService {

    constructor() {}

    generateForm(model: { [key: string]: FormItem }): FormGroup {
        const form = new FormGroup({});

        _.forEach(model, (item: FormItem, index: string) => {
            const formControl: FormControl = this.generateControl(item);

            form.addControl(index, formControl);
        });

        return form;
    }

    private generateControl(item: FormItem): FormControl {
        return new FormControl(item.preset, item.validator);
    }

    updateModel(model: { [key: string]: FormItem }, form: FormGroup): { [key: string]: FormItem } {
        _.forEach(model, (item: FormItem, index: string) => {
            model[index].control = form[index];
            (model[index].value as any) = function() {
                return this.control.value;
            }
        });

        return model;
    }

}