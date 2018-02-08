/* Core imports. */
import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

/* Request service. */
import {PersistRequestService} from "@setl/core-req-services";

/* Low dash */
import _ from 'lodash';

/* Decorator. */
@Injectable()

/* Class. */
export class PersistService {
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
     *
     * @return {FormGroup} - The FormGroup origininally passed in.
     */
    public watchForm(name: string, group: FormGroup): FormGroup {
        console.log(' |-- Persist - watchForm: ', name);
        /* Check if we have a state for this form. */
        this._persistRequestService.loadFormState(name).then((data) => {
            /* Get recovered data. */
            const recoveredData = JSON.parse(_.get(data, '[1].Data[0].data', false));

            /* If we couldn't then we'll just return. */
            if (!recoveredData) {
                console.warn(' | Failed to read a previous state, maybe there isn\'t one?: ', data);
            } else {
                /* If it was ok, we'll try set the value. */
                try {
                    /* Call set value. */
                    group.setValue(recoveredData);
                } catch (e) {
                    /* Else, we'll catch the error. */
                    console.warn(' | Failed to use a previous state: ', e);
                }
            }
        }).catch((error) => {
            console.warn(' | Failed to fetch a previous state for \'' + name + '\': ', error);
        });

        /* Unsubscribe if already subscribed. */
        if (this._subscriptions[name]) {
            console.log(' | Unsubscribing from group.');
            this._subscriptions[name].unsubscribe();
        }

        /* Subscribe to the value changes. */
        console.log(' | Subscribing to group.');
        this._subscriptions[name] = group.valueChanges.subscribe((data) => {
            /* Set the form. */
            this._forms[name] = data;

            /* Check if we're already waiting for another change, remove the old timeout. */
            if (this._wait) {
                clearTimeout(this._wait);
            }

            /* Set the timeout to then send an update up the socket, but wait N seconds in case the user types again.. */
            const secondsToWait = .5; // Seconds.
            this._wait = setTimeout(() => {
                /* Send the request. */
                this._persistRequestService.saveFormState(name, JSON.stringify(this._forms[name])).then((save_data) => {
                    /* Stub. */
                    console.log(' | Form state save reply: ', save_data);
                }).catch((error) => {
                    console.warn(' | Failed to save this form\'s state: ', error);
                });
            }, 1000 * secondsToWait);
        });

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
     * @return {boolean} - True for a successful unsubscription and false for no subscription that needed to be
     * unsubscribed.
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
     * @param  name  - the name of the form.
     * @param  group - the new FormGroup object.
     *
     * @return group - the FormGroup passed in.
     */
    public refreshState(name: string, group: FormGroup): FormGroup {
        console.log(' |--- Persist - clearState: ', name);
        /* Let's firstly set the new form value. */
        this._forms[name] = group.value;
        console.log(' | Form value in service: ', this._forms[name]);

        /* Then let's save the empty value to the server. */
        this._persistRequestService.saveFormState(name, JSON.stringify(this._forms[name])).then((save_data) => {
            /* Stub. */
            console.log(' | Form state refesh reply: ', save_data);
        }).catch((error) => {
            console.warn(' | Failed to refresh this form\'s state: ', error);
        });

        /* Return. */
        return group;
    }
}
