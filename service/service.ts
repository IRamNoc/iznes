/* Core imports. */
import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

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
    private _subscriptions: Array<any> = [];

    /* Constructor. */
    constructor() {
        /* Stub. */
        this._forms = JSON.parse(localStorage.getItem('persist') || '{}');
    }

    /**
     * Watch Form
     * ----------
     * Allows a form group value changes observable to be monitored and for the value to be restored.
     *
     * @param {string} name
     * @param {FormGroup} group
     */
    public watchForm(name: string, group: FormGroup): FormGroup {
        /* Check if we have a state for this form. */
        if (this._forms[name]) {
            group.setValue(this._forms[name]);
        }

        /* Unsubscribe if already subscribed. */
        if (this._subscriptions[name]) {
            this._subscriptions[name].unsubscribe();
        }

        /* Subscribe to the value changes. */
        this._subscriptions[name] = group.valueChanges.subscribe((data) => {
            /* Set the form. */
            this._forms[name] = data;

            /* Save to localStorage. */
            localStorage.setItem('persist', JSON.stringify(this._forms));
        });

        /* Return. */
        return group;
    }
}
