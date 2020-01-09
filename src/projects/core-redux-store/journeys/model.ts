/**
 * Legal Entity Interfaces.
 */

/* Data definitions. */
export interface Journey {
    name: string;
    meta?: object;
}

/* Redux structures. */
export interface JourneyState {
    journeys: Journey[];
}
