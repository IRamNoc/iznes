import {Injectable, EventEmitter} from '@angular/core';


@Injectable()
export class MenuDropdownService {
    /* Private properties. */
    private registeredDropdowns:any = [];

    /* Activation event, is emmited every time a dropdown requests to be
       activated. */
    public activationEvent:EventEmitter<{id:number}> = new EventEmitter;

    constructor () {
        /* Stub. */
    }

    /**
     * Register Dropdown
     * -----------------
     * Registers a dropdown, giving the dropdown an ID.
     *
     * @return {identifier} - Identifier.
     */
    public registerDropdown ():number {
        /* Generate and push into register. */
        let identifier = this.registeredDropdowns.length;
        this.registeredDropdowns[identifier] = {
            'active': false,
        };

        /* Return it. */
        return identifier;
    }

    /**
     * Request Activation
     * ------------------
     * Asks to set a certain dropdown active, usually only sent from a click
     * event.
     *
     * @param {identifier} - Identifier.
     */
    public requestActivation (identifier):void {
        /* Ok, let's check if the ID exists. */
        if ( this.registeredDropdowns[identifier] ) {

            /* Set all the others to false. */
            for ( let key in this.registeredDropdowns ) {
                this.registeredDropdowns[key].active = false;
            }

            /* Set our one to active. */
            this.registeredDropdowns[identifier].active = true;

            /* Emit the activation. */
            this.emitActivation(identifier);
        }

        /* Return. */
        return;
    }

    /**
     * Request Deactivation
     * ------------------
     * Asks to set a certain dropdown inactive, usually only sent from a click
     * event too.
     *
     * @param {identifier} - Identifier.
     */
    public requestDeactivation (identifier):void {
        /* Ok, let's check if the ID exists. */
        if ( this.registeredDropdowns[identifier] ) {

            /* Set our one to active. */
            this.registeredDropdowns[identifier].active = false;

            /* Emit the activation. */
            this.emitActivation(-1);
        }

        /* Return. */
        return;
    }

    private emitActivation (identifier:number):void {
        /* Fire emit. */
        this.activationEvent.emit( {id: identifier} );
    }
}
