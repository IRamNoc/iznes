import { FormControl, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import {values} from 'lodash';

export function dirty(form) {
    markAsDirty(<AbstractControl>form);

    if (form.controls) {
        values(form.controls).forEach(control => {
            dirty(<FormGroup|FormArray>control);
        });
    }
}

export function scrollToFirstError(element){
    const firstError: Element = element.querySelector('.ng-invalid:not(form)');

    if(firstError){
        firstError.scrollIntoView();
    }
}

export function markAsDirty(control: AbstractControl) {
    control.markAsDirty();
    control.markAsTouched();
}