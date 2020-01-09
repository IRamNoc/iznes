import {
    Injectable,
    EventEmitter
} from '@angular/core';

/**
 * Option List Service
 * -------------------
 * Used for cross option list communication.
 *  - Closing all lists when a new one is open.
 */
@Injectable()
export class MenuOptionListService {
    /* Close Event Emitter. */
    public closeEmitter:EventEmitter<number> = new EventEmitter();
    public getCloseEmitter () {
        return this.closeEmitter;
    }

    /* Constructor. */
    constructor () {
        /* Stub. */
    }

    /**
     * Send Close Signal
     * -----------------
     * Emits to close all lists.
     *
     * @return {Promise} - a promise that resolves when the emit is complete.
     */
    public emitClose ():Promise<any> {
        return new Promise((resovle) => {
            /* Emit the event. */
            this.closeEmitter.emit(1);

            /* Resolve. */
            resovle();
        });
    }
}
