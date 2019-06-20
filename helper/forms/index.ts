import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import {values} from 'lodash';

export function dirty(form) {
    markAsDirty(<AbstractControl>form);

    if (form.controls) {
        values(form.controls).forEach(control => {
            dirty(<FormGroup|FormArray>control);
        });
    }
}

export function scrollToFirstError(element) {
    const firstError: HTMLElement = element.querySelector('.ng-invalid:not(form)');

    if (firstError) {
        // Reset scrollTop to get correct distance from top from getBoundingClientRect
        document.querySelector('main.content-area').scrollTop = 0;
        // Add 60 to account for top nav
        document.querySelector('main.content-area').scrollTop = firstError.getBoundingClientRect().top - 100;
    }
}

export function markAsDirty(control: AbstractControl) {
    control.markAsDirty();
    control.markAsTouched();
}
