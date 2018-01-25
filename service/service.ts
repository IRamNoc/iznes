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

    /* Constructor. */
    constructor() {
        /* Stub. */
    }

    /**
     * Register Form
     * -------------
     * Tells the service that a form now exists.
     *
     * @param {string} name - the name of the form.
     * @return {void}
     */
    public registerForm(name: string): void {
        console.log('registered: ' + name);
        /* Add the form to the controls array. */
        this._controls.push({
            'name': name
        });

        /* Return. */
        return;
    }
}
