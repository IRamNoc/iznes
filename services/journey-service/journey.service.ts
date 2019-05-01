/* Core imports. */
import { Injectable, Output, EventEmitter } from '@angular/core';

/* Redux imports. */
import { select, NgRedux } from '@angular-redux/store';

/* RXJS imports. */
import { Observable } from 'rxjs/';

/* Journey actions. */
import { Journey, SET_JOURNEY, END_JOURNEY } from '@setl/core-store';

@Injectable()
export class JourneyService {
    /* Watch the journeys array. */
    @select(['journeys', 'journeys'])
    journeys$: Observable<any>;

    private journeys: Journey[] = [];
    private registeredEndings: {[key: string]: Function} = {};

    /* Constructor. */
    constructor(
        private ngRedux: NgRedux<any>,
    ) {
        /* Subscribe for the list. */
        this.journeys$.subscribe((journeys) => {
            /* Set the list... */
            this.journeys = journeys;
        });
    }

    /**
     * Starts a journey and inserts it into redux.
     *
     * @param name [description]
     * @param meta [description]
     */
    public startJourney (name: string, meta: object = {}): void {
        /* Return the promise. */
        this.ngRedux.dispatch({
            type: SET_JOURNEY,
            payload: {
                name,
                meta,
            },
        });
    }

    /**
     * Ends a journey, removing it from redux and it's resolve callback.
     *
     * @param  name [description]
     * @return      [description]
     */
    public endJourney (name: string): Promise<any> {
        /* Return a promise... */
        return new Promise((resolve, reject) => {
            /* ...and register the resolve and an ending... */
            this.registeredEndings[name] = resolve;

            /* ...now trigger the check for endings. */
            this.checkEndings();
        });
    }

    /**
     * Scans through journeys checking if we have a registered ending for them.
     */
    private checkEndings (): void {
        /* Check that we have journeys... */
        if (! this.journeys || ! this.journeys.length) {
            return;
        }

        /* If we do, let's loop them... */
        this.journeys.map && this.journeys.map((journey) => {
            /* ...check if we have an ending for this one... */
            if (this.registeredEndings[journey.name]) {
                /* ...if we do, let's call it, */
                this.registeredEndings[journey.name](journey.meta);
                /* then delete it. */
                delete this.registeredEndings[journey.name];

                /* Now we'll end the journey in redux. */
                this.ngRedux.dispatch({
                    type: END_JOURNEY,
                    payload: {
                        name: journey.name,
                    },
                });
            }
        });
    }
}
