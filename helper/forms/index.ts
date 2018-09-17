import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {values} from 'lodash';

export function dirty(form) {
    if (form.controls) {
        values(form.controls).forEach(control => {
            dirty(<FormGroup|FormArray>control);
        });
    } else{
        markAsDirty(<FormControl>form);
    }
}

export function markAsDirty(control: FormControl) {
    control.markAsDirty();
    control.markAsTouched();
}