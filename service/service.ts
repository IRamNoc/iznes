/* Core imports. */
import {Injectable} from '@angular/core';

/* Types. */
interface Control {
    name: string;
}

/* Decorator. */
@Injectable()

/* Class. */
export class PersistService {
    /* Private properties. */
    private _controls: Array<Control> = [];
    private _forms: any = {};

    /* Constructor. */
    constructor() {
        /* Stub. */
        this._forms = JSON.parse(localStorage.getItem('persist') || '{}');
    }

    /**
     * Register Form
     * -------------
     * Tells the service that a form now exists.
     *
     * @param {string} name - the name of the form.
     * @return {void}
     */
    public registerForm(name: string): any {
        /* Check if the form is recovered. */
        if (this._forms[name]) {
            return this._forms[name];
        }

        /* Return. */
        return false;
    }

    /**
     * Update Form Data
     * ----------------
     * Sets the form data, and sends the data to the server for storage.
     *
     * @param {string} id
     * @param data
     */
    public updateFormData(id: string, data: any): void {
        /* Set the data. */
        this._forms[id] = data;

        /* TODO - send the form data to the server. */
        localStorage.setItem('persist', JSON.stringify(this._forms));
        console.log(' | FORMS: ', this._forms);

        /* Return. */
        return;
    }
}
