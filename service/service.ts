/* Core imports. */
import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import * as _ from 'lodash';
/* Request service. */
import {PersistRequestService} from "@setl/core-req-services";

/* Low dash */

/* Decorator. */
@Injectable()

/* Class. */
export class PersistService {
    /* Settables. */
    private _inputBuffer: number = .5; // Number of seconds to wait for another key press before saving form state.

    /* Private properties. */
    private _forms: any = {};
    private _subscriptions: Array<any> = [];
    private _wait: any;

    /* Constructor. */
    constructor(private _persistRequestService: PersistRequestService) {
        /* Stub. */
    }

    /**
     * Watch Form
     * ----------
     * Allows a form group value changes observable to be monitored and for the value to be restored.
     *
     * @param {string} name - The name identifier of the form, must coenside with the name registered in the database.
     * @param {FormGroup} group - The FormGroup to be watched and restored.
     * @param  {string|null} context - the context of the form (for the case of one form used with several parameters).
     *
     * @return {FormGroup} - The FormGroup origininally passed in.
     */
    public watchForm(name: string, group: FormGroup, context: string = null): FormGroup {
        console.log(' |-- Persist - watchForm: ', name);
        /* Check if we have a state for this form. */
        this._persistRequestService.loadFormState(name, context).then((data) => {
            /* Get recovered data. */
            const recoveredData = JSON.parse(_.get(data, '[1].Data[0].data', false));

            /* If we couldn't then we'll just return. */
            if (!recoveredData) {
                console.warn(' | Failed to read a previous state, maybe there isn\'t one?: ', data);
            } else {
                /* If it was ok, we'll try set the value. */
                try {
                    /* Call set value. */
                    group.patchValue(recoveredData);
                } catch (e) {
                    /* Else, we'll catch the error. */
                    console.warn(' | Failed to use a previous state: ', e);
                }
            }
        }).catch((error) => {
            console.warn(' | Failed to fetch a previous state for \'' + name + '\': ', error);
        });

        /* Re-subscribe to changes. */
        this._subscribeToChanges(name, group, context);

        /* Return. */
        console.log(' | returning group.');
        return group;
    }

    /**
     * Unwatch Form
     * ------------
     * Removes the subscription on a FormGroup that was already added passed into watchForm, if the form isn't already
     * being watched then false is returned.
     *
     * @param {string} name - The name of a form.
     *
     * @return {boolean}    - True for a successful unsubscription and false for no subscription that needed to be unsubscribed.
     */
    public unwatchForm(name: string): boolean {
        console.log(' |-- Persist - unwatchForm: ', name);
        /* If we have a subscription... */
        if (this._subscriptions[name]) {
            console.log(' | Unsubscribing from group.');
            /* ...unsubscribe... */
            this._subscriptions[name].unsubscribe();

            /* ...and return true. */
            return true;
        }

        /* else, return false, as we didn't unsubscribe anything. */
        return false;
    }

    /**
     * Refresh State
     * -----------
     * Refreshes the saved state of a form to the value of a new FormGroup.
     *
     * @param  {string} name     - the name of the form.
     * @param  {FormGroup} group - the new FormGroup object.
     * @param  {string|null} context - the context of the form (for the case of one form used with several parameters).
     *
     * @return {FormGroup} group - the FormGroup passed in.
     */
    public refreshState(name: string, group: FormGroup, context: string = null): FormGroup {
        console.log(' |--- Persist - clearState: ', name);
        /* Let's firstly set the new form value. */
        this._forms[name] = this.stripSensitiveData(group.value);
        console.log(' | Form value in service: ', this._forms[name]);

        /* Then let's save the empty value to the server. */
        this._persistRequestService.saveFormState(name, JSON.stringify(this._forms[name]), context).then((save_data) => {
            /* Stub. */
            console.log(' | Form state refesh reply: ', save_data);
        }).catch((error) => {
            console.warn(' | Failed to refresh this form\'s state: ', error);
        });

        /* Re-subscribe to changes. */
        this._subscribeToChanges(name, group, context);

        /* Return. */
        return group;
    }

    /**
     * Subscribe to Changes
     * --------------------
     * Subscribes a watcher to the valueChanges observable of a FormGroup.
     *
     * @param  {string} name     - the form name.
     * @param  {FormGroup} group - the FormGroup.
     * @param  {string|null} context - the context of the form (for the case of one form used with several parameters).
     *
     * @return {boolean}         - true.
     */
    private _subscribeToChanges (name: string, group: FormGroup, context: string = null): boolean {
        /* Unsubscribe if already subscribed. */
        if (this._subscriptions[name]) {
            console.log(' | Unsubscribing from group.');
            this._subscriptions[name].unsubscribe();
        }

        /* Subscribe to the value changes. */
        console.log(' | Subscribing to group.');
        this._subscriptions[name] = group.valueChanges.subscribe((data) => {
            /* Set the form. */
            this._forms[name] = this.stripSensitiveData(data);

            /* Check if we're already waiting for another change, remove the old timeout. */
            if (this._wait) {
                clearTimeout(this._wait);
            }

            /* Set the timeout to then send an update up the socket, but wait N seconds in case the user types again.. */
            const secondsToWait = .5; // Seconds.
            this._wait = setTimeout(() => {
                /* Send the request. */
                this._persistRequestService.saveFormState(name, JSON.stringify(this._forms[name]), context).then((save_data) => {
                    /* Stub. */
                    console.log(' | Form state save reply: ', save_data);
                }).catch((error) => {
                    console.warn(' | Failed to save this form\'s state: ', error);
                });
            }, 1000 * this._inputBuffer);
        });

        /* Return. */
        return true;
    }

    /**
     * Strip Passwords
     * ---------------
     * Strips passwords from the form data.
     *
     * @param  {any}    data - the form data.
     * @return {void}
     */
    private stripSensitiveData (data: any): any {
        /* Create a new object, with no references, before we mutate it. */
        const newData = Object.assign({}, data);

        /* Return. */
        return this.loopAndRemovePassword(newData);
    }

    private loopAndRemovePassword (object) {
        /* Check if this is an object... */
    	if (object && typeof object == 'object' && ! object.length) {
    		/* Loop over keys... */
    		var key;
    		for (key in object) {
    			/* ...if the key contains password, delete it... */
    			if (key.indexOf('password') != -1) {
    				delete object[key];
    			} else {
                    /* ...otherwise, let's loop over this object too... */
    				this.loopAndRemovePassword(object[key]);
    			}
    		}
    	}

        /* ...finally, return the object. */
    	return object;
    }
}
