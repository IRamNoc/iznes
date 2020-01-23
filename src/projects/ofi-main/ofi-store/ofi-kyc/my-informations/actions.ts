import {name} from './__init__';
import {KycMyInformations} from './model';
import {Action} from 'redux';

export const SET_INFORMATIONS_FROM_API = `${name}/SET_INFORMATIONS_FROM_API`;
export const SET_INFORMATIONS = `${name}/SET_INFORMATIONS`;

export interface KycMyInformationsAction extends Action {
    type: string;
    payload: KycMyInformations;
}

export function setInformations(newInfo: KycMyInformations) {
    return {
        type: SET_INFORMATIONS,
        payload: newInfo,
    };
}
