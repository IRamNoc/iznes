import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormItem, FormItemType, FormItemStyle } from './DynamicForm';
import { DynamicFormService } from './service';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-dynamic-form',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicFormComponent implements OnInit {

    private formModel: { [key: string]: FormItem };
    @Input() set model(model: { [key: string]: FormItem }) {
        this.formModel = model;
        this.generateForm();
    }

    get model() {
        return this.formModel;
    }

    form: FormGroup;
    formKeys: string[];

    constructor(private service: DynamicFormService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    private generateForm(): void {
        this.form = this.service.generateForm(this.formModel);
        this.formKeys = this.service.getFormKeys(this.formModel);
        this.service.updateModel(this.formModel, this.form);

        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Return the value of the form control's `touched` property.
     *
     * @param {object} formItem - The form control.
     *
     * @return {boolean} - The value of `touched`.
     */
    isTouched(formItem: FormItem): boolean {
        return formItem.control.touched;
    }

    /**
     * Determine whether the form control has errors.
     *
     * @param {object} formItem - The form control.
     *
     * @return {boolean} - True if error, otherwise false.
     */
    hasErrorMessage(formItem: FormItem): boolean {
        if (formItem.control.errors !== null && typeof formItem.control.errors === 'object') {
            return true;
        }
        return false;
    }

    /**
     * Return the form control's error message.
     *
     * @param {object} formItem - The form control.
     *
     * @return {string} - The error message.
     */
    getErrorMessage(formItem: FormItem): string {
        if (formItem.control.errors !== null && typeof formItem.control.errors === 'object') {
            let errorMessage = Object.keys(formItem.control.errors)[0];

            const ngValidatorErrorMessages = {
                min: 'Value is too small.',
                max: 'Value is too large.',
                required: 'Field is required.',
                email: 'Invalid email.',
                minlength: 'Value is too short.',
                maxlength: 'Value is too long.',
                pattern: 'Invalid format.',
            };

            if (ngValidatorErrorMessages.hasOwnProperty(errorMessage)) {
                errorMessage = ngValidatorErrorMessages[errorMessage];
            }
            return errorMessage;
        }
        return '';
    }

    /**
    * Determine whether the form control is hidden.
    *
    * @param {string} item - The name of the form control.
    *
    * @return {boolean} - True if hidden, otherwise false.
    */
    isHidden(item: string): boolean {
        if (this.formModel[item].hidden !== undefined) {
            return this.formModel[item].hidden();
        }
        return false;
    }

    itemHasBreakAfter(item: FormItem): boolean {
        return (item.style) && item.style.indexOf(FormItemStyle.BreakOnAfter) !== -1;
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
