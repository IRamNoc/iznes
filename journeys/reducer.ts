/* Helper classes and functions. */
import * as _ from 'lodash';
import { Action } from 'redux';
import { fromJS, List, Map } from 'immutable';

/* Models. */
import { JourneyState, Journey } from './model';

/* Actions. */
import {
    SET_JOURNEY,
    END_JOURNEY,
} from './actions';

/* The intitial state. */
const initialState: JourneyState = {
    journeys: [],
};

/**
 * The reducer.
 *
 * @param {Object} state - The current state.
 * @param {Action} action - The newly dispatched action.
 *
 * @return {Object} - The new state.
 */
export const journeyReducer = function (
    state: JourneyState = initialState,
    action: Action,
) {
    /* Switch for the action type. */
    switch (action.type) {
    /* Set a journey. */
    case SET_JOURNEY:
        return handleSetJourney(state, action);

    /* End a journey. */
    case END_JOURNEY:
        return handleEndJourney(state, action);

        /* Default to returning the state unchanged. */
    default:
        return state;
    }
};

/**
 * Adds a journey to the journeys array.
 *
 * @param {Object} state - The current state.
 * @param {Action} action - The newly dispatched action.
 *
 * @return {Object}	- The new state.
 */
function handleSetJourney(state, action) {
    /* Get the journey from the action. */
    const newJourney = action.payload;

    /* Add the new journey to the array. */
    const newState = Object.assign({}, state, {
        journeys: [...state.journeys, newJourney],
    });

    /* Return new state. */
    return newState;
}

/**
 * Removes a journey from the journeys array.
 *
 * @param {Object} state - The current state.
 * @param {Action} action - The newly dispatched action.
 *
 * @return {Object}	- The new state.
 */
function handleEndJourney(state, action) {
    /* Get the journey that needs deleteing from the payload. */
    const delJourney = action.payload;

    /* Filter the old journeys array and set it as the new state. */
    const newState = Object.assign({}, state, {
        journeys: [...state.journeys.filter(journey => journey.name !== delJourney.name)],
    });

    /* Return new state. */
    return newState;
}
