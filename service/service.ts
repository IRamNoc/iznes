/* Core imports. */
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { select } from '@angular-redux/store';

/* Request service. */
import { PersistRequestService } from '@setl/core-req-services';

/* Low dash. */
import * as _ from 'lodash';

/* Decorator. */
@Injectable()

/* Class. */
export class PersistService {
    /* Settables. */
    private inputBuffer: number = .5; // Number of seconds to wait for another key press before saving form state.

    /* Private properties. */
    private forms: any = {};
    private subscriptions: any[] = [];
    private wait: any;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    /* Constructor. */
    constructor(private persistRequestService: PersistRequestService) {
        /* Stub. */
    }

    /**
     * Watch Form
     * ----------
     * Allows a form group value changes observable to be monitored and for the value to be restored.
     *
     * @param {string} name - The name identifier of the form, must coincide with the name registered in the database.
     * @param {FormGroup} group - The FormGroup to be watched and restored.
     * @param {string|null} context - The context of the form (for the case of one form used with several parameters).
     * @param {Object} options - Configuration options (e.g. isWalletSensitive to save a form against a wallet ID).
     *
     * @return {FormGroup} - The FormGroup originally passed in.
     */
    public watchForm(name: string, group: FormGroup, context: string = null, options: object = {}): any {
        console.log(' |-- Persist - watchForm: ', name);

        /* Check if the form is wallet sensitive. */
        if (options.hasOwnProperty('isWalletSensitive') && options['isWalletSensitive']) {
            /* Subscribe for changes on the wallet. */
            this.connectedWalletOb.subscribe((wallet) => {
                /* If the wallet has changed... */
                if (wallet !== Number(context)) {
                    /* ...watch a new form instance for the changed wallet using the wallet as the form context. */
                    this.watchForm(name, group, String(wallet), { isWalletSensitive: true });
                }
            });
        }

        /* Check if we have a state for this form. */
        const promise = this.persistRequestService.loadFormState(name, context).then((data) => {
            /* Get recovered data. */
            const recoveredData = JSON.parse(_.get(data, '[1].Data[0].data', false));

            /* If we couldn't then clear the form values. */
            if (!recoveredData) {
                if (options['reset'] !== false) {
                    group.reset();
                }
                console.warn(' | Failed to read a previous state, maybe there isn\'t one?: ', data);
            } else {
                /* If it was ok, so remove sensitive data and clear null values before patching */
                const cleanedData = this.stripSensitiveData(recoveredData);
                try {
                    /* Call set value. */
                    group.patchValue(cleanedData);
                } catch (e) {
                    /* Else, we'll catch the error. */
                    console.warn(' | Failed to use a previous state: ', e);
                }
            }
        }).catch((error) => {
            console.warn(' | Failed to fetch a previous state for \'' + name + '\': ', error);
        });

        /* Re-subscribe to changes. */
        this.subscribeToChanges(name, group, context);

        /* Return. */
        if(options['returnPromise']){
            return promise;
        }

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
     * @return {boolean} - True for successful unsubscription; false for no subscription that needed to be unsubscribed.
     */
    public unwatchForm(name: string): boolean {
        console.log(' |-- Persist - unwatchForm: ', name);
        /* If we have a subscription... */
        if (this.subscriptions[name]) {
            console.log(' | Unsubscribing from group.');
            /* ...unsubscribe... */
            this.subscriptions[name].unsubscribe();

            /* ...and return true. */
            return true;
        }

        /* Else, return false, as we didn't unsubscribe anything. */
        return false;
    }

    /**
     * Refresh State
     * -------------
     * Refreshes the saved state of a form to the value of a new FormGroup.
     *
     * @param  {string} name - The name of the form.
     * @param  {FormGroup} group - The new FormGroup object.
     * @param  {string|null} context - The context of the form (for the case of one form used with several parameters).
     *
     * @return {FormGroup} group - The FormGroup passed in.
     */
    public refreshState(name: string, group: FormGroup, context: string = null): FormGroup {
        console.log(' |--- Persist - clearState: ', name);
        /* Let's firstly set the new form value. */
        this.forms[name] = this.stripSensitiveData(group.value);
        console.log(' | Form value in service: ', this.forms[name]);

        /* Then let's save the empty value to the server. */
        this.persistRequestService.saveFormState(name, JSON.stringify(this.forms[name]), context).then((saveData) => {
            /* Stub. */
            console.log(' | Form state refresh reply: ', saveData);
        }).catch((error) => {
            console.warn(' | Failed to refresh this form\'s state: ', error);
        });

        /* Re-subscribe to changes. */
        this.subscribeToChanges(name, group, context);

        /* Return. */
        return group;
    }

    /**
     * Subscribe to Changes
     * --------------------
     * Subscribes a watcher to the valueChanges observable of a FormGroup.
     *
     * @param  {string} name - The form name.
     * @param  {FormGroup} group - The FormGroup.
     * @param  {string|null} context - The context of the form (for the case of one form used with several parameters).
     *
     * @return {boolean} - True.
     */
    private subscribeToChanges(name: string, group: FormGroup, context: string = null): boolean {
        /* Unsubscribe if already subscribed. */
        if (this.subscriptions[name]) {
            console.log(' | Unsubscribing from group.');
            this.subscriptions[name].unsubscribe();
        }

        /* Subscribe to the value changes. */
        console.log(' | Subscribing to group.');
        this.subscriptions[name] = group.valueChanges.subscribe((data) => {

            /* Set the form. */
            this.forms[name] = this.stripSensitiveData(data);

            /* Check if we're already waiting for another change, remove the old timeout. */
            if (this.wait) {
                clearTimeout(this.wait);
            }

            /* Set the timeout to then send an update up the socket, but wait N seconds in case the user types again. */
            const secondsToWait = .5; // Seconds.
            this.wait = setTimeout(
                () => {
                    /* Send the request. */
                    this.persistRequestService.saveFormState(
                        name,
                        JSON.stringify(this.forms[name]),
                        context).then((saveData) => {
                        /* Stub. */
                        console.log(' | Form state save reply: ', saveData);
                    }).catch((error) => {
                        console.warn(' | Failed to save this form\'s state: ', error);
                    });
                },
                1000 * this.inputBuffer);
        });

        /* Return. */
        return true;
    }

    /**
     * Strip Passwords
     * ---------------
     * Strips passwords from the form data.
     *
     * @param  {any} data - The form data.
     * @return {void}
     */
    private stripSensitiveData(data: any): any {
        /* Create a new object, with no references, before we mutate it. */
        const newData = Object.assign({}, data);

        /* Return. */
        return this.loopAndRemovePassword(newData);
    }

    private loopAndRemovePassword(object) {
        /* Check if this is an object... */
        if (object && typeof object === 'object' && !object.length) {
            /* Loop over keys... */
            let key;
            for (key in object) {

                /* ...if the key contains password or the value is null, delete it... */
                if (key.indexOf('password') !== -1 || object[key] === null) {
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
