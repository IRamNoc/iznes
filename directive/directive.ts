/* Angular/vendor imports. */
import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
/* Package imports. */
import {PersistService} from '../service/service';

/* Decorator. */
@Directive({
    selector: '[persist]'
})

/* Export directive class. */
export class PersistDirective implements AfterViewInit {
    /* Public variables. */
    private _id: string = "";
    private _form_data: any = {};
    private _el: ElementRef;
    private _trigger_elms: Array<string> = [
        'input', 'textarea'
    ]; // Add tag names that should trigger form saves here.

    /* Constructor. */
    constructor(_el: ElementRef,
                private _persistService: PersistService) {
        /* Set el. */
        this._el = _el;
    }

    /* After View Init. */
    public ngAfterViewInit() {
        /* Get the form ID. */
        console.log(' |--- Persist');
        this._id = this._el.nativeElement.getAttribute('persist');
        console.log(' | init: ' + this._id);

        /* Register the form. */
        let register = this._persistService.registerForm(this._id);

        /* If register came back with data, then we should recover the form. */
        if (register) {
            /* Recover. */
            this.setForm(register);
        }

        let i, j, elms;
        /* Loop tagnames. */
        for (i = 0; i < this._trigger_elms.length; i++) {
            /* Get elements by tag. */
            elms = this._el.nativeElement.getElementsByTagName(this._trigger_elms[i]);

            /* Loop elements. */
            for (j = 0; j < elms.length; j++) {
                /* Add listener. */
                elms[j].addEventListener("keyup", () => {
                    this.readForm();
                });
            }
            console.log(' | attached ' + this._trigger_elms[i]);
        }
    }

    /**
     * Read Form
     * ---------
     * Pulls the form's data from each input and stores it in the directive.
     */
    public readForm(): void {
        /* Loop over the inputs. */
        let i, inputs = this._el.nativeElement.getElementsByTagName('input');
        for (i = 0; i < inputs.length; i++) {
            let identifier = inputs[i].getAttribute('id') || inputs[i].getAttribute('name');
            this._form_data[identifier] = inputs[i].value;
        }

        /* Loop over the texareas. */
        let j, texareas = this._el.nativeElement.getElementsByTagName('textarea');
        for (j = 0; j < texareas.length; j++) {
            let identifier = texareas[j].getAttribute('id') || texareas[j].getAttribute('name');
            this._form_data[identifier] = texareas[j].value;
        }

        /* Send the form data to the service. */
        this._persistService.updateFormData(this._id, this._form_data);

        console.log(' | read form ', this._form_data);
        /* Return. */
        return;
    }

    public setForm(data): void {
        console.log(' | recovering saved state ', data);

        /* Loop over the inputs. */
        let i, inputs = this._el.nativeElement.getElementsByTagName('input');
        for (i = 0; i < inputs.length; i++) {
            /* Get identifier... */
            let identifier = inputs[i].getAttribute('id') || inputs[i].getAttribute('name');

            /* ...set value if we have it. */
            if (data[identifier]) {
                inputs[i].value = data[identifier];
            }
        }

        /* Loop over the texareas. */
        let j, texareas = this._el.nativeElement.getElementsByTagName('textarea');
        for (j = 0; j < texareas.length; j++) {
            /* Get identifier... */
            let identifier = texareas[j].getAttribute('id') || texareas[j].getAttribute('name');

            /* ...set value if we have it. */
            if (data[identifier]) {
                texareas[j].value = data[identifier];
            }
        }

        /* Return. */
        return;
    }
}
