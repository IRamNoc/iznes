import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {FormItem, FormItemType, FormItemStyle} from './DynamicForm';
import {DynamicFormService} from './service';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-dynamic-form',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DynamicFormComponent implements OnInit {

    private _model: { [key: string]: FormItem };
    @Input() set model(model: { [key: string]: FormItem }) {
        this._model = model;
        this.generateForm();
    }

    get model() {
        return this._model;
    }

    form: FormGroup;
    formKeys: string[];

    constructor(private service: DynamicFormService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    private generateForm(): void {
        this.form = this.service.generateForm(this._model);
        this.formKeys = this.service.getFormKeys(this._model);
        this.service.updateModel(this._model, this.form);

        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    showRequiredFieldText(type: FormItemType): boolean {
        return type === FormItemType.text ||
            type === FormItemType.number;
    }

    isHidden(item: string): boolean {
        if (this._model[item].hidden !== undefined) {
            return this._model[item].hidden();
        }

        return false;
    }

    itemHasBreakAfter(item: FormItem): boolean {
        return (item.style) && item.style.indexOf(FormItemStyle.BreakOnAfter) != -1;
    }

    trackFormItemByFn(index: number, item: FormItem): number {
        return index;
    }

    onDropFiles(event, modelItem) {
        this.service.uploadFile(event, modelItem, this.changeDetectorRef);
    }

    showDropdown(item: FormItem): boolean {
        return (!!item.listItems) && item.listItems.length > 0;
    }

}
